import edgeLocations from "./data/aws-edge-locations.json";

export interface EdgeLocation {
  code?:         string;
  city:          string;
  state:         string | null;
  country:       string;
  countryCode:   string;
  count:         number;
  latitude:      number;
  longitude:     number;
  region:        string;
  pricingRegion: string;
}

export interface EdgeLocations {
  [key: string]: EdgeLocation;
}

const awsEdgeLocations = edgeLocations as EdgeLocations;

export default class AWSEdgeLocations {
  constructor() {}

  getLocationCount () {
    return Object.getOwnPropertyNames(awsEdgeLocations).length;
  }

  getPoPCount () {
    let count = 0;
    Object.getOwnPropertyNames(awsEdgeLocations).forEach(location => {
      count += awsEdgeLocations[location].count;
    });
    return count;
  }

  getLocations () {
    return awsEdgeLocations;
  }

  lookup (code) {
    if (awsEdgeLocations.hasOwnProperty(code.toUpperCase())) {
      return awsEdgeLocations[code.toUpperCase()];
    } else {
      return false;
    }
  }
}
