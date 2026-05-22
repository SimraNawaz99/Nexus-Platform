import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

type DocumentStatus = "Draft" | "In Review" | "Signed";

export default function DocumentChamberPage() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<DocumentStatus>("Draft");
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileUrl(URL.createObjectURL(file));
    setStatus("In Review");
  };

  const clearSignature = () => signatureRef.current?.clear();
  const signDocument = () => {
    if (!signatureRef.current?.isEmpty()) setStatus("Signed");
    else alert("Add signature first");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Document Chamber</h1>

      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
      <span>Status: {status}</span>

      {fileUrl && (
        <iframe
          src={fileUrl}
          title="Document Preview"
          className="w-full h-[500px] border rounded"
        />
      )}

      <div className="space-y-2">
        <h2>E-Signature</h2>
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{ width: 700, height: 180, className: "border w-full rounded" }}
        />
        <div className="flex gap-2">
          <button onClick={clearSignature} className="px-3 py-1 bg-gray-200 rounded">
            Clear
          </button>
          <button onClick={signDocument} className="px-3 py-1 bg-blue-600 text-white rounded">
            Sign
          </button>
        </div>
      </div>
    </div>
  );
}