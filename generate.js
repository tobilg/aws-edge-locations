const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const utf8 = require('utf8');

// Load airport data
const airportData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'large-airports.json'), 'utf8'));

// Airport data overrides
// Data derived from Wikipedia
const airportOverridesData = {
    "houston": {
        "code": "IAH",
        "countryCode": "US",
        "latitude": 29.984399795532227,
        "longitude": -95.34140014648438
    },
    "dusseldorf": {
        "code": "DUS",
        "countryCode": "DE",
        "latitude": 51.289501, 
        "longitude": 6.76678
    },
    "zhongwei": {
        "code": "ZHY",
        "countryCode": "CN",
        "latitude": 37.572778,
        "longitude": 105.154444
    },
    "toronto": {
        "code": "YTO",
        "countryCode": "CA",
        "latitude": 43.6772003174,
        "longitude": -79.63059997559999
    },
    "fujairah": {
        "code": "FJR",
        "countryCode": "AE",
        "latitude": 25.112222,
        "longitude": 56.324167
    },
    "ashburn": {
        "code": "IAD",
        "countryCode": "US",
        "latitude": 38.9445,
        "longitude": -77.4558029,
    },
    "dallas/fort worth": {
        "code": "DFW",
        "countryCode": "US",
        "latitude": 32.896801,
        "longitude": -97.038002
    },
    "hayward": {
        "code": "HWD",
        "countryCode": "US",
        "latitude": 37.658889,
        "longitude": -122.121667
    },
    "hillsboro": {
        "code": "HIO",
        "countryCode": "US",
        "latitude": 45.540394,
        "longitude": -122.949825
    },
    "montreal": {
        "code": "YUL",
        "countryCode": "CA",
        "latitude": 45.470556,
        "longitude": -73.740833
    },
    "palo alto": {
        "code": "PAO",
        "countryCode": "US",
        "latitude": 37.461111,
        "longitude": -122.115
    },
    "seattle": {
        "code": "SEA",
        "countryCode": "US",
        "latitude": 47.448889,
        "longitude": -122.309444
    },
    "london": {
        "code": "LHR",
        "countryCode": "GB",
        "latitude": 51.4775,
        "longitude": -0.461389
    },
    "sao paulo": {
        "code": "GRU",
        "countryCode": "BR",
        "latitude": -23.435556,
        "longitude": -46.473056
    },
    "berlin": {
        "code": "TXL",
        "countryCode": "DE",
        "latitude": 52.559722,
        "longitude": 13.287778
    },
    "south bend": {
        "code": "IND",
        "countryCode": "US",
        "latitude": 39.7173004,
        "longitude": -86.2944031
    },
    "chicago": {
        "code": "ORD",
        "countryCode": "US",
        "latitude": 41.978611,
        "longitude": -87.904722
    },
    "rome": {
        "code": "FCO",
        "countryCode": "IT",
        "latitude": 41.8002778,
        "longitude": 12.2388889
    },
    "tokyo": {
        "code": "NRT",
        "countryCode": "JP",
        "latitude": 35.764702,
        "longitude": 140.386002
    },
    "manila": {
        "code": "MNL",
        "countryCode": "PH",
        "latitude": 14.5086,
        "longitude": 121.019997
    }
}

const writeCSV = locations => {
    const csvPath = path.join(__dirname, 'dist', 'aws-edge-locations.csv');
    const data = locations.map(e => { return `${e.code},${e.city},${e.state || ''},${e.country},${e.countryCode},${e.count},${e.latitude},${e.longitude},${e.region}` });
    // Add header
    data.unshift('code,city,state,country,country_code,count,latitude,longitude,region');
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
            region: location.region
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
            match = matches[0]
        }
    } else { // Single match
        match = matches[0];
    }
    return match;
}

const createLocation = location => {
    const locationObj = {};
    const temp = location.split(',');
    console.log(temp)
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

    // region
    return locationObj;
}

const run = async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://aws.amazon.com/cloudfront/features/?nc1=h_ls')

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
                const locationString = r.replace('Edge location:', '').replace('Edge locations:', '').trim().replace('Taiwan(3)', 'Taiwan (3)').replace('Utah', 'UT').replace('Singapore', 'Singapore, Singapore').replace('Frankfurt', 'Frankfurt am Main').replace('São Paulo', 'Sao Paulo');
                edgeLocations.push(locationString);
            }
        });
        console.log(edgeLocations)

        // Fixes for edge locations
        // Americas (missing country, add state)
        const usCountries = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming","AS":"American Samoa","DC":"District of Columbia","FM":"Federated States of Micronesia","GU":"Guam","MH":"Marshall Islands","MP":"Northern Mariana Islands","PW":"Palau","PR":"Puerto Rico","VI":"Virgin Islands"};
        const canadaCountries = {"AB": "Alberta", "BC": "British Columbia", "MB": "Manitoba", "NB": "New Brunswick", "NL": "Newfoundland and Labrador", "NS": "Nova Scotia", "NT": "Northwest Territories", "NU": "Nunavut", "ON": "Ontario", "PE": "Prince Edward Island", "QC": "Quebec", "SK": "Saskatchewan", "YT": "Yukon"};
        const americasFixTemp = edgeLocations[0].split('; ');
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
                } else if (canadaCountries.hasOwnProperty(countTemp[0])) {
                    countState = canadaCountries[countTemp[0]];
                    countCountry = 'Canada';
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

        // China (missing country)
        const chinaFix = edgeLocations[7].trim().split('; ').join(', China; ');
        edgeLocations[7] = `${chinaFix}, China`;

        // Generate edge location array
        // [0] get each region location set string
        // [1] append region to each location details string
        // @todo [0] - I don't think it ever enters here, since split 
        //  of a string is always an Array?
        edgeLocations.forEach((locationList, index) => {
            const details = locationList
                .split('; ') // [0]
                .map(l => l.concat(`, ${regions[index]}`)); // [1]

            if (Array.isArray(details)) {
                locations = locations.concat(details);
            } else { // @todo [0]            
                locations.push(locationList);
            }
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
        // Push to array
        edgeLocations.push(location);
    });

    writeJSON(edgeLocations);
    writeCSV(edgeLocations);

}

run();