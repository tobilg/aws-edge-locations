# aws-edge-locations
List of AWS CloudFront Edge Location code prefixes including latitude/longitude information, usable via a lookup mechanism.

## Contents

If you're here for the plain data, have a look at

* [List of AWS CloudFront Edge Locations (as CSV)](#csv-list) 
* [List of AWS CloudFront Edge Locations (as JSON)](#json-lookup)

## Installation
To install, you can do the following:

```bash
$ npm i aws-edge-locations
```

## Usage

### Node

This package can be used to lookup the AWS CloudFront Edge Locations via the three character prefix (the first three characters of the `location` (e.g. `IAD12`) field in the CloudFront logs).

```javascript
const AWSEdgeLocations = require('aws-edge-locations');
const el = new AWSEdgeLocations();
const location = el.lookup('IAD12'.substr(0,3)); // Use only the first three characters!

/* returns
{
  "city": "Washington",
  "state": "District of Columbia",
  "country": "United States",
  "countryCode": "US",
  "count": 20,
  "latitude": 38.94449997,
  "longitude": -77.45580292,
  "region": "North America",
  "pricingRegion": "United States, Mexico, & Canada"
}
*/

const invalid = el.lookup('FOO'); // returns false

// Get edge location count
const locationCount = el.getLocationCount(); // returns 98

// Get PoP count
const popCount = el.getPoPCount() // returns 475
```

### Browser

This package is published as an UMD module, and can be used in the browser directly from [unpkg](https://unpkg.com/).

```html
<html>
    <head>
        <script src="https://unpkg.com/aws-edge-locations"></script> 
    </head>
    <body>
        <script>
            // Using the global variable
            document.write('There are ' + awsEdgeLocations.getLocationCount() + ' edge locations');
        </script>
    </body>
</html>
```

## Data generation

### TLDR

After installation of `jq` library, run `npm run generate`

### Explanation

To prepare the data regeneration, please run `npm run download-airports && npm run filter-airports`. This step requires an installation of [jq](https://github.com/stedolan/jq/wiki/Installation) on the machine where the commands are run.

The `generate.js` script will regenerate the `csv` and `json` versions of the AWS CloudFront Edge Location list in the `dist` folder.

It does this by extracting the information from the [Amazon CloudFront Key Features page](https://aws.amazon.com/cloudfront/features/), cleaning and unifiying it, and merging it with [airport data](https://datahub.io/core/airport-codes/r/airport-codes.json) (the first three characters of the `location` field are IATA airport codes) to also get the latitude/longitude information.

Also, there are some manual overrides when it wasn't possible to automatically determine the correct IATA code from the city names.

## Data

This project is considered as in the `alpha` stage, so there's **no guarantee that the data is accurate**. Please feel free to test and give feedback either via creating an [issue](https://github.com/tobilg/aws-edge-locations/issues) or a [pr](https://github.com/tobilg/aws-edge-locations/pulls)

### CSV list

The CSV version of the data can be found at [dist/aws-edge-locations.csv](dist/aws-edge-locations.csv). The file is using `,` as field separator.

```csv
code,city,state,country,country_code,count,latitude,longitude,region,pricing_region
IAD,Washington,District of Columbia,United States,US,20,38.94449997,-77.45580292,North America,"United States, Mexico, & Canada"
ORD,Chicago,Illinois,United States,US,20,41.978611,-87.904722,North America,"United States, Mexico, & Canada"
JFK,New York,New York,United States,US,8,40.639801,-73.7789,North America,"United States, Mexico, & Canada"
ATL,Atlanta,Georgia,United States,US,17,33.6367,-84.428101,North America,"United States, Mexico, & Canada"
LAX,Los Angeles,California,United States,US,15,33.942501,-118.407997,North America,"United States, Mexico, & Canada"
MIA,Miami,Florida,United States,US,11,25.79319953918457,-80.29060363769531,North America,"United States, Mexico, & Canada"
DFW,Dallas-Fort Worth,Texas,United States,US,18,32.896801,-97.038002,North America,"United States, Mexico, & Canada"
IAH,Houston,Texas,United States,US,6,29.984399795532227,-95.34140014648438,North America,"United States, Mexico, & Canada"
SFO,San Francisco,California,United States,US,8,37.61899948120117,-122.375,North America,"United States, Mexico, & Canada"
BOS,Boston,Massachusetts,United States,US,5,42.36429977,-71.00520325,North America,"United States, Mexico, & Canada"
DEN,Denver,Colorado,United States,US,6,39.861698150635,-104.672996521,North America,"United States, Mexico, & Canada"
PDX,Portland,Oregon,United States,US,2,45.58869934,-122.5979996,North America,"United States, Mexico, & Canada"
SEA,Seattle,Washington,United States,US,6,47.448889,-122.309444,North America,"United States, Mexico, & Canada"
MSP,Minneapolis,Minnesota,United States,US,4,44.882,-93.221802,North America,"United States, Mexico, & Canada"
PHX,Phoenix,Arizona,United States,US,3,33.43429946899414,-112.01200103759766,North America,"United States, Mexico, & Canada"
PHL,Philadelphia,Pennsylvania,United States,US,2,39.87189865112305,-75.24109649658203,North America,"United States, Mexico, & Canada"
SLC,Salt Lake City,Utah,United States,US,1,40.78839874267578,-111.97799682617188,North America,"United States, Mexico, & Canada"
BNA,Nashville,Tennessee,United States,US,2,36.1245002746582,-86.6781997680664,North America,"United States, Mexico, & Canada"
DTW,Detroit,Michigan,United States,US,2,42.212398529052734,-83.35340118408203,North America,"United States, Mexico, & Canada"
TPA,Tampa,Florida,United States,US,2,27.975500106811523,-82.533203125,North America,"United States, Mexico, & Canada"
EWR,Newark,New Jersey,United States,US,10,40.692501068115234,-74.168701171875,North America,"United States, Mexico, & Canada"
CMH,Columbus,Ohio,United States,US,2,39.998001,-82.891899,North America,"United States, Mexico, & Canada"
MCI,Kansas City,Missouri,United States,US,2,39.2976,-94.713898,North America,"United States, Mexico, & Canada"
QRO,Queretaro,,North America,MX,1,20.6173,-100.185997,undefined,"null"
FRA,Frankfurt am Main,,Germany,DE,17,50.033333,8.570556,Europe,"Europe & Israel"
DUS,Düsseldorf,,Germany,DE,3,51.289501,6.76678,Europe,"Europe & Israel"
HAM,Hamburg,,Germany,DE,6,53.630401611328,9.9882297515869,Europe,"Europe & Israel"
MUC,Munich,,Germany,DE,4,48.353802,11.7861,Europe,"Europe & Israel"
TXL,Berlin,,Germany,DE,5,52.559722,13.287778,Europe,"Europe & Israel"
CDG,Paris,,France,FR,11,49.012798,2.55,Europe,"Europe & Israel"
MRS,Marseille,,France,FR,6,43.439271922,5.22142410278,Europe,"Europe & Israel"
MXP,Milan,,Italy,IT,9,45.6306,8.72811,Europe,"Europe & Israel"
FCO,Rome,,Italy,IT,6,41.8002778,12.2388889,Europe,"Europe & Israel"
PMO,Palermo,,Italy,IT,1,38.175999,13.091,Europe,"Europe & Israel"
AMS,Amsterdam,,Netherlands,NL,5,52.308601,4.76389,Europe,"Europe & Israel"
MAN,Manchester,,UK,GB,5,53.35369873046875,-2.2749500274658203,Europe,"Europe & Israel"
LHR,London,,UK,GB,25,51.4775,-0.461389,Europe,"Europe & Israel"
DUB,Dublin,,Ireland,IE,2,53.421299,-6.27007,Europe,"Europe & Israel"
VIE,Vienna,,Austria,AT,3,48.110298156738,16.569700241089,Europe,"Europe & Israel"
ARN,Stockholm,,Sweden,SE,4,59.651901245117,17.918600082397,Europe,"Europe & Israel"
CPH,Copenhagen,,Denmark,DK,3,55.617900848389,12.656000137329,Europe,"Europe & Israel"
HEL,Helsinki,,Finland,FI,4,60.317199707031,24.963300704956,Europe,"Europe & Israel"
ATH,Athens,,Greece,GR,1,37.9364013672,23.9444999695,Europe,"Europe & Israel"
BRU,Brussels,,Belgium,BE,1,50.901401519800004,4.48443984985,Europe,"Europe & Israel"
BUD,Budapest,,Hungary,HU,1,47.42976,19.261093,Europe,"Europe & Israel"
LIS,Lisbon,,Portugal,PT,1,38.7813,-9.13592,Europe,"Europe & Israel"
OSL,Oslo,,Norway,NO,2,60.193901062012,11.100399971008,Europe,"Europe & Israel"
OTP,Bucharest,,Romania,RO,1,44.5711111,26.085,Europe,"Europe & Israel"
PRG,Prague,,Czech Republic,CZ,1,50.1008,14.26,Europe,"Europe & Israel"
SOF,Sofia,,Bulgaria,BG,1,42.696693420410156,23.411436080932617,Europe,"Europe & Israel"
WAW,Warsaw,,Poland,PL,3,52.165833,20.967222,Europe,"Europe & Israel"
ZAG,Zagreb,,Croatia,HR,1,45.7429008484,16.0687999725,Europe,"Europe & Israel"
ZRH,Zurich,,Switzerland,CH,2,47.464699,8.54917,Europe,"Europe & Israel"
BCN,Barcelona,,Spain,ES,2,41.2971,2.07846,Europe,"Europe & Israel"
MAD,Madrid,,Spain,ES,10,40.471926,-3.56264,Europe,"Europe & Israel"
DEL,New Delhi,,India,IN,14,28.5665,77.103104,Asia,"India"
MAA,Chennai,,India,IN,8,12.990005493164062,80.16929626464844,Asia,"India"
BOM,Mumbai,,India,IN,8,19.0886993408,72.8678970337,Asia,"India"
PNQ,Pune,,India,IN,4,18.58209991455078,73.9197006225586,Asia,"India"
BLR,Bangalore,,India,IN,5,13.1979,77.706299,Asia,"India"
HYD,Hyderabad,,India,IN,5,17.231318,78.429855,Asia,"India"
SIN,Singapore,,Singapore,SG,7,1.35019,103.994003,Asia,"Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
KIX,Osaka,,Japan,JP,5,34.42729949951172,135.24400329589844,Asia,"Japan"
NRT,Tokyo,,Japan,JP,22,35.764702,140.386002,Asia,"Japan"
TPE,Taoyuan,,Taiwan,TW,3,25.0777,121.233002,Asia,"Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
ICN,Seoul,,Korea,KR,8,37.46910095214844,126.45099639892578,Asia,"Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
BKK,Bangkok,,Thailand,TH,2,13.689999,100.750114,Asia,"Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
CCU,Kolkata,,India,IN,2,22.654699325561523,88.44670104980469,Asia,"India"
CGK,Jakarta,,Indonesia,ID,5,-6.1255698204,106.65599823,Asia,"Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
KUL,Kuala Lumpur,,Malaysia,MY,2,2.745579957962,101.70999908447,Asia,"Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
MNL,Manila,,Philippines,PH,1,14.5086,121.019997,Asia,"Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
HAN,Hanoi,,Vietnam,VN,1,21.221200942993164,105.80699920654297,Asia,"Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
SGN,Ho Chi Minh City,,Vietnam,VN,1,10.8187999725,106.652000427,Asia,"Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
SYD,Sydney,,Australia,AU,4,-33.94609832763672,151.177001953125,Australia & New Zealand,"Australia & New Zealand"
AKL,Auckland,,New Zealand,NZ,2,-37.008098602299995,174.792007446,Australia & New Zealand,"Australia & New Zealand"
MEL,Melbourne,,Australia,AU,3,-37.673302,144.843002,Australia & New Zealand,"Australia & New Zealand"
PER,Perth,,Australia,AU,1,-31.94029998779297,115.96700286865234,Australia & New Zealand,"Australia & New Zealand"
GRU,Sao Paulo,,Brazil,BR,8,-23.435556,-46.473056,South America,"South America"
GIG,Rio De Janeiro,,Brazil,BR,5,-22.8099994659,-43.2505569458,South America,"South America"
FOR,Fortaleza,,Brazil,BR,4,-3.776279926300049,-38.53260040283203,South America,"South America"
BOG,Bogota,,Colombia,CO,3,4.70159,-74.1469,South America,"South America"
EZE,Buenos Aires,,Argentina,AR,2,-34.8222,-58.5358,South America,"South America"
SCL,Santiago,,Chile,CL,3,-33.393001556396484,-70.78579711914062,South America,"South America"
LIM,Lima,,Peru,PE,2,-12.0219,-77.114305,South America,"South America"
TLV,Tel Aviv,,Israel,IL,2,32.01139831542969,34.88669967651367,Middle East,"Europe & Israel"
BAH,Manama,,Bahrain,BH,2,26.27079963684082,50.63359832763672,Middle East,"South Africa, Kenya, & Middle East"
DXB,Dubai,,UAE,AE,1,25.2527999878,55.3643989563,Middle East,"South Africa, Kenya, & Middle East"
FJR,Fujairah,,UAE,AE,3,25.112222,56.324167,Middle East,"South Africa, Kenya, & Middle East"
MCT,Muscat,,Oman,OM,1,23.593299865722656,58.284400939941406,Middle East,"South Africa, Kenya, & Middle East"
CPT,Cape Town,,South Africa,ZA,1,-33.9648017883,18.6016998291,Africa,"South Africa, Kenya, & Middle East"
JNB,Johannesburg,,South Africa,ZA,1,-26.1392,28.246,Africa,"South Africa, Kenya, & Middle East"
NBO,Nairobi,,Kenya,KE,1,-1.31923997402,36.9277992249,Africa,"South Africa, Kenya, & Middle East"
LOS,Lagos,,Nigeria,NG,1,6.5773701667785645,3.321160078048706,Africa,"South Africa, Kenya, & Middle East"
PVG,Shanghai,,China,CN,1,31.143400192260742,121.80500030517578,China,"China"
SZX,Shenzhen,,China,CN,1,22.639299392700195,113.81099700927734,China,"China"
ZHY,Zhongwei,,China,CN,1,37.572778,105.154444,China,"China"
PEK,Beijing,,China,CN,1,40.080101013183594,116.58499908447266,China,"China"
HKG,Hong Kong,,China,HK,4,22.308901,113.915001,China,"China"
CMH,Columbus,Ohio,United States,US,1,39.998056,-82.891944,North America,"United States, Mexico, & Canada"
HIO,Hillsboro,Oregon,United States,US,1,45.540394,-122.949825,North America,"United States, Mexico, & Canada"
TPA,Tampa,Florida,United States,US,1,27.979722,-82.534722,North America,"United States, Mexico, & Canada"
PNQ,Pune,Maharashtra,India,IN,1,18.582222,73.919722,Asia,"India"
MCT,Muscat,Muscat,Oman,OM,1,23.6015386,58.2899376,Middle East,"South Africa, Kenya, & Middle East"
```

### JSON lookup

The JSON version of the data can be found at [dist/aws-edge-locations.json](dist/aws-edge-locations.json).

```javascript
{
  "IAD": {
    "city": "Washington",
    "state": "District of Columbia",
    "country": "United States",
    "countryCode": "US",
    "count": 20,
    "latitude": 38.94449997,
    "longitude": -77.45580292,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "ORD": {
    "city": "Chicago",
    "state": "Illinois",
    "country": "United States",
    "countryCode": "US",
    "count": 20,
    "latitude": 41.978611,
    "longitude": -87.904722,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "JFK": {
    "city": "New York",
    "state": "New York",
    "country": "United States",
    "countryCode": "US",
    "count": 8,
    "latitude": 40.639801,
    "longitude": -73.7789,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "ATL": {
    "city": "Atlanta",
    "state": "Georgia",
    "country": "United States",
    "countryCode": "US",
    "count": 17,
    "latitude": 33.6367,
    "longitude": -84.428101,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "LAX": {
    "city": "Los Angeles",
    "state": "California",
    "country": "United States",
    "countryCode": "US",
    "count": 15,
    "latitude": 33.942501,
    "longitude": -118.407997,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "MIA": {
    "city": "Miami",
    "state": "Florida",
    "country": "United States",
    "countryCode": "US",
    "count": 11,
    "latitude": 25.79319953918457,
    "longitude": -80.29060363769531,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "DFW": {
    "city": "Dallas-Fort Worth",
    "state": "Texas",
    "country": "United States",
    "countryCode": "US",
    "count": 18,
    "latitude": 32.896801,
    "longitude": -97.038002,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "IAH": {
    "city": "Houston",
    "state": "Texas",
    "country": "United States",
    "countryCode": "US",
    "count": 6,
    "latitude": 29.984399795532227,
    "longitude": -95.34140014648438,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "SFO": {
    "city": "San Francisco",
    "state": "California",
    "country": "United States",
    "countryCode": "US",
    "count": 8,
    "latitude": 37.61899948120117,
    "longitude": -122.375,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "BOS": {
    "city": "Boston",
    "state": "Massachusetts",
    "country": "United States",
    "countryCode": "US",
    "count": 5,
    "latitude": 42.36429977,
    "longitude": -71.00520325,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "DEN": {
    "city": "Denver",
    "state": "Colorado",
    "country": "United States",
    "countryCode": "US",
    "count": 6,
    "latitude": 39.861698150635,
    "longitude": -104.672996521,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "PDX": {
    "city": "Portland",
    "state": "Oregon",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 45.58869934,
    "longitude": -122.5979996,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "SEA": {
    "city": "Seattle",
    "state": "Washington",
    "country": "United States",
    "countryCode": "US",
    "count": 6,
    "latitude": 47.448889,
    "longitude": -122.309444,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "MSP": {
    "city": "Minneapolis",
    "state": "Minnesota",
    "country": "United States",
    "countryCode": "US",
    "count": 4,
    "latitude": 44.882,
    "longitude": -93.221802,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "PHX": {
    "city": "Phoenix",
    "state": "Arizona",
    "country": "United States",
    "countryCode": "US",
    "count": 3,
    "latitude": 33.43429946899414,
    "longitude": -112.01200103759766,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "PHL": {
    "city": "Philadelphia",
    "state": "Pennsylvania",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 39.87189865112305,
    "longitude": -75.24109649658203,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "SLC": {
    "city": "Salt Lake City",
    "state": "Utah",
    "country": "United States",
    "countryCode": "US",
    "count": 1,
    "latitude": 40.78839874267578,
    "longitude": -111.97799682617188,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "BNA": {
    "city": "Nashville",
    "state": "Tennessee",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 36.1245002746582,
    "longitude": -86.6781997680664,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "DTW": {
    "city": "Detroit",
    "state": "Michigan",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 42.212398529052734,
    "longitude": -83.35340118408203,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "TPA": {
    "city": "Tampa",
    "state": "Florida",
    "country": "United States",
    "countryCode": "US",
    "count": 1,
    "latitude": 27.979722,
    "longitude": -82.534722,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "EWR": {
    "city": "Newark",
    "state": "New Jersey",
    "country": "United States",
    "countryCode": "US",
    "count": 10,
    "latitude": 40.692501068115234,
    "longitude": -74.168701171875,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "CMH": {
    "city": "Columbus",
    "state": "Ohio",
    "country": "United States",
    "countryCode": "US",
    "count": 1,
    "latitude": 39.998056,
    "longitude": -82.891944,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "MCI": {
    "city": "Kansas City",
    "state": "Missouri",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 39.2976,
    "longitude": -94.713898,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  },
  "QRO": {
    "city": "Queretaro",
    "country": "North America",
    "countryCode": "MX",
    "count": 1,
    "latitude": 20.6173,
    "longitude": -100.185997,
    "pricingRegion": null
  },
  "FRA": {
    "city": "Frankfurt am Main",
    "country": "Germany",
    "countryCode": "DE",
    "count": 17,
    "latitude": 50.033333,
    "longitude": 8.570556,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "DUS": {
    "city": "Düsseldorf",
    "country": "Germany",
    "countryCode": "DE",
    "count": 3,
    "latitude": 51.289501,
    "longitude": 6.76678,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "HAM": {
    "city": "Hamburg",
    "country": "Germany",
    "countryCode": "DE",
    "count": 6,
    "latitude": 53.630401611328,
    "longitude": 9.9882297515869,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "MUC": {
    "city": "Munich",
    "country": "Germany",
    "countryCode": "DE",
    "count": 4,
    "latitude": 48.353802,
    "longitude": 11.7861,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "TXL": {
    "city": "Berlin",
    "country": "Germany",
    "countryCode": "DE",
    "count": 5,
    "latitude": 52.559722,
    "longitude": 13.287778,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "CDG": {
    "city": "Paris",
    "country": "France",
    "countryCode": "FR",
    "count": 11,
    "latitude": 49.012798,
    "longitude": 2.55,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "MRS": {
    "city": "Marseille",
    "country": "France",
    "countryCode": "FR",
    "count": 6,
    "latitude": 43.439271922,
    "longitude": 5.22142410278,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "MXP": {
    "city": "Milan",
    "country": "Italy",
    "countryCode": "IT",
    "count": 9,
    "latitude": 45.6306,
    "longitude": 8.72811,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "FCO": {
    "city": "Rome",
    "country": "Italy",
    "countryCode": "IT",
    "count": 6,
    "latitude": 41.8002778,
    "longitude": 12.2388889,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "PMO": {
    "city": "Palermo",
    "country": "Italy",
    "countryCode": "IT",
    "count": 1,
    "latitude": 38.175999,
    "longitude": 13.091,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "AMS": {
    "city": "Amsterdam",
    "country": "Netherlands",
    "countryCode": "NL",
    "count": 5,
    "latitude": 52.308601,
    "longitude": 4.76389,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "MAN": {
    "city": "Manchester",
    "country": "UK",
    "countryCode": "GB",
    "count": 5,
    "latitude": 53.35369873046875,
    "longitude": -2.2749500274658203,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "LHR": {
    "city": "London",
    "country": "UK",
    "countryCode": "GB",
    "count": 25,
    "latitude": 51.4775,
    "longitude": -0.461389,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "DUB": {
    "city": "Dublin",
    "country": "Ireland",
    "countryCode": "IE",
    "count": 2,
    "latitude": 53.421299,
    "longitude": -6.27007,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "VIE": {
    "city": "Vienna",
    "country": "Austria",
    "countryCode": "AT",
    "count": 3,
    "latitude": 48.110298156738,
    "longitude": 16.569700241089,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "ARN": {
    "city": "Stockholm",
    "country": "Sweden",
    "countryCode": "SE",
    "count": 4,
    "latitude": 59.651901245117,
    "longitude": 17.918600082397,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "CPH": {
    "city": "Copenhagen",
    "country": "Denmark",
    "countryCode": "DK",
    "count": 3,
    "latitude": 55.617900848389,
    "longitude": 12.656000137329,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "HEL": {
    "city": "Helsinki",
    "country": "Finland",
    "countryCode": "FI",
    "count": 4,
    "latitude": 60.317199707031,
    "longitude": 24.963300704956,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "ATH": {
    "city": "Athens",
    "country": "Greece",
    "countryCode": "GR",
    "count": 1,
    "latitude": 37.9364013672,
    "longitude": 23.9444999695,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "BRU": {
    "city": "Brussels",
    "country": "Belgium",
    "countryCode": "BE",
    "count": 1,
    "latitude": 50.901401519800004,
    "longitude": 4.48443984985,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "BUD": {
    "city": "Budapest",
    "country": "Hungary",
    "countryCode": "HU",
    "count": 1,
    "latitude": 47.42976,
    "longitude": 19.261093,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "LIS": {
    "city": "Lisbon",
    "country": "Portugal",
    "countryCode": "PT",
    "count": 1,
    "latitude": 38.7813,
    "longitude": -9.13592,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "OSL": {
    "city": "Oslo",
    "country": "Norway",
    "countryCode": "NO",
    "count": 2,
    "latitude": 60.193901062012,
    "longitude": 11.100399971008,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "OTP": {
    "city": "Bucharest",
    "country": "Romania",
    "countryCode": "RO",
    "count": 1,
    "latitude": 44.5711111,
    "longitude": 26.085,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "PRG": {
    "city": "Prague",
    "country": "Czech Republic",
    "countryCode": "CZ",
    "count": 1,
    "latitude": 50.1008,
    "longitude": 14.26,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "SOF": {
    "city": "Sofia",
    "country": "Bulgaria",
    "countryCode": "BG",
    "count": 1,
    "latitude": 42.696693420410156,
    "longitude": 23.411436080932617,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "WAW": {
    "city": "Warsaw",
    "country": "Poland",
    "countryCode": "PL",
    "count": 3,
    "latitude": 52.165833,
    "longitude": 20.967222,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "ZAG": {
    "city": "Zagreb",
    "country": "Croatia",
    "countryCode": "HR",
    "count": 1,
    "latitude": 45.7429008484,
    "longitude": 16.0687999725,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "ZRH": {
    "city": "Zurich",
    "country": "Switzerland",
    "countryCode": "CH",
    "count": 2,
    "latitude": 47.464699,
    "longitude": 8.54917,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "BCN": {
    "city": "Barcelona",
    "country": "Spain",
    "countryCode": "ES",
    "count": 2,
    "latitude": 41.2971,
    "longitude": 2.07846,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "MAD": {
    "city": "Madrid",
    "country": "Spain",
    "countryCode": "ES",
    "count": 10,
    "latitude": 40.471926,
    "longitude": -3.56264,
    "region": "Europe",
    "pricingRegion": "Europe & Israel"
  },
  "DEL": {
    "city": "New Delhi",
    "country": "India",
    "countryCode": "IN",
    "count": 14,
    "latitude": 28.5665,
    "longitude": 77.103104,
    "region": "Asia",
    "pricingRegion": "India"
  },
  "MAA": {
    "city": "Chennai",
    "country": "India",
    "countryCode": "IN",
    "count": 8,
    "latitude": 12.990005493164062,
    "longitude": 80.16929626464844,
    "region": "Asia",
    "pricingRegion": "India"
  },
  "BOM": {
    "city": "Mumbai",
    "country": "India",
    "countryCode": "IN",
    "count": 8,
    "latitude": 19.0886993408,
    "longitude": 72.8678970337,
    "region": "Asia",
    "pricingRegion": "India"
  },
  "PNQ": {
    "city": "Pune",
    "state": "Maharashtra",
    "country": "India",
    "countryCode": "IN",
    "count": 1,
    "latitude": 18.582222,
    "longitude": 73.919722,
    "region": "Asia",
    "pricingRegion": "India"
  },
  "BLR": {
    "city": "Bangalore",
    "country": "India",
    "countryCode": "IN",
    "count": 5,
    "latitude": 13.1979,
    "longitude": 77.706299,
    "region": "Asia",
    "pricingRegion": "India"
  },
  "HYD": {
    "city": "Hyderabad",
    "country": "India",
    "countryCode": "IN",
    "count": 5,
    "latitude": 17.231318,
    "longitude": 78.429855,
    "region": "Asia",
    "pricingRegion": "India"
  },
  "SIN": {
    "city": "Singapore",
    "country": "Singapore",
    "countryCode": "SG",
    "count": 7,
    "latitude": 1.35019,
    "longitude": 103.994003,
    "region": "Asia",
    "pricingRegion": "Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
  },
  "KIX": {
    "city": "Osaka",
    "country": "Japan",
    "countryCode": "JP",
    "count": 5,
    "latitude": 34.42729949951172,
    "longitude": 135.24400329589844,
    "region": "Asia",
    "pricingRegion": "Japan"
  },
  "NRT": {
    "city": "Tokyo",
    "country": "Japan",
    "countryCode": "JP",
    "count": 22,
    "latitude": 35.764702,
    "longitude": 140.386002,
    "region": "Asia",
    "pricingRegion": "Japan"
  },
  "TPE": {
    "city": "Taoyuan",
    "country": "Taiwan",
    "countryCode": "TW",
    "count": 3,
    "latitude": 25.0777,
    "longitude": 121.233002,
    "region": "Asia",
    "pricingRegion": "Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
  },
  "ICN": {
    "city": "Seoul",
    "country": "Korea",
    "countryCode": "KR",
    "count": 8,
    "latitude": 37.46910095214844,
    "longitude": 126.45099639892578,
    "region": "Asia",
    "pricingRegion": "Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
  },
  "BKK": {
    "city": "Bangkok",
    "country": "Thailand",
    "countryCode": "TH",
    "count": 2,
    "latitude": 13.689999,
    "longitude": 100.750114,
    "region": "Asia",
    "pricingRegion": "Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
  },
  "CCU": {
    "city": "Kolkata",
    "country": "India",
    "countryCode": "IN",
    "count": 2,
    "latitude": 22.654699325561523,
    "longitude": 88.44670104980469,
    "region": "Asia",
    "pricingRegion": "India"
  },
  "CGK": {
    "city": "Jakarta",
    "country": "Indonesia",
    "countryCode": "ID",
    "count": 5,
    "latitude": -6.1255698204,
    "longitude": 106.65599823,
    "region": "Asia",
    "pricingRegion": "Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
  },
  "KUL": {
    "city": "Kuala Lumpur",
    "country": "Malaysia",
    "countryCode": "MY",
    "count": 2,
    "latitude": 2.745579957962,
    "longitude": 101.70999908447,
    "region": "Asia",
    "pricingRegion": "Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
  },
  "MNL": {
    "city": "Manila",
    "country": "Philippines",
    "countryCode": "PH",
    "count": 1,
    "latitude": 14.5086,
    "longitude": 121.019997,
    "region": "Asia",
    "pricingRegion": "Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
  },
  "HAN": {
    "city": "Hanoi",
    "country": "Vietnam",
    "countryCode": "VN",
    "count": 1,
    "latitude": 21.221200942993164,
    "longitude": 105.80699920654297,
    "region": "Asia",
    "pricingRegion": "Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
  },
  "SGN": {
    "city": "Ho Chi Minh City",
    "country": "Vietnam",
    "countryCode": "VN",
    "count": 1,
    "latitude": 10.8187999725,
    "longitude": 106.652000427,
    "region": "Asia",
    "pricingRegion": "Hong Kong, Indonesia, Philippines, Singapore, South Korea, Taiwan, & Thailand"
  },
  "SYD": {
    "city": "Sydney",
    "country": "Australia",
    "countryCode": "AU",
    "count": 4,
    "latitude": -33.94609832763672,
    "longitude": 151.177001953125,
    "region": "Australia & New Zealand",
    "pricingRegion": "Australia & New Zealand"
  },
  "AKL": {
    "city": "Auckland",
    "country": "New Zealand",
    "countryCode": "NZ",
    "count": 2,
    "latitude": -37.008098602299995,
    "longitude": 174.792007446,
    "region": "Australia & New Zealand",
    "pricingRegion": "Australia & New Zealand"
  },
  "MEL": {
    "city": "Melbourne",
    "country": "Australia",
    "countryCode": "AU",
    "count": 3,
    "latitude": -37.673302,
    "longitude": 144.843002,
    "region": "Australia & New Zealand",
    "pricingRegion": "Australia & New Zealand"
  },
  "PER": {
    "city": "Perth",
    "country": "Australia",
    "countryCode": "AU",
    "count": 1,
    "latitude": -31.94029998779297,
    "longitude": 115.96700286865234,
    "region": "Australia & New Zealand",
    "pricingRegion": "Australia & New Zealand"
  },
  "GRU": {
    "city": "Sao Paulo",
    "country": "Brazil",
    "countryCode": "BR",
    "count": 8,
    "latitude": -23.435556,
    "longitude": -46.473056,
    "region": "South America",
    "pricingRegion": "South America"
  },
  "GIG": {
    "city": "Rio De Janeiro",
    "country": "Brazil",
    "countryCode": "BR",
    "count": 5,
    "latitude": -22.8099994659,
    "longitude": -43.2505569458,
    "region": "South America",
    "pricingRegion": "South America"
  },
  "FOR": {
    "city": "Fortaleza",
    "country": "Brazil",
    "countryCode": "BR",
    "count": 4,
    "latitude": -3.776279926300049,
    "longitude": -38.53260040283203,
    "region": "South America",
    "pricingRegion": "South America"
  },
  "BOG": {
    "city": "Bogota",
    "country": "Colombia",
    "countryCode": "CO",
    "count": 3,
    "latitude": 4.70159,
    "longitude": -74.1469,
    "region": "South America",
    "pricingRegion": "South America"
  },
  "EZE": {
    "city": "Buenos Aires",
    "country": "Argentina",
    "countryCode": "AR",
    "count": 2,
    "latitude": -34.8222,
    "longitude": -58.5358,
    "region": "South America",
    "pricingRegion": "South America"
  },
  "SCL": {
    "city": "Santiago",
    "country": "Chile",
    "countryCode": "CL",
    "count": 3,
    "latitude": -33.393001556396484,
    "longitude": -70.78579711914062,
    "region": "South America",
    "pricingRegion": "South America"
  },
  "LIM": {
    "city": "Lima",
    "country": "Peru",
    "countryCode": "PE",
    "count": 2,
    "latitude": -12.0219,
    "longitude": -77.114305,
    "region": "South America",
    "pricingRegion": "South America"
  },
  "TLV": {
    "city": "Tel Aviv",
    "country": "Israel",
    "countryCode": "IL",
    "count": 2,
    "latitude": 32.01139831542969,
    "longitude": 34.88669967651367,
    "region": "Middle East",
    "pricingRegion": "Europe & Israel"
  },
  "BAH": {
    "city": "Manama",
    "country": "Bahrain",
    "countryCode": "BH",
    "count": 2,
    "latitude": 26.27079963684082,
    "longitude": 50.63359832763672,
    "region": "Middle East",
    "pricingRegion": "South Africa, Kenya, & Middle East"
  },
  "DXB": {
    "city": "Dubai",
    "country": "UAE",
    "countryCode": "AE",
    "count": 1,
    "latitude": 25.2527999878,
    "longitude": 55.3643989563,
    "region": "Middle East",
    "pricingRegion": "South Africa, Kenya, & Middle East"
  },
  "FJR": {
    "city": "Fujairah",
    "country": "UAE",
    "countryCode": "AE",
    "count": 3,
    "latitude": 25.112222,
    "longitude": 56.324167,
    "region": "Middle East",
    "pricingRegion": "South Africa, Kenya, & Middle East"
  },
  "MCT": {
    "city": "Muscat",
    "state": "Muscat",
    "country": "Oman",
    "countryCode": "OM",
    "count": 1,
    "latitude": 23.6015386,
    "longitude": 58.2899376,
    "region": "Middle East",
    "pricingRegion": "South Africa, Kenya, & Middle East"
  },
  "CPT": {
    "city": "Cape Town",
    "country": "South Africa",
    "countryCode": "ZA",
    "count": 1,
    "latitude": -33.9648017883,
    "longitude": 18.6016998291,
    "region": "Africa",
    "pricingRegion": "South Africa, Kenya, & Middle East"
  },
  "JNB": {
    "city": "Johannesburg",
    "country": "South Africa",
    "countryCode": "ZA",
    "count": 1,
    "latitude": -26.1392,
    "longitude": 28.246,
    "region": "Africa",
    "pricingRegion": "South Africa, Kenya, & Middle East"
  },
  "NBO": {
    "city": "Nairobi",
    "country": "Kenya",
    "countryCode": "KE",
    "count": 1,
    "latitude": -1.31923997402,
    "longitude": 36.9277992249,
    "region": "Africa",
    "pricingRegion": "South Africa, Kenya, & Middle East"
  },
  "LOS": {
    "city": "Lagos",
    "country": "Nigeria",
    "countryCode": "NG",
    "count": 1,
    "latitude": 6.5773701667785645,
    "longitude": 3.321160078048706,
    "region": "Africa",
    "pricingRegion": "South Africa, Kenya, & Middle East"
  },
  "PVG": {
    "city": "Shanghai",
    "country": "China",
    "countryCode": "CN",
    "count": 1,
    "latitude": 31.143400192260742,
    "longitude": 121.80500030517578,
    "region": "China",
    "pricingRegion": "China"
  },
  "SZX": {
    "city": "Shenzhen",
    "country": "China",
    "countryCode": "CN",
    "count": 1,
    "latitude": 22.639299392700195,
    "longitude": 113.81099700927734,
    "region": "China",
    "pricingRegion": "China"
  },
  "ZHY": {
    "city": "Zhongwei",
    "country": "China",
    "countryCode": "CN",
    "count": 1,
    "latitude": 37.572778,
    "longitude": 105.154444,
    "region": "China",
    "pricingRegion": "China"
  },
  "PEK": {
    "city": "Beijing",
    "country": "China",
    "countryCode": "CN",
    "count": 1,
    "latitude": 40.080101013183594,
    "longitude": 116.58499908447266,
    "region": "China",
    "pricingRegion": "China"
  },
  "HKG": {
    "city": "Hong Kong",
    "country": "China",
    "countryCode": "HK",
    "count": 4,
    "latitude": 22.308901,
    "longitude": 113.915001,
    "region": "China",
    "pricingRegion": "China"
  },
  "HIO": {
    "city": "Hillsboro",
    "state": "Oregon",
    "country": "United States",
    "countryCode": "US",
    "count": 1,
    "latitude": 45.540394,
    "longitude": -122.949825,
    "region": "North America",
    "pricingRegion": "United States, Mexico, & Canada"
  }
}
```
