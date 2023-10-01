import request from 'supertest';
import { server } from '../tests/test-server';
import { readCSVFile } from '../utils/readCSVFile';
import mockFs from 'mock-fs';

jest.mock('../utils/readCSVFile');

describe('POST /api/files', () => {
  const mockCSVData = jest.mock('./mock/mockCSV.csv')

  beforeAll(() => {
    (readCSVFile as jest.Mock).mockResolvedValue(mockCSVData);
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
      .attach('file', Buffer.from('./mock/mockCSV.csv'), 'mockCSV.csv');

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('File uploaded and stored in the database');
  });
});
