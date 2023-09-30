import request from 'supertest';
import { app } from '../app'; 

describe('POST /upload', () => {
  it('should return 200 if file was sent', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', 'file.csv');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'File uploaded and stored in the database.');
  });

  it('should return 400 bad request if the file didnt got sent', async () => {
    const res = await request(app).post('/upload');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'No file uploaded.');
  });
});
