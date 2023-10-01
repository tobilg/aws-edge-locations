import { EOL } from 'os';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import iso31662 from 'iso-3166/2.json'
import utf8 from 'utf8';
import parquet from 'parquetjs';
import { downloadAsHTML } from './utils/downloader';
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
  state: string;
  country: string;
}

export interface RawEdgeLocation {
  city: string;
  state: string | null;
  country: string;
  region?: string;
  popCount: number;
}

export interface LocationByRegion {
  region: string;
  edgeLocations: RawEdgeLocation[];
  regionalEdgeCaches: RegionalEdgeCache[];
}

// Define US states mapping
const usStates = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming","AS":"American Samoa","DC":"District of Columbia","FM":"Federated States of Micronesia","GU":"Guam","MH":"Marshall Islands","MP":"Northern Mariana Islands","PW":"Palau","PR":"Puerto Rico","VI":"Virgin Islands"};

// Load airport data
const airportData: LargeCityData[] = JSON.parse(readFileSync(join(__dirname, '../', 'temp', 'large-airports.json'), 'utf8'));

const getStateName = (regionCode: string): string | null => {
  // Filter by region code
  const filtered = iso31662.filter(r => r.code === regionCode);
  // Check
  if (filtered.length === 1) {
    return filtered[0].name;
  } else {
    return null;
  }
}

const parquetSchema = new parquet.ParquetSchema({
  code: { type: 'UTF8' },
  city: { type: 'UTF8' },
  state: { type: 'UTF8', optional: true },
  country: { type: 'UTF8' },
  countryCode: { type: 'UTF8' },
  count: { type: 'INT64' },
  latitude: { type: 'DOUBLE' },
  longitude: { type: 'DOUBLE' },
  region: { type: 'UTF8', optional: true },
  pricingRegion: { type: 'UTF8', optional: true },
});

const writeParquet = async locations => {
  const parquetPath = join(__dirname, '../', 'data', 'aws-edge-locations.parquet');
  const writer = await parquet.ParquetWriter.openFile(parquetSchema, parquetPath);

  locations.forEach(async location => {
    await writer.appendRow({
      code: location.code,
      city: location.city,
      state: location.state,
      country: location.country,
      countryCode: location.countryCode,
      count: location.count,
      latitude: location.latitude,
      longitude: location.longitude,
      region: location.region,
      pricingRegion: location.pricingRegion,
    })
  });

  await writer.close();
}

const writeCSV = locations => {
  const csvPath = join(__dirname, '../', 'data', 'aws-edge-locations.csv');
  const data = locations.map(e => {
    return `${e.code},${e.city},${e.state || ''},${e.country},${e.countryCode},${e.count},${e.latitude},${e.longitude},${e.region},"${e.pricingRegion}"`
  });
  // Add header
  data.unshift('code,city,state,country,country_code,count,latitude,longitude,region,pricing_region');
  writeFileSync(csvPath, data.join(EOL), 'utf8');
}

const writeJSON = (locations: EdgeLocation[], directory: string = 'data') => {
  const jsonPath = join(__dirname, '../', directory, 'aws-edge-locations.json');
  const data: EdgeLocations = {};
  locations.forEach(location => {
    data[location.code!] = {
      city: location.city,
      state: location.state,
      country: location.country,
      countryCode: location.countryCode,
      count: location.count,
      latitude: location.latitude,
      longitude: location.longitude,
      region: location.region,
      pricingRegion: location.pricingRegion,
    }
  });
  writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
}

