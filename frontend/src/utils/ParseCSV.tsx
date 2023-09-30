// csvParser.ts
import { ICSVRow } from '../models/Uploader';

export function parseCSV(content: string): ICSVRow[] {
  const rows = content.split('\n').slice(1); 
  const dataRows: ICSVRow[] = [];

  rows.forEach((row) => {
    const values = row.split(',');
    if (values.length >= 4) {
      const rowData: ICSVRow = {
        name: values[0].trim(),
        city: values[1].trim(),
        country: values[2].trim(),
        favorite_sport: values[3].trim(),
      };
      console.log("rowData", rowData)
      dataRows.push(rowData);
    }
  });

  return dataRows;
}
