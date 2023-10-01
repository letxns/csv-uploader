import request from 'supertest';
import { server } from '../tests/test-server';
import { readCSVFile } from '../utils/readCSVFile';
import mockFs from 'mock-fs';
import fs from 'fs';

jest.mock('../utils/readCSVFile');
jest.mock('./mock/mockCSV.csv');

describe('POST /api/files', () => {
  const filePath = './mock/mockCSV.csv';

  beforeAll(() => {
    (readCSVFile as jest.Mock).mockResolvedValue(filePath);
    mockFs({
      'uploads': mockFs.directory(),
    });
  });

  afterAll(() => {
    mockFs.restore();
    server.close(); 
  });

  test('Should receive a CSV file and store it in the database', async () => {
    const response = await request(server)
      .post('/api/files')
      .attach('file', fs.createReadStream(filePath));

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('File uploaded and stored in the database');
  });
});
