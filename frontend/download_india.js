import fs from 'fs';
import https from 'https';

const url = "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States";
const file = fs.createWriteStream("public/data/india_states.geojson");
https.get(url, (res) => res.pipe(file));
