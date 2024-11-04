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
        "country": "United States",
        "countryCode": "US",
        "latitude": 38.94449997,
        "longitude": -77.45580292,
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
  });
});
