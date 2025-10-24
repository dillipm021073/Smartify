import { useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Check } from "lucide-react";

interface SignatureCanvasProps {
  onSave: (signature: string) => void;
}

export default function SignatureCanvas({ onSave }: SignatureCanvasProps) {
  const sigPad = useRef<SignaturePad>(null);

  const handleClear = () => {
    sigPad.current?.clear();
  };

  const handleSave = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const dataURL = sigPad.current.toDataURL();
      onSave(dataURL);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">Digital Signature</h3>
        <p className="text-sm text-muted-foreground">
          Please sign below using your finger or mouse
        </p>
      </div>

      <div className="border-2 border-dashed border-border rounded-md bg-background" data-testid="canvas-signature">
        <SignaturePad
          ref={sigPad}
          canvasProps={{
            className: 'w-full h-48 md:h-64 cursor-crosshair'
          }}
          backgroundColor="transparent"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex-1"
          data-testid="button-clear-signature"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1"
          data-testid="button-accept-signature"
        >
          <Check className="w-4 h-4 mr-2" />
          Accept Signature
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        By signing, you agree that this electronic signature has the same legal effect as a handwritten signature
      </p>
    </Card>
  );
}
