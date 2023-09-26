import { downloadAsHTML } from './utils/downloader';
import { join } from 'path';
import { writeFileSync } from 'fs';

interface RawLocationData {
  data: string;
  regionIndex: number;
}

// Start page for parsing
const startPage = 'https://aws.amazon.com/cloudfront/features/';

const getLocations = (root: HTMLElement): void => {
  // Get raw locations
  const rawEdgeRegions = root?.querySelectorAll('#aws-page-content-main > div:nth-child(2) > div > div > div[class="lb-txt-none lb-txt-18 lb-txt"]');
  const rawEdgeLocations = root?.querySelectorAll('#aws-page-content-main > div:nth-child(2) > div > div > div[class="lb-rtxt"]:nth-child(1n+5)');

  const regions: string[] = Array.from(rawEdgeRegions).map(rawEdgeRegion => rawEdgeRegion.innerHTML.toString().replace(/\\n/g, '').replace('&amp;', '&').trim())
  const rawLocationsData = Array.from(rawEdgeLocations).map(rawLocation => rawLocation.querySelectorAll('p')) //.innerHTML.toString());

  const edgeLocations: string[] = [];
  let precleanedEgeLocations: RawLocationData[] = [];
  let regionalEdgeCaches: RawLocationData[] = [];

  console.log(regions);
  console.log(rawLocationsData);

  Array.from(rawEdgeLocations).forEach((rawLocationData, regionIndex) => {
    // Get <p> tags for distinction between Edge Locations & Regional Edge Caches
    const ps = rawLocationData.querySelectorAll('p');
    console.log(Array.from(ps).length, regionIndex)
  })

  // // Iterate over locations
  // rawLocationsData.forEach((rawLocationData, regionIndex) => {
  //   const temp = rawLocationData.split('</b>');
  //   // Clean the type
  //   const type = temp[0].replace('<b>', '').replace(/&nbsp;/g, '').replace(':', '').trim().toLowerCase();
  //   // Clean the locations
  //   const locationsString = temp[1] ? temp[1].replace(/&nbsp;/g, '').replace('<br>', '').replace(': ', '').trim() : undefined;
  //   // Determine type
  //   if (type.indexOf('regional') > -1) {
  //     if (locationsString) {
  //       regionalEdgeCaches = regionalEdgeCaches.concat({
  //         data: locationsString.replace(/; /g, ';'),
  //         regionIndex,
  //       });
  //     }
  //   } else {
  //     if (locationsString) {
  //       precleanedEgeLocations = precleanedEgeLocations.concat({
  //         data: locationsString,
  //         regionIndex,
  //       });
  //     }
  //   }
  // })

  console.log({ precleanedEgeLocations, regionalEdgeCaches });
}

const run = async () => {
  // Get start page
  const html = await downloadAsHTML(startPage);
  //console.log(html?.innerText);

  if (html) {
    // Parse topics
    const locations = getLocations(html);

    // Write metadata
    //writeFileSync(join(__dirname, '../data/json', 'metadata.json'), JSON.stringify(metadata, null, 2), { encoding: 'utf-8' });
  }
};

run();