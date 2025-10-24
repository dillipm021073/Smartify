import SignatureCanvas from '../SignatureCanvas';

export default function SignatureCanvasExample() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <SignatureCanvas
        onSave={(signature) => {
          console.log('Signature saved:', signature.substring(0, 50) + '...');
        }}
      />
    </div>
  );
}
