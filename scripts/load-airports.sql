INSTALL json;
LOAD json;

COPY (select * from 'https://r2.datahub.io/clt98lrmc000fl708ilem2s44/master/raw/data/airport-codes.csv') TO 'temp/airport-codes.json' (ARRAY true);
COPY (select * from 'https://r2.datahub.io/clt98lrmc000fl708ilem2s44/master/raw/data/airport-codes.csv' where type='large_airport') TO 'temp/large-airports.json' (ARRAY true);