import { useRef, useState, ChangeEvent, useEffect } from 'react'
import { ICSVRow } from '../models/Uploader'
import './uploader.css'
import { parseCSV } from '../utils/ParseCSV'
import axios from 'axios';

export const Uploader = () => {
  const [uploadError, setUploadError] = useState('')
  const [csvRows, setCSVRows] = useState<ICSVRow[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const uploadRef = useRef<HTMLInputElement>(null)

  // const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {

  //   if (e.target.files === null) {
  //     return
  //   }

  //   const file = e.target.files[0]

  //   if (file) {
  //     if (file.type !== 'text/csv') {
  //       setUploadError('Please upload a .csv file');
  //     }
      
  //     const fileReader = new FileReader()
  //     fileReader.onload = (event) => {
  //       const content:string = event?.target?.result as string;
        
  //       if (content) {
  //           const rows = (content as string).split('\n');
  //           if (rows.length > 0) {
  //             const dataRows = parseCSV(content);
  //             setCSVRows(dataRows);
  //           }
  //         }
  //     }
  //       e.target.value = ''
  //       fileReader.readAsText(file)
  //       } else {
  //       setUploadError('Error on uploading file. Please try again.')
  //       }
  //   }

  // const filteredCSVRows = csvRows.filter((row) => {
  //   return row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       row.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       row.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       row.favorite_sport.toLowerCase().includes(searchTerm.toLowerCase());
  // });



  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return;
    }

    const file = e.target.files[0];

    if (file) {
      if (file.type !== 'text/csv') {
        setUploadError('Please upload a .csv file');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:3000/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Response:', response.data);
        fetchData();
      } catch (error) {
        setUploadError('Error on uploading file. Please try again.');
        console.error('Error uploading CSV:', error);
      }
    } else {
      setUploadError('Error on uploading file. Please try again.');
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/data');

      const dataRows = response.data; 
      setCSVRows(dataRows);
      console.log('Data from /data:', dataRows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCSVRows = csvRows.filter((row) => {
    return row.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        row.city?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        row.country?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        row.favorite_sport?.toLowerCase().includes(searchTerm?.toLowerCase());
  });
  return (
    <section>
        <button onClick={() => uploadRef.current?.click()} className='btn-upload'>Click to upload CSV file</button>
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
        </article>

        <div className="card-container">
            {filteredCSVRows.map((row, index) => (
            <div className="card" key={index}>
                <h3>name: {row.name}</h3>
                <p>city: {row.city}</p>
                <p>country: {row.country}</p>
                <p>favorite_sport: {row.favorite_sport}</p>
            </div>
            ))}
        </div>

        {uploadError ? <p>{uploadError}</p> : null}
    </section>
  )
}