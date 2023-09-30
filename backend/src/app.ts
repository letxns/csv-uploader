import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import db from './database/database';
import fs from "fs";
import csv from 'csv-parser';

export const app = express();
const port = 3000;

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

app.post('/file', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    const filePath = req.file.path;

    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
        try {
        const content = req?.file?.buffer?.toString();
        db.run(
            'INSERT INTO csv_data (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)',

            (err) => {
                if (err) {
                    console.error('Error:', err);
                    return res.status(500).json({ error: 'Failed to store data in the database.' });
                }
        
            return res.status(200).json({ message: 'File uploaded and stored in the database.' });
            }
        );
        
        } catch (error) {
            console.error('Error on file:', error);
            return res.status(500).json({ error: 'Error on file.' });
        }
    });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
