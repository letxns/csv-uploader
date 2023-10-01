import fs from 'fs';
import csv from 'csv-parser';

export const readCSVFile = (filePath: string): Promise<Array<{ name: string, city: string, country: string, favorite_sport: string }>> => {
  return new Promise((resolve, reject) => {
    const results: Array<{ name: string, city: string, country: string, favorite_sport: string }> = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}