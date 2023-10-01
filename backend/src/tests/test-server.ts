import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import db from '../database/database';
import { readCSVFile } from '../utils/readCSVFile';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.get('/data', (req, res) => {
    db.all('SELECT * FROM csv_data', (err, rows) => {
    if (err) {
        return res.status(500).json({ error: 'Failed to retrieve data.' });
    }

    return res.status(200).json(rows);
    });
});

app.post('/file', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const filePath = req.file.path;
  try {
    const results = await readCSVFile(filePath);

    db.serialize(() => {
      const stmt = db.prepare('INSERT INTO csv_data (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)');
      for (const data of results) {
        const { name, city, country, favorite_sport } = data;
        stmt.run(name, city, country, favorite_sport);
      }
      stmt.finalize((err) => {
        if (err) {
          console.error('Error:', err);
          return res.status(500).json({ error: 'Failed to store data in the database' });
        }
        return res.status(200).json({ message: 'File uploaded and stored in the database' });
      });
    });
  } catch (error) {
    console.error('Error on file:', error);
    return res.status(500).json({ error: 'Error on file.' });
  }
});

app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
  
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required.' });
    }
  
    db.all(
      'SELECT * FROM csv_data WHERE name LIKE ? OR city LIKE ? OR country LIKE ? OR favorite_sport LIKE ?',
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
      (err, rows) => {
        if (err) {
          console.error('Error:', err);
          return res.status(500).json({ error: 'Failed to perform the search.' });
        }
  
        return res.status(200).json(rows);
      }
    );
  });

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export { server };
