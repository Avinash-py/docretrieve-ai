"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Upload, FileText, X } from "lucide-react";
import { Home, Upload, Search, FileText, X } from "lucide-react";
import { useState } from "react";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
  if (files.length === 0) return;
  
  setUploading(true);

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

    try {
    const response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    
    if (response.ok) {
      const fileCount = result.files ? result.files.length : 0;
      const fileNames = result.files ? result.files.map((f: any) => f.filename).join(", ") : "";
      
      alert(`✅ Success!\n\nUploaded ${fileCount} documents successfully!\n\nFiles: ${fileNames}`);
      setFiles([]); 
    } else {
      alert("❌ Upload failed: " + (result.detail || "Unknown error"));
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("❌ Could not connect to backend. Make sure backend is running on http://localhost:8000");
  } finally {
    setUploading(false);
  }
  };
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <div className="w-72 bg-white border-r h-screen p-6 flex flex-col">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-blue-600">DocRetrieve AI</h1>
          <p className="text-xs text-gray-500 mt-1">Enterprise Knowledge Engine</p>
        </div>

        <nav className="flex-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
            <Home size={20} /> Dashboard
          </Button>
          
          <Button variant="default" className="w-full justify-start gap-3 h-12 text-left">
            <Upload size={20} /> Upload Documents
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
            <Search size={20} /> Intelligent Search
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
            <FileText size={20} /> My Documents
          </Button>
        </nav>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-5">
          <h2 className="text-2xl font-semibold">Upload Documents</h2>
          <p className="text-gray-600">Upload PDFs, Word files, policies, contracts, etc.</p>
        </header>

        <div className="p-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Documents</CardTitle>
              <CardDescription>
                Supported formats: PDF, DOCX, TXT, Images (with OCR coming soon)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drag & Drop Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors">
                <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-xl font-medium">Drag and drop files here</p>
                <p className="text-gray-500 mt-2">or</p>
                
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button asChild className="mt-4">
                    <span>Browse Files</span>
                  </Button>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.txt,.png,.jpg"
                  />
                </Label>
              </div>

              {/* Selected Files List */}
              {files.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Selected Files ({files.length})</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="text-blue-600" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleUpload} 
                disabled={files.length === 0 || uploading}
                className="w-full py-6 text-lg"
              >
                {uploading ? "Uploading..." : `Upload ${files.length} Document(s)`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}