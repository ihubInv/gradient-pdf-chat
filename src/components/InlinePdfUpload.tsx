import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paperclip, Upload, FileText, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { setPdfUploaded, setUploadStatus } from '../store/chatSlice';
import { useUploadPdfMutation } from '../store/chatApi';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

interface InlinePdfUploadProps {
  className?: string;
}

export const InlinePdfUpload: React.FC<InlinePdfUploadProps> = ({ className = '' }) => {
  const { currentSession, uploadStatus } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const [uploadPdf, { isLoading }] = useUploadPdfMutation();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !currentSession) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    dispatch(setUploadStatus('uploading'));

    try {
      const response = await uploadPdf({
        chatId: currentSession.id,
        file: file,
      }).unwrap();

      if (response.success) {
        dispatch(setPdfUploaded({ fileName: file.name }));
        dispatch(setUploadStatus('success'));
        toast({
          title: "PDF uploaded successfully",
          description: `${file.name} is ready for chat`,
        });
      }
    } catch (error) {
      dispatch(setUploadStatus('error'));
      toast({
        title: "Upload failed",
        description: "There was an error uploading your PDF. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentSession, dispatch, toast, uploadPdf]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isLoading || uploadStatus === 'uploading'
  });

  const handleRemovePdf = () => {
    if (currentSession) {
      dispatch(setPdfUploaded({ fileName: '' }));
      dispatch(setUploadStatus('idle'));
    }
  };

  if (currentSession?.pdfUploaded) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg ${className}`}>
        <FileText className="w-4 h-4 text-green-400" />
        <span className="text-sm text-green-400 font-medium truncate max-w-32">
          {currentSession.pdfName}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemovePdf}
          className="p-1 h-auto w-auto hover:bg-destructive/20 hover:text-destructive ml-auto"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer transition-all duration-200 ${className}`}
    >
      <input {...getInputProps()} />
      <Button
        variant="ghost"
        size="sm"
        disabled={isLoading || uploadStatus === 'uploading'}
        className={`p-2 h-auto border-2 border-dashed transition-all duration-200 ${
          isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-border/30 hover:border-primary/50 hover:bg-primary/5'
        }`}
      >
        {isLoading || uploadStatus === 'uploading' ? (
          <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        ) : isDragActive ? (
          <Upload className="w-4 h-4 text-primary" />
        ) : (
          <Paperclip className="w-4 h-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};