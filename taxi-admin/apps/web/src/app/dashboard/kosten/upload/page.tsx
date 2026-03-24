'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Upload, FileText, X } from 'lucide-react';

export default function UploadReceiptPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/receipts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Bonnetje geüpload! We verwerken het automatisch.');
      router.push('/dashboard/kosten');
    },
    onError: () => {
      toast.error('Upload mislukt');
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSubmit = () => {
    if (file) {
      mutation.mutate(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bonnetje uploaden</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Laat het bestand hier los...'
              : 'Sleep een bonnetje hierheen, of klik om te selecteren'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG of PDF (max 10MB)
          </p>
        </div>

        {file && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">{file.name}</span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={!file || mutation.isPending}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Uploaden...' : 'Uploaden'}
          </button>
          <button
            onClick={() => router.push('/dashboard/kosten')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuleren
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Onze AI leest het bonnetje automatisch uit en vult de gegevens in. 
            Je kunt ze daarna nog aanpassen indien nodig.
          </p>
        </div>
      </div>
    </div>
  );
}
