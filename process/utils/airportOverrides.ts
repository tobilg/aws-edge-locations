// Airport data overrides
// Data derived from Wikipedia

interface AirportOverride {
  code: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

export interface AirportOverrides {
  [key: string]: AirportOverride;
}

export const airportOverrides: AirportOverrides = {
  "queretaro": {
      "code": "QRO",
      "countryCode": "MX",
      "latitude": 20.6173,
      "longitude": -100.185997
  },
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
  "washington": {
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
  },
  "warsaw": {
      "code": "WAW",
      "countryCode": "PL",
      "latitude": 52.165833,
      "longitude": 20.967222
  },
  "ho chi minh": {
      "code": "SGN",
      "countryCode": "VN",
      "latitude": 10.818889,
      "longitude": 106.651944
  },
  "bangkok": {
      "code": "BKK",
      "countryCode": "TH",
      "latitude": 13.689999,
      "longitude": 100.750114
  },
  "fortaleza": {
    "code": "FOR",
    "countryCode": "BR",
    "latitude": -3.776279926300049,
    "longitude": -38.53260040283203
  },
  "pune": {
    "code": "PNQ",
    "countryCode": "IN",
    "latitude": 18.58209991455078,
    "longitude": 73.9197006225586
  },
  "taoyuan": {
    "code": "TPE",
    "countryCode": "TW",
    "latitude": 25.0777,
    "longitude": 121.233002
  },
  "portland": {
    "code": "HIO",
    "countryCode": "US",
    "latitude": 45.540394,
    "longitude": -122.949825
  },
  "istanbul": {
    "code": "IST",
    "countryCode": "TR",
    "latitude": 41.262222,
    "longitude": 28.727778
  },
  "qatar": {
    "code": "DOH",
    "countryCode": "QA",
    "latitude": 25.273056,
    "longitude": 51.608056
  },
  "bengaluru": {
    "code": "BLR",
    "countryCode": "IN",
    "latitude": 13.198889,
    "longitude": 77.705556
  }
};
