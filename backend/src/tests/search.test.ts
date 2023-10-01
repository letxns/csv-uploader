import request from 'supertest';
import { server } from '../tests/test-server';
import db from '../database/database';

beforeAll((done) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS csv_data (
        id INTEGER PRIMARY KEY,
        name VARCHAR,
        city VARCHAR,
        country VARCHAR,
        favorite_sport VARCHAR
      );
    `);

    const exampleData = [
      ['John Doe', 'New York', 'USA', 'Basketball'],
    ];
  
    const insertData = () => {
      if (exampleData.length === 0) {
        done();
        return;
      }
  
      const data = exampleData.pop();
      db.run(
        'INSERT INTO csv_data (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)',
        data,
        (err) => {
          if (err) {
            console.error('Error inserting data:', err);
          }
          insertData();
        }
      );
    };
  
    insertData();
  });

async function clearDatabase() {
    return new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM csv_data', (err) => {
        if (err) {
          console.error('Error clearing database:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }  

describe('GET test for /search', () => {
    it('should return an empty array when no search term is provided', async () => {
      const response = await request(server).get('/search');
      
      expect(response.status).toBe(400); 
      expect(response.body.error).toEqual('Search term is required.'); 
    });
  
    it('should return search results based on the provided search term', async () => {
      const searchTerm = 'New York'; 
  
      const response = await request(server).get('/search').query({ q: searchTerm });
      
      expect(response.status).toBe(200); 
      expect(Array.isArray(response.body)).toBe(true); 
      expect(response.body.length).toBeGreaterThan(0); 
      for (const result of response.body) {
        expect(
          result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.favorite_sport.toLowerCase().includes(searchTerm.toLowerCase())
        ).toBe(true);
      }
    });
  });
  
  afterAll(async () => {
    await clearDatabase();
  
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  
