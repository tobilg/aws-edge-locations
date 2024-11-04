import edgeLocations from "./data/aws-edge-locations.json";

export interface EdgeLocation {
  code?:         string;
  city:          string;
  country:       string;
  countryCode:   string;
  latitude:      number;
  longitude:     number;
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
