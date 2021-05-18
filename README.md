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
    "city": "Ashburn",
    "state": "Virginia",
    "country": "United States",
    "countryCode": "US",
    "count": 6,
    "latitude": 38.9445,
    "longitude": -77.4558029,
    "region": "North America"
}
*/

const invalid = el.lookup('FOO'); // returns false

// Get edge location count
const locationCount = el.getLocationCount(); // returns 89

// Get PoP count
const popCount = el.getPoPCount() // returns 218
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
code,city,state,country,country_code,count,latitude,longitude,region
IAD,Ashburn,Virginia,United States,US,6,38.9445,-77.4558029,North America
ATL,Atlanta,Georgia,United States,US,6,33.6367,-84.428101,North America
BOS,Boston,Massachusetts,United States,US,3,42.36429977,-71.00520325,North America
ORD,Chicago,Illinois,United States,US,6,41.978611,-87.904722,North America
DFW,Dallas/Fort Worth,Texas,United States,US,6,32.896801,-97.038002,North America
DEN,Denver,Colorado,United States,US,2,39.861698150635,-104.672996521,North America
HWD,Hayward,California,United States,US,1,37.658889,-122.121667,North America
HIO,Hillsboro,Oregon,United States,US,3,45.540394,-122.949825,North America
IAH,Houston,Texas,United States,US,4,29.984399795532227,-95.34140014648438,North America
JAX,Jacksonville,Florida,United States,US,1,30.49410057067871,-81.68789672851562,North America
LAX,Los Angeles,California,United States,US,5,33.942501,-118.407997,North America
MIA,Miami,Florida,United States,US,4,25.79319953918457,-80.29060363769531,North America
MSP,Minneapolis,Minnesota,United States,US,1,44.882,-93.221802,North America
YUL,Montreal,Quebec,Canada,CA,1,45.470556,-73.740833,North America
JFK,New York,New York,United States,US,2,40.639801,-73.7789,North America
EWR,Newark,New Jersey,United States,US,7,40.692501068115234,-74.168701171875,North America
PAO,Palo Alto,California,United States,US,1,37.461111,-122.115,North America
PHL,Philadelphia,Pennsylvania,United States,US,2,39.87189865112305,-75.24109649658203,North America
PHX,Phoenix,Arizona,United States,US,2,33.43429946899414,-112.01200103759766,North America
SLC,Salt Lake City,Utah,United States,US,1,40.78839874267578,-111.97799682617188,North America
SJC,San Jose,California,United States,US,2,37.362598,-121.929001,North America
SEA,Seattle,Washington,United States,US,3,47.448889,-122.309444,North America
YTO,Toronto,Ontario,Canada,CA,2,43.6772003174,-79.63059997559999,North America
AMS,Amsterdam,,The Netherlands,NL,2,52.308601,4.76389,Europe
ATH,Athens,,Greece,GR,1,37.9364013672,23.9444999695,Europe
TXL,Berlin,,Germany,DE,2,52.559722,13.287778,Europe
BRU,Brussels,,Belgium,BE,1,50.901401519800004,4.48443984985,Europe
OTP,Bucharest,,Romania,RO,1,44.5711111,26.085,Europe
BUD,Budapest,,Hungary,HU,1,47.42976,19.261093,Europe
CPH,Copenhagen,,Denmark,DK,1,55.617900848389,12.656000137329,Europe
DUB,Dublin,,Ireland,IE,1,53.421299,-6.27007,Europe
DUS,Dusseldorf,,Germany,DE,1,51.289501,6.76678,Europe
FRA,Frankfurt am Main,,Germany,DE,10,50.033333,8.570556,Europe
HAM,Hamburg,,Germany,DE,1,53.630401611328,9.9882297515869,Europe
HEL,Helsinki,,Finland,FI,1,60.317199707031,24.963300704956,Europe
LIS,Lisbon,,Portugal,PT,1,38.7813,-9.13592,Europe
LHR,London,,England,GB,9,51.4775,-0.461389,Europe
MAD,Madrid,,Spain,ES,3,40.471926,-3.56264,Europe
MAN,Manchester,,England,GB,2,53.35369873046875,-2.2749500274658203,Europe
MRS,Marseille,,France,FR,1,43.439271922,5.22142410278,Europe
MXP,Milan,,Italy,IT,3,45.6306,8.72811,Europe
MUC,Munich,,Germany,DE,2,48.353802,11.7861,Europe
OSL,Oslo,,Norway,NO,1,60.193901062012,11.100399971008,Europe
PMO,Palermo,,Italy,IT,1,38.175999,13.091,Europe
CDG,Paris,,France,FR,5,49.012798,2.55,Europe
PRG,Prague,,Czech Republic,CZ,1,50.1008,14.26,Europe
FCO,Rome,,Italy,IT,1,41.8002778,12.2388889,Europe
SOF,Sofia,,Bulgaria,BG,1,42.696693420410156,23.411436080932617,Europe
ARN,Stockholm,,Sweden,SE,3,59.651901245117,17.918600082397,Europe
VIE,Vienna,,Austria,AT,1,48.110298156738,16.569700241089,Europe
WMI,Warsaw,,Poland,PL,1,52.451099,20.6518,Europe
ZAG,Zagreb,,Croatia,HR,1,45.7429008484,16.0687999725,Europe
ZRH,Zurich,,Switzerland,CH,2,47.464699,8.54917,Europe
BLR,Bangalore,,India,IN,3,13.1979,77.706299,Asia
DMK,Bangkok,,Thailand,TH,2,13.9125995636,100.607002258,Asia
MAA,Chennai,,India,IN,4,12.990005493164062,80.16929626464844,Asia
HKG,Hong Kong,,China,HK,3,22.308901,113.915001,Asia
HYD,Hyderabad,,India,IN,3,17.231318,78.429855,Asia
CGK,Jakarta,,Indonesia,ID,1,-6.1255698204,106.65599823,Asia
CCU,Kolkata,,India,IN,2,22.654699325561523,88.44670104980469,Asia
KUL,Kuala Lumpur,,Malaysia,MY,2,2.745579957962,101.70999908447,Asia
BOM,Mumbai,,India,IN,4,19.0886993408,72.8678970337,Asia
MNL,Manila,,Philippines,PH,1,14.5086,121.019997,Asia
DEL,New Delhi,,India,IN,5,28.5665,77.103104,Asia
KIX,Osaka,,Japan,JP,1,34.42729949951172,135.24400329589844,Asia
ICN,Seoul,,South Korea,KR,4,37.46910095214844,126.45099639892578,Asia
SIN,Singapore,,Singapore,SG,4,1.35019,103.994003,Asia
TPE,Taipei,,Taiwan,TW,3,25.0777,121.233002,Asia
NRT,Tokyo,,Japan,JP,16,35.764702,140.386002,Asia
AKL,Auckland,,New Zealand,NZ,2,-37.008098602299995,174.792007446,Australia & New Zealand
MEL,Melbourne,,Australia,AU,2,-37.673302,144.843002,Australia & New Zealand
PER,Perth,,Australia,AU,1,-31.94029998779297,115.96700286865234,Australia & New Zealand
SYD,Sydney,,Australia,AU,4,-33.94609832763672,151.177001953125,Australia & New Zealand
BOG,Bogota,,Colombia,CO,1,4.70159,-74.1469,South America
EZE,Buenos Aires,,Argentina,AR,1,-34.8222,-58.5358,South America
GIG,Rio de Janeiro,,Brazil,BR,2,-22.8099994659,-43.2505569458,South America
SCL,Santiago,,Chile,CL,1,-33.393001556396484,-70.78579711914062,South America
GRU,Sao Paulo,,Brazil,BR,2,-23.435556,-46.473056,South America
DXB,Dubai,,United Arab Emirates,AE,1,25.2527999878,55.3643989563,Middle East
FJR,Fujairah,,United Arab Emirates,AE,1,25.112222,56.324167,Middle East
BAH,Manama,,Bahrain,BH,1,26.27079963684082,50.63359832763672,Middle East
TLV,Tel Aviv,,Israel,IL,1,32.01139831542969,34.88669967651367,Middle East
CPT,Cape Town,,South Africa,ZA,1,-33.9648017883,18.6016998291,Africa
JNB,Johannesburg,,South Africa,ZA,1,-26.1392,28.246,Africa
NBO,Nairobi,,Kenya,KE,1,-1.31923997402,36.9277992249,Africa
PEK,Beijing,,China,CN,1,40.080101013183594,116.58499908447266,China
SZX,Shenzhen,,China,CN,1,22.639299392700195,113.81099700927734,China
PVG,Shanghai,,China,CN,1,31.143400192260742,121.80500030517578,China
ZHY,Zhongwei,,China,CN,1,37.572778,105.154444,China
```

### JSON lookup

The JSON version of the data can be found at [dist/aws-edge-locations.json](dist/aws-edge-locations.json).

```javascript
{
  "IAD": {
    "city": "Ashburn",
    "state": "Virginia",
    "country": "United States",
    "countryCode": "US",
    "count": 6,
    "latitude": 38.9445,
    "longitude": -77.4558029,
    "region": "North America"
  },
  "ATL": {
    "city": "Atlanta",
    "state": "Georgia",
    "country": "United States",
    "countryCode": "US",
    "count": 6,
    "latitude": 33.6367,
    "longitude": -84.428101,
    "region": "North America"
  },
  "BOS": {
    "city": "Boston",
    "state": "Massachusetts",
    "country": "United States",
    "countryCode": "US",
    "count": 3,
    "latitude": 42.36429977,
    "longitude": -71.00520325,
    "region": "North America"
  },
  "ORD": {
    "city": "Chicago",
    "state": "Illinois",
    "country": "United States",
    "countryCode": "US",
    "count": 6,
    "latitude": 41.978611,
    "longitude": -87.904722,
    "region": "North America"
  },
  "DFW": {
    "city": "Dallas/Fort Worth",
    "state": "Texas",
    "country": "United States",
    "countryCode": "US",
    "count": 6,
    "latitude": 32.896801,
    "longitude": -97.038002,
    "region": "North America"
  },
  "DEN": {
    "city": "Denver",
    "state": "Colorado",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 39.861698150635,
    "longitude": -104.672996521,
    "region": "North America"
  },
  "HWD": {
    "city": "Hayward",
    "state": "California",
    "country": "United States",
    "countryCode": "US",
    "count": 1,
    "latitude": 37.658889,
    "longitude": -122.121667,
    "region": "North America"
  },
  "HIO": {
    "city": "Hillsboro",
    "state": "Oregon",
    "country": "United States",
    "countryCode": "US",
    "count": 3,
    "latitude": 45.540394,
    "longitude": -122.949825,
    "region": "North America"
  },
  "IAH": {
    "city": "Houston",
    "state": "Texas",
    "country": "United States",
    "countryCode": "US",
    "count": 4,
    "latitude": 29.984399795532227,
    "longitude": -95.34140014648438,
    "region": "North America"
  },
  "JAX": {
    "city": "Jacksonville",
    "state": "Florida",
    "country": "United States",
    "countryCode": "US",
    "count": 1,
    "latitude": 30.49410057067871,
    "longitude": -81.68789672851562,
    "region": "North America"
  },
  "LAX": {
    "city": "Los Angeles",
    "state": "California",
    "country": "United States",
    "countryCode": "US",
    "count": 5,
    "latitude": 33.942501,
    "longitude": -118.407997,
    "region": "North America"
  },
  "MIA": {
    "city": "Miami",
    "state": "Florida",
    "country": "United States",
    "countryCode": "US",
    "count": 4,
    "latitude": 25.79319953918457,
    "longitude": -80.29060363769531,
    "region": "North America"
  },
  "MSP": {
    "city": "Minneapolis",
    "state": "Minnesota",
    "country": "United States",
    "countryCode": "US",
    "count": 1,
    "latitude": 44.882,
    "longitude": -93.221802,
    "region": "North America"
  },
  "YUL": {
    "city": "Montreal",
    "state": "Quebec",
    "country": "Canada",
    "countryCode": "CA",
    "count": 1,
    "latitude": 45.470556,
    "longitude": -73.740833,
    "region": "North America"
  },
  "JFK": {
    "city": "New York",
    "state": "New York",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 40.639801,
    "longitude": -73.7789,
    "region": "North America"
  },
  "EWR": {
    "city": "Newark",
    "state": "New Jersey",
    "country": "United States",
    "countryCode": "US",
    "count": 7,
    "latitude": 40.692501068115234,
    "longitude": -74.168701171875,
    "region": "North America"
  },
  "PAO": {
    "city": "Palo Alto",
    "state": "California",
    "country": "United States",
    "countryCode": "US",
    "count": 1,
    "latitude": 37.461111,
    "longitude": -122.115,
    "region": "North America"
  },
  "PHL": {
    "city": "Philadelphia",
    "state": "Pennsylvania",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 39.87189865112305,
    "longitude": -75.24109649658203,
    "region": "North America"
  },
  "PHX": {
    "city": "Phoenix",
    "state": "Arizona",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 33.43429946899414,
    "longitude": -112.01200103759766,
    "region": "North America"
  },
  "SLC": {
    "city": "Salt Lake City",
    "state": "Utah",
    "country": "United States",
    "countryCode": "US",
    "count": 1,
    "latitude": 40.78839874267578,
    "longitude": -111.97799682617188,
    "region": "North America"
  },
  "SJC": {
    "city": "San Jose",
    "state": "California",
    "country": "United States",
    "countryCode": "US",
    "count": 2,
    "latitude": 37.362598,
    "longitude": -121.929001,
    "region": "North America"
  },
  "SEA": {
    "city": "Seattle",
    "state": "Washington",
    "country": "United States",
    "countryCode": "US",
    "count": 3,
    "latitude": 47.448889,
    "longitude": -122.309444,
    "region": "North America"
  },
  "YTO": {
    "city": "Toronto",
    "state": "Ontario",
    "country": "Canada",
    "countryCode": "CA",
    "count": 2,
    "latitude": 43.6772003174,
    "longitude": -79.63059997559999,
    "region": "North America"
  },
  "AMS": {
    "city": "Amsterdam",
    "country": "The Netherlands",
    "countryCode": "NL",
    "count": 2,
    "latitude": 52.308601,
    "longitude": 4.76389,
    "region": "Europe"
  },
  "ATH": {
    "city": "Athens",
    "country": "Greece",
    "countryCode": "GR",
    "count": 1,
    "latitude": 37.9364013672,
    "longitude": 23.9444999695,
    "region": "Europe"
  },
  "TXL": {
    "city": "Berlin",
    "country": "Germany",
    "countryCode": "DE",
    "count": 2,
    "latitude": 52.559722,
    "longitude": 13.287778,
    "region": "Europe"
  },
  "BRU": {
    "city": "Brussels",
    "country": "Belgium",
    "countryCode": "BE",
    "count": 1,
    "latitude": 50.901401519800004,
    "longitude": 4.48443984985,
    "region": "Europe"
  },
  "OTP": {
    "city": "Bucharest",
    "country": "Romania",
    "countryCode": "RO",
    "count": 1,
    "latitude": 44.5711111,
    "longitude": 26.085,
    "region": "Europe"
  },
  "BUD": {
    "city": "Budapest",
    "country": "Hungary",
    "countryCode": "HU",
    "count": 1,
    "latitude": 47.42976,
    "longitude": 19.261093,
    "region": "Europe"
  },
  "CPH": {
    "city": "Copenhagen",
    "country": "Denmark",
    "countryCode": "DK",
    "count": 1,
    "latitude": 55.617900848389,
    "longitude": 12.656000137329,
    "region": "Europe"
  },
  "DUB": {
    "city": "Dublin",
    "country": "Ireland",
    "countryCode": "IE",
    "count": 1,
    "latitude": 53.421299,
    "longitude": -6.27007,
    "region": "Europe"
  },
  "DUS": {
    "city": "Dusseldorf",
    "country": "Germany",
    "countryCode": "DE",
    "count": 1,
    "latitude": 51.289501,
    "longitude": 6.76678,
    "region": "Europe"
  },
  "FRA": {
    "city": "Frankfurt am Main",
    "country": "Germany",
    "countryCode": "DE",
    "count": 10,
    "latitude": 50.033333,
    "longitude": 8.570556,
    "region": "Europe"
  },
  "HAM": {
    "city": "Hamburg",
    "country": "Germany",
    "countryCode": "DE",
    "count": 1,
    "latitude": 53.630401611328,
    "longitude": 9.9882297515869,
    "region": "Europe"
  },
  "HEL": {
    "city": "Helsinki",
    "country": "Finland",
    "countryCode": "FI",
    "count": 1,
    "latitude": 60.317199707031,
    "longitude": 24.963300704956,
    "region": "Europe"
  },
  "LIS": {
    "city": "Lisbon",
    "country": "Portugal",
    "countryCode": "PT",
    "count": 1,
    "latitude": 38.7813,
    "longitude": -9.13592,
    "region": "Europe"
  },
  "LHR": {
    "city": "London",
    "country": "England",
    "countryCode": "GB",
    "count": 9,
    "latitude": 51.4775,
    "longitude": -0.461389,
    "region": "Europe"
  },
  "MAD": {
    "city": "Madrid",
    "country": "Spain",
    "countryCode": "ES",
    "count": 3,
    "latitude": 40.471926,
    "longitude": -3.56264,
    "region": "Europe"
  },
  "MAN": {
    "city": "Manchester",
    "country": "England",
    "countryCode": "GB",
    "count": 2,
    "latitude": 53.35369873046875,
    "longitude": -2.2749500274658203,
    "region": "Europe"
  },
  "MRS": {
    "city": "Marseille",
    "country": "France",
    "countryCode": "FR",
    "count": 1,
    "latitude": 43.439271922,
    "longitude": 5.22142410278,
    "region": "Europe"
  },
  "MXP": {
    "city": "Milan",
    "country": "Italy",
    "countryCode": "IT",
    "count": 3,
    "latitude": 45.6306,
    "longitude": 8.72811,
    "region": "Europe"
  },
  "MUC": {
    "city": "Munich",
    "country": "Germany",
    "countryCode": "DE",
    "count": 2,
    "latitude": 48.353802,
    "longitude": 11.7861,
    "region": "Europe"
  },
  "OSL": {
    "city": "Oslo",
    "country": "Norway",
    "countryCode": "NO",
    "count": 1,
    "latitude": 60.193901062012,
    "longitude": 11.100399971008,
    "region": "Europe"
  },
  "PMO": {
    "city": "Palermo",
    "country": "Italy",
    "countryCode": "IT",
    "count": 1,
    "latitude": 38.175999,
    "longitude": 13.091,
    "region": "Europe"
  },
  "CDG": {
    "city": "Paris",
    "country": "France",
    "countryCode": "FR",
    "count": 5,
    "latitude": 49.012798,
    "longitude": 2.55,
    "region": "Europe"
  },
  "PRG": {
    "city": "Prague",
    "country": "Czech Republic",
    "countryCode": "CZ",
    "count": 1,
    "latitude": 50.1008,
    "longitude": 14.26,
    "region": "Europe"
  },
  "FCO": {
    "city": "Rome",
    "country": "Italy",
    "countryCode": "IT",
    "count": 1,
    "latitude": 41.8002778,
    "longitude": 12.2388889,
    "region": "Europe"
  },
  "SOF": {
    "city": "Sofia",
    "country": "Bulgaria",
    "countryCode": "BG",
    "count": 1,
    "latitude": 42.696693420410156,
    "longitude": 23.411436080932617,
    "region": "Europe"
  },
  "ARN": {
    "city": "Stockholm",
    "country": "Sweden",
    "countryCode": "SE",
    "count": 3,
    "latitude": 59.651901245117,
    "longitude": 17.918600082397,
    "region": "Europe"
  },
  "VIE": {
    "city": "Vienna",
    "country": "Austria",
    "countryCode": "AT",
    "count": 1,
    "latitude": 48.110298156738,
    "longitude": 16.569700241089,
    "region": "Europe"
  },
  "WMI": {
    "city": "Warsaw",
    "country": "Poland",
    "countryCode": "PL",
    "count": 1,
    "latitude": 52.451099,
    "longitude": 20.6518,
    "region": "Europe"
  },
  "ZAG": {
    "city": "Zagreb",
    "country": "Croatia",
    "countryCode": "HR",
    "count": 1,
    "latitude": 45.7429008484,
    "longitude": 16.0687999725,
    "region": "Europe"
  },
  "ZRH": {
    "city": "Zurich",
    "country": "Switzerland",
    "countryCode": "CH",
    "count": 2,
    "latitude": 47.464699,
    "longitude": 8.54917,
    "region": "Europe"
  },
  "BLR": {
    "city": "Bangalore",
    "country": "India",
    "countryCode": "IN",
    "count": 3,
    "latitude": 13.1979,
    "longitude": 77.706299,
    "region": "Asia"
  },
  "DMK": {
    "city": "Bangkok",
    "country": "Thailand",
    "countryCode": "TH",
    "count": 2,
    "latitude": 13.9125995636,
    "longitude": 100.607002258,
    "region": "Asia"
  },
  "MAA": {
    "city": "Chennai",
    "country": "India",
    "countryCode": "IN",
    "count": 4,
    "latitude": 12.990005493164062,
    "longitude": 80.16929626464844,
    "region": "Asia"
  },
  "HKG": {
    "city": "Hong Kong",
    "country": "China",
    "countryCode": "HK",
    "count": 3,
    "latitude": 22.308901,
    "longitude": 113.915001,
    "region": "Asia"
  },
  "HYD": {
    "city": "Hyderabad",
    "country": "India",
    "countryCode": "IN",
    "count": 3,
    "latitude": 17.231318,
    "longitude": 78.429855,
    "region": "Asia"
  },
  "CGK": {
    "city": "Jakarta",
    "country": "Indonesia",
    "countryCode": "ID",
    "count": 1,
    "latitude": -6.1255698204,
    "longitude": 106.65599823,
    "region": "Asia"
  },
  "CCU": {
    "city": "Kolkata",
    "country": "India",
    "countryCode": "IN",
    "count": 2,
    "latitude": 22.654699325561523,
    "longitude": 88.44670104980469,
    "region": "Asia"
  },
  "KUL": {
    "city": "Kuala Lumpur",
    "country": "Malaysia",
    "countryCode": "MY",
    "count": 2,
    "latitude": 2.745579957962,
    "longitude": 101.70999908447,
    "region": "Asia"
  },
  "BOM": {
    "city": "Mumbai",
    "country": "India",
    "countryCode": "IN",
    "count": 4,
    "latitude": 19.0886993408,
    "longitude": 72.8678970337,
    "region": "Asia"
  },
  "MNL": {
    "city": "Manila",
    "country": "Philippines",
    "countryCode": "PH",
    "count": 1,
    "latitude": 14.5086,
    "longitude": 121.019997,
    "region": "Asia"
  },
  "DEL": {
    "city": "New Delhi",
    "country": "India",
    "countryCode": "IN",
    "count": 5,
    "latitude": 28.5665,
    "longitude": 77.103104,
    "region": "Asia"
  },
  "KIX": {
    "city": "Osaka",
    "country": "Japan",
    "countryCode": "JP",
    "count": 1,
    "latitude": 34.42729949951172,
    "longitude": 135.24400329589844,
    "region": "Asia"
  },
  "ICN": {
    "city": "Seoul",
    "country": "South Korea",
    "countryCode": "KR",
    "count": 4,
    "latitude": 37.46910095214844,
    "longitude": 126.45099639892578,
    "region": "Asia"
  },
  "SIN": {
    "city": "Singapore",
    "country": "Singapore",
    "countryCode": "SG",
    "count": 4,
    "latitude": 1.35019,
    "longitude": 103.994003,
    "region": "Asia"
  },
  "TPE": {
    "city": "Taipei",
    "country": "Taiwan",
    "countryCode": "TW",
    "count": 3,
    "latitude": 25.0777,
    "longitude": 121.233002,
    "region": "Asia"
  },
  "NRT": {
    "city": "Tokyo",
    "country": "Japan",
    "countryCode": "JP",
    "count": 16,
    "latitude": 35.764702,
    "longitude": 140.386002,
    "region": "Asia"
  },
  "AKL": {
    "city": "Auckland",
    "country": "New Zealand",
    "countryCode": "NZ",
    "count": 2,
    "latitude": -37.008098602299995,
    "longitude": 174.792007446,
    "region": "Australia & New Zealand"
  },
  "MEL": {
    "city": "Melbourne",
    "country": "Australia",
    "countryCode": "AU",
    "count": 2,
    "latitude": -37.673302,
    "longitude": 144.843002,
    "region": "Australia & New Zealand"
  },
  "PER": {
    "city": "Perth",
    "country": "Australia",
    "countryCode": "AU",
    "count": 1,
    "latitude": -31.94029998779297,
    "longitude": 115.96700286865234,
    "region": "Australia & New Zealand"
  },
  "SYD": {
    "city": "Sydney",
    "country": "Australia",
    "countryCode": "AU",
    "count": 4,
    "latitude": -33.94609832763672,
    "longitude": 151.177001953125,
    "region": "Australia & New Zealand"
  },
  "BOG": {
    "city": "Bogota",
    "country": "Colombia",
    "countryCode": "CO",
    "count": 1,
    "latitude": 4.70159,
    "longitude": -74.1469,
    "region": "South America"
  },
  "EZE": {
    "city": "Buenos Aires",
    "country": "Argentina",
    "countryCode": "AR",
    "count": 1,
    "latitude": -34.8222,
    "longitude": -58.5358,
    "region": "South America"
  },
  "GIG": {
    "city": "Rio de Janeiro",
    "country": "Brazil",
    "countryCode": "BR",
    "count": 2,
    "latitude": -22.8099994659,
    "longitude": -43.2505569458,
    "region": "South America"
  },
  "SCL": {
    "city": "Santiago",
    "country": "Chile",
    "countryCode": "CL",
    "count": 1,
    "latitude": -33.393001556396484,
    "longitude": -70.78579711914062,
    "region": "South America"
  },
  "GRU": {
    "city": "Sao Paulo",
    "country": "Brazil",
    "countryCode": "BR",
    "count": 2,
    "latitude": -23.435556,
    "longitude": -46.473056,
    "region": "South America"
  },
  "DXB": {
    "city": "Dubai",
    "country": "United Arab Emirates",
    "countryCode": "AE",
    "count": 1,
    "latitude": 25.2527999878,
    "longitude": 55.3643989563,
    "region": "Middle East"
  },
  "FJR": {
    "city": "Fujairah",
    "country": "United Arab Emirates",
    "countryCode": "AE",
    "count": 1,
    "latitude": 25.112222,
    "longitude": 56.324167,
    "region": "Middle East"
  },
  "BAH": {
    "city": "Manama",
    "country": "Bahrain",
    "countryCode": "BH",
    "count": 1,
    "latitude": 26.27079963684082,
    "longitude": 50.63359832763672,
    "region": "Middle East"
  },
  "TLV": {
    "city": "Tel Aviv",
    "country": "Israel",
    "countryCode": "IL",
    "count": 1,
    "latitude": 32.01139831542969,
    "longitude": 34.88669967651367,
    "region": "Middle East"
  },
  "CPT": {
    "city": "Cape Town",
    "country": "South Africa",
    "countryCode": "ZA",
    "count": 1,
    "latitude": -33.9648017883,
    "longitude": 18.6016998291,
    "region": "Africa"
  },
  "JNB": {
    "city": "Johannesburg",
    "country": "South Africa",
    "countryCode": "ZA",
    "count": 1,
    "latitude": -26.1392,
    "longitude": 28.246,
    "region": "Africa"
  },
  "NBO": {
    "city": "Nairobi",
    "country": "Kenya",
    "countryCode": "KE",
    "count": 1,
    "latitude": -1.31923997402,
    "longitude": 36.9277992249,
    "region": "Africa"
  },
  "PEK": {
    "city": "Beijing",
    "country": "China",
    "countryCode": "CN",
    "count": 1,
    "latitude": 40.080101013183594,
    "longitude": 116.58499908447266,
    "region": "China"
  },
  "SZX": {
    "city": "Shenzhen",
    "country": "China",
    "countryCode": "CN",
    "count": 1,
    "latitude": 22.639299392700195,
    "longitude": 113.81099700927734,
    "region": "China"
  },
  "PVG": {
    "city": "Shanghai",
    "country": "China",
    "countryCode": "CN",
    "count": 1,
    "latitude": 31.143400192260742,
    "longitude": 121.80500030517578,
    "region": "China"
  },
  "ZHY": {
    "city": "Zhongwei",
    "country": "China",
    "countryCode": "CN",
    "count": 1,
    "latitude": 37.572778,
    "longitude": 105.154444,
    "region": "China"
  }
}
```
