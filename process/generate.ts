import { EOL } from 'os';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import utf8 from 'utf8';
import parquet from '@dsnp/parquetjs';
import { downloadAsHTML as downloadAsHTMLWithPuppeteer } from './utils/downloadWithPuppeteer';
import { pricingRegionMapping } from './utils/pricingRegionMapping';
import { airportOverrides } from './utils/airportOverrides';
import { EdgeLocations, EdgeLocation } from '../src';

export interface LargeCityData {
  continent:    string;
  coordinates:  string;
  elevation_ft: string;
  gps_code:     string;
  iata_code:    string;
  ident:        string;
  iso_country:  string;
  iso_region:   string;
  local_code:   string | null;
  municipality: string;
  name:         string;
  type:         string;
}

export interface RegionalEdgeCache {
  city: string | null;
  country: string;
}

export interface RawEdgeLocation {
  city: string;
  country: string;
}

export interface LocationByRegion {
  region: string;
  edgeLocations: RawEdgeLocation[];
  regionalEdgeCaches: RegionalEdgeCache[];
}

const nameMapping = {
 "Manlia": "Manila",
 "Delhi": "New Delhi",
 "Colombus": "Columbus",
 "New York City": "New York",
 "Washington D.C.": "Washington",
 "Frankfurt": "Frankfurt am Main",
}

// Load airport data
const airportData: LargeCityData[] = JSON.parse(readFileSync(join(__dirname, '../', 'temp', 'large-airports.json'), 'utf8'));

const parquetSchema = new parquet.ParquetSchema({
  code: { type: 'UTF8' },
  city: { type: 'UTF8' },
  country: { type: 'UTF8' },
  countryCode: { type: 'UTF8' },
  latitude: { type: 'DOUBLE' },
  longitude: { type: 'DOUBLE' },
  pricingRegion: { type: 'UTF8', optional: true },
});

const writeParquet = async (locations: EdgeLocation[], filename: string = 'aws-edge-locations') => {
  const parquetPath = join(__dirname, '../', 'data', `${filename}.parquet`);
  const writer = await parquet.ParquetWriter.openFile(parquetSchema, parquetPath);

  try {
    // Filter out locations without codes and write valid rows
    const validLocations = locations.filter(location => location.code !== undefined);
    for (const location of validLocations) {
      await writer.appendRow({
        code: location.code || '',  // Provide empty string as fallback
        city: location.city || '',
        country: location.country || '',
        countryCode: location.countryCode || '',
        latitude: location.latitude || 0,
        longitude: location.longitude || 0,
        pricingRegion: location.pricingRegion || '',
      });
    }
  } catch (error) {
    console.error('Error writing parquet:', error);
  } finally {
    await writer.close();
  }
};

const writeCSV = (locations: EdgeLocation[], filename: string = 'aws-edge-locations') => {
  const csvPath = join(__dirname, '../', 'data', `${filename}.csv`);
  const data = locations.map(e => {
    return `${e.code},${e.city},${e.country},${e.countryCode},${e.latitude},${e.longitude},"${e.pricingRegion}"`
  });
  // Add header
  data.unshift('code,city,country,country_code,latitude,longitude,pricing_region');
  writeFileSync(csvPath, data.join(EOL), 'utf8');
}

const writeJSON = (locations: EdgeLocation[], filename: string = 'aws-edge-locations') => {
  const jsonPath = join(__dirname, '../', 'data', `${filename}.json`);
  const data: EdgeLocations = {};
  locations.forEach(location => {
    data[location.code!] = {
      city: location.city,
      country: location.country,
      countryCode: location.countryCode,
      latitude: location.latitude,
      longitude: location.longitude,
      pricingRegion: location.pricingRegion,
    }
  });
  writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
}

const lookupAirport = city => {
  const matches: LargeCityData[] = [];
  let match: LargeCityData | null = null;
  // Search for matches
  airportData.forEach(entry => {
    if (entry.municipality && entry.municipality.toLowerCase() === city.toLowerCase()) {
      matches.push(entry);
    } else if (entry.name.toLowerCase().includes(city.toLowerCase())) {
      matches.push(entry);
    } else if (entry.municipality && entry.municipality.toLowerCase().includes(city.toLowerCase())) {
      matches.push(entry);
    }
  });
  if (matches.length > 1) { // Handle multiple matches
    const tempMatches: LargeCityData[] = [];
    matches.forEach(m => {
      if (m.name.toLowerCase().indexOf('international') !== -1) {
        tempMatches.push(m);
      }
    });
    if (tempMatches.length > 0) { // Multiple matches, take first one, kind of random selection
      match = tempMatches[0];
    } else { // no "international" tempMatches, fallback to first el of unfiltered matches
      match = matches[0];
    }
  } else { // Single match
    match = matches[0];
  }
  return match;
}

const lookupPricingRegion = (location) => {
  for (let currentPricingRegion in pricingRegionMapping) {
    if (pricingRegionMapping[currentPricingRegion].includes(location.country)) {
      return currentPricingRegion;
    } else if (pricingRegionMapping[currentPricingRegion].includes(location.city)) {
      return currentPricingRegion;
    } else if (location.country === 'China') {
      return 'China';
    }
  }
  return null;
}

const enrichLocation = (location: { city: string | null | undefined; country: string | null | undefined; }): EdgeLocation => {
  const mappedCity = location.city && nameMapping.hasOwnProperty(location.city) ? nameMapping[location.city] : location.city;

  // Initialize edge location
  const enrichedEdgeLocation: EdgeLocation = {
    code: undefined,
    city: mappedCity,
    country: location.country || '',
    countryCode: '',
    latitude: 0,
    longitude: 0,
    pricingRegion: ''
  };

  // Get location from airport data
  const airport = lookupAirport(utf8.encode(mappedCity));

  // Apply location data from overrides or airport database
  if (airportOverrides.hasOwnProperty(mappedCity.toLowerCase() || '')) {
    const overrideData = airportOverrides[mappedCity.toLowerCase() || ''];
    Object.assign(enrichedEdgeLocation, {
      code: overrideData.code,
      countryCode: overrideData.countryCode,
      latitude: overrideData.latitude,
      longitude: overrideData.longitude
    });
  } else if (airport) {
    const [latitude, longitude] = airport.coordinates.split(', ').map(parseFloat);
    Object.assign(enrichedEdgeLocation, {
      code: airport.iata_code,
      countryCode: airport.iso_country,
      latitude,
      longitude
    });
  }

  // Add pricing region
  enrichedEdgeLocation.pricingRegion = lookupPricingRegion(location) || '';
  
  return enrichedEdgeLocation;
};

const run = async () => {
  const locationsData = await downloadAsHTMLWithPuppeteer();

  const rawEdgeLocations = locationsData.filter(e => e.type === 'Edge Locations').map(e => e.locations).flat();

  //const rawPopLocations = locationsData.filter(e => e.type === 'Embedded POPs').map(e => e.locations).flat();

  const edgeLocations: EdgeLocation[] = rawEdgeLocations.map(enrichLocation);
  //const popLocations: EdgeLocation[] = rawPopLocations.map(enrichLocation);

  // Write to data
  writeJSON(edgeLocations);
  //writeJSON(popLocations, 'aws-pop-locations');
  writeCSV(edgeLocations);
  //writeCSV(popLocations, 'aws-pop-locations');
  writeParquet(edgeLocations);
  //writeParquet(popLocations, 'aws-pop-locations');
};

run();
