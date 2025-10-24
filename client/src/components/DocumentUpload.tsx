import { useState, useRef } from "react";
import { Upload, Camera, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DocumentUploadProps {
  label: string;
  onUpload: (file: File) => void;
  preview?: string;
  onRemove?: () => void;
}

export default function DocumentUpload({ label, onUpload, preview, onRemove }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      
      {preview ? (
        <Card className="relative p-4">
          <div className="relative aspect-[3/2] rounded-md overflow-hidden bg-muted">
            <img 
              src={preview} 
              alt={label}
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onRemove}
            data-testid="button-remove-document"
          >
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </Card>
      ) : (
        <Card
          className={`p-6 border-2 border-dashed transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <FileImage className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Upload {label}
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or PDF (Max 5MB)
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-choose-file"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose from Gallery
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => cameraInputRef.current?.click()}
                data-testid="button-take-photo"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </Card>
      )}
    </div>
  );
}
