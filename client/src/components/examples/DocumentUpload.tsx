import { useState } from 'react';
import DocumentUpload from '../DocumentUpload';

export default function DocumentUploadExample() {
  const [frontPreview, setFrontPreview] = useState<string>();
  const [backPreview, setBackPreview] = useState<string>();

  const handleUpload = (file: File, setPreview: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <DocumentUpload
        label="ID Front"
        onUpload={(file) => handleUpload(file, setFrontPreview)}
        preview={frontPreview}
        onRemove={() => setFrontPreview(undefined)}
      />
      <DocumentUpload
        label="ID Back"
        onUpload={(file) => handleUpload(file, setBackPreview)}
        preview={backPreview}
        onRemove={() => setBackPreview(undefined)}
      />
    </div>
  );
}
