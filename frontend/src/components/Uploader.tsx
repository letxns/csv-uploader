import React, { useRef, useState, ChangeEvent, useEffect } from 'react';
import { ICSVRow } from '../models/Uploader';
import axios from 'axios';
import './Uploader.css'

export const Uploader: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [csvRows, setCSVRows] = useState<ICSVRow[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ICSVRow[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users?q=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      setUploadStatus('Error while searching for data.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [searchTerm]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];

    if (file) {
      if (file.type !== 'text/csv') {
        setUploadStatus('Please upload a .csv file');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('http://localhost:3000/api/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setUploadStatus('File uploaded successfully.');
        fetchData();
      } catch (error) {
        setUploadStatus('Error on uploading file. Please try again.');
        console.error('Error uploading CSV:', error);
      }
    } else {
      setUploadStatus('Error on uploading file. Please try again.');
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/data');
      setCSVRows(response.data);
      console.log('Data from /data:', response.data);
    } catch (error) {
      setUploadStatus('Error fetching data.');
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showFile = csvRows.filter((row) => {
    const searchTerms = searchTerm.toLowerCase().split(' ');
    return searchTerms.every((term) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  });

  return (
    <section>
      <button onClick={() => uploadRef.current?.click()} className="btn-upload">
        Click to upload CSV file
      </button>
      <input
        type="file"
        accept=".csv"
        ref={uploadRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />

      <article>
        <input
          type="text"
          placeholder="Search for data"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {uploadStatus && <p>{uploadStatus}</p>}
      </article>
      <div className="card-container">
        {showFile.map((row, index) => (
          <div className="card" key={index}>
            <h3>name: {row.name}</h3>
            <p>city: {row.city}</p>
            <p>country: {row.country}</p>
            <p>favorite_sport: {row.favorite_sport}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
