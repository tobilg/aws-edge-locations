const chai = require('chai');
const should = chai.should();

const AWSEdgeLocations = require('../dist/index').default;

chai.config.includeStack = false;

describe("# Testing the aws-edge-locations functionality", function() {
  describe("## Basic functionality testing", function () {
    it("should return the data for IAD", function (done) {
      const el = new AWSEdgeLocations();

      el.lookup('IAD').should.be.a('object');
      el.lookup('IAD').should.eql({
        "city": "Washington",
        "state": "District of Columbia",
        "country": "United States",
        "countryCode": "US",
        "count": 20,
        "latitude": 38.94449997,
        "longitude": -77.45580292,
        "region": "North America",
        "pricingRegion": "United States, Mexico, & Canada"
      });
      done();
    });

    it("should return 'false' if code isn't found", function (done) {
      const el = new AWSEdgeLocations();

      el.lookup('FOO').should.eql(false);
      done();
    });

    it("should return more than 100 locations", function (done) {
      const el = new AWSEdgeLocations();

      el.getLocationCount().should.be.greaterThan(100);
      done();
    });

    it("should return more than 500 Point of Presences", function (done) {
        const el = new AWSEdgeLocations();

        el.getPoPCount().should.be.greaterThan(500);
        done();
    });
  });
});
