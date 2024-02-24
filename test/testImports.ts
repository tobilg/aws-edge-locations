import AWSEdgeLocations  from "../dist";

// Get AWS Edge Locations
const awsEdgeLocations = new AWSEdgeLocations();

console.log(awsEdgeLocations.getLocationCount());
