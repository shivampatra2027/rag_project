import { useState } from 'react';
import axios, { API_URL, getUserHeaders } from '../lib/http';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';

function Upload({ onBack }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || loading) {
      setStatus('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setLoading(true);
      setStatus('Uploading...');
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { ...getUserHeaders(), 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Upload successful');
    } catch (error) {
      setStatus(error.response?.data?.message || error.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Upload Notes</CardTitle>
        <CardDescription>Upload a PDF to index your study notes into the assistant.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleUpload} disabled={!file || loading}>
            {loading ? <Spinner className="mr-2" /> : null}
            Upload
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </CardContent>
    </Card>
  );
}

export default Upload;
