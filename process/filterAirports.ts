import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { LargeCityData } from "./generate";

// Read airport data
const airportData: LargeCityData[] = JSON.parse(readFileSync(join(__dirname, '../', 'temp', 'airport-codes.json'), 'utf8'));

// Filter large airports
const largeAirports = airportData.filter(a => a.type === 'large_airport');

// Write
writeFileSync(join(__dirname, '../', 'temp', 'large-airports.json'), JSON.stringify(largeAirports), { encoding: 'utf-8' });
