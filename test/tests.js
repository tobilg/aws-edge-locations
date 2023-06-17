const chai = require('chai');
const should = chai.should();

const AWSEdgeLocations = require('../src/index');

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

    it("should return the correct count of locations", function (done) {
      const el = new AWSEdgeLocations();

      el.getLocationCount().should.eql(99);
      done();
    });

    it("should return the correct count of Point of Presences", function (done) {
        const el = new AWSEdgeLocations();

        el.getPoPCount().should.eql(476);
        done();
    });
  });
});
