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

const writeParquet = async locations => {
  const parquetPath = join(__dirname, '../', 'data', 'aws-edge-locations.parquet');
  const writer = await parquet.ParquetWriter.openFile(parquetSchema, parquetPath);

  try {

  

  locations.forEach(async location => {
    await writer.appendRow({
      code: location.code,
      city: location.city,
      country: location.country,
      countryCode: location.countryCode,
      latitude: location.latitude,
      longitude: location.longitude,
      pricingRegion: location.pricingRegion,
    })
  });

} catch (error) {
  console.log(error)
}
  await writer.close();
}

const writeCSV = locations => {
  const csvPath = join(__dirname, '../', 'data', 'aws-edge-locations.csv');
  const data = locations.map(e => {
    return `${e.code},${e.city},${e.country},${e.countryCode},${e.latitude},${e.longitude},"${e.pricingRegion}"`
  });
  // Add header
  data.unshift('code,city,country,country_code,latitude,longitude,pricing_region');
  writeFileSync(csvPath, data.join(EOL), 'utf8');
}

const writeJSON = (locations: EdgeLocation[], directory: string = 'data') => {
  const jsonPath = join(__dirname, '../', directory, 'aws-edge-locations.json');
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

const run = async () => {
  const locationsData = await downloadAsHTMLWithPuppeteer();

  const edgeLocations = locationsData.filter(e => e.type === 'Edge Locations').map(e => e.locations).flat();

  const fullEdgeLocations: EdgeLocation[] = [];

  edgeLocations.forEach((location)  => {
    const mappedCity = location.city && nameMapping.hasOwnProperty(location.city) ? nameMapping[location.city] : location.city;

    // Instatiate
    let fullEdgeLocation: EdgeLocation = {
      code: undefined,
      city: mappedCity,
      country: location.country || '',
      countryCode: '',
      latitude: 0,
      longitude: 0,
      pricingRegion: ''
    };

    // Get location
    const airport = lookupAirport(utf8.encode(mappedCity));

    // Check for overrides
    if (airportOverrides.hasOwnProperty(mappedCity.toLowerCase() || '')) {
      const overrideData = airportOverrides[mappedCity.toLowerCase() || ''];
      fullEdgeLocation.code = overrideData.code;
      fullEdgeLocation.countryCode = overrideData.countryCode;
      fullEdgeLocation.latitude = overrideData.latitude;
      fullEdgeLocation.longitude = overrideData.longitude;
    } else if (airport) {
      fullEdgeLocation.code = airport.iata_code;
      fullEdgeLocation.countryCode = airport.iso_country;
      const coordinate = airport.coordinates.split(', ');
      fullEdgeLocation.latitude = parseFloat(coordinate[1]);
      fullEdgeLocation.longitude = parseFloat(coordinate[0]);
    }
    // Get pricing region
    fullEdgeLocation.pricingRegion = lookupPricingRegion(location) || '';
    // Push to array
    fullEdgeLocations.push(fullEdgeLocation);
  });

  // Write to data
  writeJSON(fullEdgeLocations);
  writeCSV(fullEdgeLocations);
  writeParquet(fullEdgeLocations);
};

run();
