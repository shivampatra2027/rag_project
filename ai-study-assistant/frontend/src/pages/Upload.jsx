import { useState, useRef } from 'react';
import axios, { API_URL, getUserHeaders } from '../lib/http';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Spinner } from '../components/ui/spinner';
import { Upload as UploadIcon, FileText, CheckCircle, X, Sparkles } from 'lucide-react';

function Upload({ onBack }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef(null);

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
      setUploadProgress(0);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { ...getUserHeaders() },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setStatus('Upload successful!');
    } catch (error) {
      setUploadProgress(0);
      setStatus(error.response?.data?.message || error.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setStatus('');
    } else {
      setStatus('Please drop a PDF file.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus('');
    } else {
      setStatus('Please select a PDF file.');
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus('');
    setUploadProgress(0);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-[900px] items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
      <Card className="w-full max-w-xl rounded-2xl border border-zinc-800/50 bg-zinc-950/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <CardHeader className="border-b border-zinc-800/50 bg-zinc-950/60 px-6 py-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
              <Sparkles size={24} />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-zinc-100">Upload Notes</CardTitle>
              <CardDescription className="text-zinc-400">Upload a PDF to index your study notes into the assistant.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 py-6">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300
              ${isDragOver 
                ? 'border-cyan-500 bg-cyan-500/10 scale-[1.02]' 
                : 'border-zinc-700 hover:border-cyan-500/50 hover:bg-zinc-900/50'
              }
              ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <FileText size={32} />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-zinc-200">{file.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-800/50 text-zinc-400">
                  <UploadIcon size={32} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    Drag and drop your PDF here
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    or click to browse
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Uploading...</span>
                <span className="text-cyan-400">{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Indicator */}
          {status === 'Upload successful!' && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-emerald-400">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">{status}</span>
            </div>
          )}

          {/* Error/Status Message */}
          {status && status !== 'Upload successful!' && (
            <p className={`text-sm ${status.includes('failed') || status.includes('Please') ? 'text-red-400' : 'text-zinc-400'}`}>
              {status}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              type="button" 
              onClick={handleUpload} 
              disabled={!file || loading}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-cyan-500/30 disabled:hover:translate-y-0 disabled:opacity-50"
            >
              {loading ? <Spinner className="mr-2" /> : null}
              Upload PDF
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="rounded-xl border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-200"
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Upload;

