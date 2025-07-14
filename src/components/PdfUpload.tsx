import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { setPdfUploaded, setUploadStatus } from '../store/chatSlice';
import { useUploadPdfMutation } from '../store/chatApi';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

export const PdfUpload: React.FC = () => {
  const { currentSession, uploadStatus } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [uploadPdf] = useUploadPdfMutation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      dispatch(setUploadStatus('idle'));
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
    }
  }, [dispatch, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: !currentSession || currentSession.pdfUploaded
  });

  const handleUpload = async () => {
    if (!selectedFile || !currentSession) return;

    dispatch(setUploadStatus('uploading'));
    
    try {
      const response = await uploadPdf({
        chatId: currentSession.id,
        file: selectedFile,
      }).unwrap();

      if (response.success) {
        dispatch(setPdfUploaded({ fileName: selectedFile.name }));
        dispatch(setUploadStatus('success'));
        setSelectedFile(null);
        toast({
          title: "PDF uploaded successfully",
          description: `${selectedFile.name} is ready for chat.`,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setUploadStatus('error'));
      toast({
        title: "Upload failed",
        description: "There was an error uploading your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    dispatch(setUploadStatus('idle'));
  };

  if (!currentSession) {
    return (
      <div className="upload-area opacity-50">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Create a new chat to upload a PDF</p>
      </div>
    );
  }

  if (currentSession.pdfUploaded) {
    return (
      <div className="upload-area border-green-500/50 bg-green-500/10">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
        <h3 className="font-semibold text-green-400 mb-2">PDF Ready</h3>
        <p className="text-sm text-muted-foreground">{currentSession.pdfName}</p>
        <p className="text-xs text-muted-foreground mt-2">
          You can now ask questions about this document
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`upload-area cursor-pointer ${
          isDragActive ? 'drag-over' : ''
        } ${selectedFile ? 'border-primary/50' : ''}`}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="space-y-4">
            <FileText className="mx-auto h-12 w-12 text-primary" />
            <div>
              <h3 className="font-semibold">{selectedFile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleUpload}
                disabled={uploadStatus === 'uploading'}
                className="btn-cosmic"
              >
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload PDF'}
              </Button>
              <Button
                onClick={clearSelection}
                variant="outline"
                size="sm"
                className="glass border-border/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className={`mx-auto h-12 w-12 ${
              isDragActive ? 'text-primary animate-bounce' : 'text-muted-foreground'
            }`} />
            <div>
              <h3 className="font-semibold mb-2">
                {isDragActive ? 'Drop your PDF here' : 'Upload a PDF document'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to select a PDF file
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadStatus === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">
            Upload failed. Please try again.
          </span>
        </div>
      )}
    </div>
  );
};