const lookupAirport = city => {
  const matches: LargeCityData[] = [];
  let match: LargeCityData | null = null;
  // Search for matches
  airportData.forEach(entry => {
    if (entry.municipality && entry.municipality.toLowerCase() === city.toLowerCase()) {
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

// Start page for parsing
const startPage = 'https://aws.amazon.com/cloudfront/features/';

const getLocations = (root: HTMLElement) => {
  // Get raw data
  const rawEdgeRegionNames = root?.querySelectorAll('#aws-page-content-main > div:nth-child(2) > div > div > div[class="lb-txt-none lb-txt-18 lb-txt"]');
  const rawRegioNData = root?.querySelectorAll('#aws-page-content-main > div:nth-child(2) > div > div > div[class="lb-rtxt"]:nth-child(1n+5)');

  // Extract Region names
  const regions: string[] = Array.from(rawEdgeRegionNames).map(rawEdgeRegion => rawEdgeRegion.innerHTML.toString().replace(/\\n/g, '').replace('&amp;', '&').trim())

  // Get region data
  const regionData = Array.from(rawRegioNData);
  // Remove last element
  regionData.pop();

  // Iterate over region data
  const locationsByRegion = regionData.map((rawLocationData, regionIndex) => {
    // Get <p> tags for distinction between Edge Locations & Regional Edge Caches
    const ps = Array.from(rawLocationData.querySelectorAll('p'));
    
    // Store cleaned Edge FullEdgeLocation data
    const rawEdgeLocations = ps[0]
      .innerText
      .replace(/&nbsp;/g, '')
      .replace('<br>', '')
      .replace('Edge locations', '')
      .replace('Edge location', '')
      .replace(/\:/g, '')
      .trim();

    // Store Regional Edge Caches
    let rawRegionalEdgeCaches;

    // Both Edge Locations and Regional Edge Caches are present in the region
    if (ps.length === 2) {
      // Regional Edge Caches
      rawRegionalEdgeCaches = ps[1]
        .innerText
        .replace(/&nbsp;/g, '')
        .replace('Regional Edge caches:', '')
        .replace(/; /g, ';')
        .trim();
    }

    // Get region's edge locations
    const edgeLocations: RawEdgeLocation[] = rawEdgeLocations
      .split(';')
      .filter(el => el.length > 0)
      .map(el => el.trim())
      .map(el => {
        // Split string, workaround for Singapore
        const temp = el.replace('Singapore', 'Singapore, Singapore').split(', ');

        // Define target properties with defaults
        const city: string = temp[0].replace('é', 'e').replace('New York City', 'New York');
        let country: string = 'United States';
        let state: string | null = null;
        let popCount: number = 1;

        // Check if number of PoPs is present
        if (temp[1].indexOf('(') > -1 && temp[1].indexOf('(') > -1) {
          const countryTemp = temp[1].split(' (');
          // Workaround for the US
          if (regionIndex === 0 && !['Mexico', 'Canada'].includes(countryTemp[0])) {
            state = usStates[countryTemp[0]];
          } else {
            country = countryTemp[0];
          }
          popCount = parseInt(countryTemp[1].replace(')', ''));
        } else {
          country = temp[1];
        }
        
        return {
          city,
          state,
          country,
          popCount,
        }
      });

    // Get region's regional edge caches
    let regionalEdgeCaches: RegionalEdgeCache[] = [];

    if (rawRegionalEdgeCaches) {
      regionalEdgeCaches = rawRegionalEdgeCaches
        .split(';')
        .map(ec => {
          // Split string, workaround for Singapore
          const temp = ec.split(', ') || [ec];
          
          let city: string | null = null;
          let state: string | null = null;
          let country: string = 'United States'; // Default, will be eventually overwritten

          // Workaround for the US
        if (regionIndex === 0) {
          switch (temp[0]) {
            case 'California':
              state = 'CA';
              break;
            case 'Ohio':
              state = 'OH';
              break;
            case 'Oregon':
              state = 'OR';
              break;
            case 'Virginia':
              state = 'AA';
              break;
            default:
              break;
          }
        } else {
          city = temp[0];
          country = temp[1];
        }

        return {
          city,
          state,
          country,
        }
      })
    }

    return {
      region: regions[regionIndex],
      edgeLocations,
      regionalEdgeCaches,
    } as LocationByRegion
  })

  return locationsByRegion;
}

const run = async () => {
  // Get start page
  const html = await downloadAsHTML(startPage);

  if (html) {
    // Parse locations
    const locationsByRegion = getLocations(html);

    const fullEdgeLocations: EdgeLocation[] = [];

    locationsByRegion
      .map(r => r.edgeLocations
        .map(el => ({
          ...el,  
          region: r.region,
        }))
      )
      .flat()
      .forEach((location: RawEdgeLocation)  => {
        // Instatiate
        let fullEdgeLocation: EdgeLocation = {
          city: location.city,
          state: location.state,
          country: location.country,
          countryCode: '',
          count: location.popCount,
          latitude: 0,
          longitude: 0,
          region: location.region!,
          pricingRegion: ''
        };
        // Get location
        const airport = lookupAirport(utf8.encode(location.city));
        // Check for overrides
        if (airportOverrides.hasOwnProperty(location.city.toLowerCase())) {
          const overrideData = airportOverrides[location.city.toLowerCase()];
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
          if (airport.iso_region) fullEdgeLocation.state = getStateName(airport.iso_region);
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
  }
};

run();
