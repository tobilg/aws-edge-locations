const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const utf8 = require('utf8');
const pricingRegionMapping = require('./lib/pricingRegionMapping');
const airportOverridesData = require('./lib/airportOverrides');

// Load airport data
const airportData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'large-airports.json'), 'utf8'));

const writeCSV = locations => {
  const csvPath = path.join(__dirname, 'dist', 'aws-edge-locations.csv');
  const data = locations.map(e => {
    return `${e.code},${e.city},${e.state || ''},${e.country},${e.countryCode},${e.count},${e.latitude},${e.longitude},${e.region},"${e.pricingRegion}"`
  });
  // Add header
  data.unshift('code,city,state,country,country_code,count,latitude,longitude,region,pricing_region');
  fs.writeFileSync(csvPath, data.join(os.EOL), 'utf8');
}

const writeJSON = locations => {
  const jsonPath = path.join(__dirname, 'dist', 'aws-edge-locations.json');
  const data = {};
  locations.forEach(location => {
    data[location.code] = {
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
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
}

const lookupAirport = city => {
  const matches = [];
  let match = null;
  // Search for matches
  airportData.forEach(entry => {
    if (entry.municipality && entry.municipality.toLowerCase() === city.toLowerCase()) {
      matches.push(entry);
    }
  });
  if (matches.length > 1) { // Handle multiple matches
    const tempMatches = [];
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

const createLocation = location => {
  const locationObj = {};
  const temp = location.split(',');

  // RegEx
  const regExp = /\(([^)]+)\)/;
  // Check for Americas states
  const stateMatch = regExp.exec(temp[0]) || [];
  if (stateMatch.length > 0) {
    locationObj.state = stateMatch[1];
    locationObj.city = temp[0].trim().split(' (')[0];
  } else {
    locationObj.city = temp[0].trim();
  }
  // Check for count
  const countMatch = regExp.exec(temp[1]) || [];
  if (countMatch.length > 0) {
    locationObj.count = parseInt(countMatch[1]);
    locationObj.country = temp[1].trim().split(' (')[0];
  } else {
    locationObj.count = 1;
    locationObj.country = temp[1].trim();
  }

  // region is the third detail in string
  locationObj.region = temp[2].trim();

  // return location object
  return locationObj;
}

const run = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', consoleObj => console.log(consoleObj.text()));

  await page.goto('https://aws.amazon.com/cloudfront/features/')

  const data = await page.evaluate(() => {
    const result = [];
    // Selector
    const rawLocations = document.evaluate('//*[@id="aws-page-content"]/main/div[1]/div/div/div[@class="lb-rtxt"]/p[*]', document);

    // First iterator
    let iterator = rawLocations.iterateNext();

    // Iterate over entries
    while (iterator) { 
      result.push(iterator.textContent); 
      iterator = rawLocations.iterateNext();
    }

    // Remove first and last item
    result.shift();
    result.pop();

    /**
     * @desc get an array witth regions names, this will be used to group
     * related locations by region (≠ continent). Regions are extracted
     * from each set title element, wich ATM is the previous sibling of the
     * $locationsSets
     * @returns {Array} - ["North America", "Europe", "Asia", ...]
     */
    const extractRegions = () => {
      const $contentContainer = document
        .getElementById('Global_Edge_Network')
        .parentElement;
      const $locationsSets = Array.from($contentContainer.querySelectorAll('.lb-rtxt'))
        .slice(1, -1); // false positives first and last matches
      // return only cleaned text string
      return $locationsSets.map(set => 
        set.previousElementSibling.textContent.trim()
      );
    }

    const regions = extractRegions();

    let locations = [];
    const edgeLocations = [];

    // Extraction / categorization
    result.forEach(r => {
      if (r.startsWith('Edge location:') || r.startsWith('Edge locations:')) {
        // Fixes
        const locationString = r.replace('Edge location:', '')
          .replace('Edge locations:', '').trim()
          .replace('Taiwan(3)', 'Taiwan (3)')
          .replace('Utah', 'UT')
          .replace('Singapore', 'Singapore, Singapore')
          .replace('São Paulo', 'Sao Paulo')
          .replace('Querétaro', 'Queretaro')
          .replace('CHINA', 'China');
        edgeLocations.push(locationString);
      }
    });

    // Fixes for edge locations
    // Americas (missing country, add state)
    const usCountries = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming","AS":"American Samoa","DC":"District of Columbia","FM":"Federated States of Micronesia","GU":"Guam","MH":"Marshall Islands","MP":"Northern Mariana Islands","PW":"Palau","PR":"Puerto Rico","VI":"Virgin Islands"};
    const canadaCountries = {"AB": "Alberta", "BC": "British Columbia", "MB": "Manitoba", "NB": "New Brunswick", "NL": "Newfoundland and Labrador", "NS": "Nova Scotia", "NT": "Northwest Territories", "NU": "Nunavut", "ON": "Ontario", "PE": "Prince Edward Island", "QC": "Quebec", "SK": "Saskatchewan", "YT": "Yukon"};
    const americasFixTemp = edgeLocations[0].toString().replace(/ ; /g, '; ').split('; ');
    const americasFixArray = [];
    americasFixTemp.forEach(location => {
      const locationTemp = location.split(', ');
      if (locationTemp[1].length > 2) { // Contains count
        const countTemp = locationTemp[1].split(' ');
        let countCountry = null;
        let countState = null;
        if (usCountries.hasOwnProperty(countTemp[0])) {
          countState = usCountries[countTemp[0]];
          countCountry = 'United States';
        } else if (countTemp[0] === 'Canada') {
          countState = 'Canada';
          countCountry = 'Canada';
        } else if (countTemp[0] === 'Mexico') {
          countState = 'Mexico';
          countCountry = 'Mexico';
        }
        americasFixArray.push(`${locationTemp[0]} (${countState}), ${countCountry} ${countTemp[1]}`);
      } else { // No count
        let state = null;
        let country = null;
        if (usCountries.hasOwnProperty(locationTemp[1])) {
          state = usCountries[locationTemp[1]];
          country = 'United States';
        } else if (canadaCountries.hasOwnProperty(locationTemp[1])) {
          state = canadaCountries[locationTemp[1]];
          country = 'Canada';
        }
        americasFixArray.push(`${locationTemp[0]} (${state}), ${country}`);
      }
    });
    edgeLocations[0] = americasFixArray.join('; ');

    // Australia (missing country)
    const australiaFixTemp = edgeLocations[3].split('; ');
    const australiaFixArray = australiaFixTemp.map(af => {
      return af.replace('NZ', 'New Zealand').replace('AU', 'Australia');
    })
    edgeLocations[3] = australiaFixArray.join('; ');

    // Generate edge location array
    // [0] get each region location set string
    // [1] append region to each location details string
    // @todo [0] - I don't think it ever enters here, since split 
    //  of a string is always an Array?
    edgeLocations.forEach((locationList, index) => {
      locationList
        .split(';')
        .forEach(l => {
          locations.push(`${l.trim()}, ${regions[index]}`);
        });
    });

    return {
      locations: locations,
      locationCount: locations.length
    };
  });

  await browser.close();

  const edgeLocations = [];

  data.locations.forEach(l => {
    // Get location
    const location = createLocation(l);
    const airport = lookupAirport(utf8.encode(location.city));
    if (airportOverridesData.hasOwnProperty(location.city.toLowerCase())) {
      const overrideData = airportOverridesData[location.city.toLowerCase()];
      location.code = overrideData.code;
      location.countryCode = overrideData.countryCode;
      location.latitude = overrideData.latitude;
      location.longitude = overrideData.longitude;
    } else if (airport) {
      location.code = airport.iata_code;
      location.countryCode = airport.iso_country;
      const coordinate = airport.coordinates.split(', ');
      location.latitude = parseFloat(coordinate[1]);
      location.longitude = parseFloat(coordinate[0]);
    }
    // Get pricing region
    location.pricingRegion = lookupPricingRegion(location);
    // Push to array
    edgeLocations.push(location);
  });

  writeJSON(edgeLocations);
  writeCSV(edgeLocations);
}

run();
