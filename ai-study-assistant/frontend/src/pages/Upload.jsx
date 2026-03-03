import { useState } from 'react';
import apiClient from '../api/apiClient';

function Upload({ onBack }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setStatus('Uploading...');
      await apiClient.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Upload successful');
    } catch (error) {
      setStatus(error.response?.data?.message || error.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Upload Notes</h1>
      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '320px' }}>
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="button" onClick={handleUpload}>
          Upload
        </button>
        <button type="button" onClick={onBack}>
          Back
        </button>
        {status ? <p>{status}</p> : null}
      </div>
    </main>
  );
}

export default Upload;
