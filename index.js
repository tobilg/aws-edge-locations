const locations = require('./dist/aws-edge-locations.json');

class AWSEdgeLocations {
    constructor() {

    }

    getLocationCount () {
        return Object.getOwnPropertyNames(locations).length;
    }

    getPoPCount () {
        let count = 0;
        Object.getOwnPropertyNames(locations).forEach(location => {
            count += locations[location].count;
        });
        return count;
    }

    lookup (code) {
        if (locations.hasOwnProperty(code.toUpperCase())) {
            return locations[code.toUpperCase()];
        } else {
            return false;
        }
    }
}

module.exports = AWSEdgeLocations;
