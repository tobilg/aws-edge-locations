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
                "city": "Ashburn",
                "state": "Virginia",
                "country": "United States",
                "countryCode": "US",
                "count": 6,
                "latitude": 38.9445,
                "longitude": -77.4558029,
                "region": "North America"
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

            el.getLocationCount().should.eql(85);
            done();

        });

        it("should return the correct count of Point of Presences", function (done) {

            const el = new AWSEdgeLocations();

            el.getPoPCount().should.eql(206);
            done();

        });

    });

});
