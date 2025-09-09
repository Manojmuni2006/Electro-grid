import { useState } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Badge } from "./badge";
import { Upload, FileText, Trash2 } from "lucide-react";

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
}

export const TextInput = ({ text, onTextChange }: TextInputProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onTextChange(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onTextChange(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const estimatedTime = Math.ceil(wordCount / 200); // ~200 words per minute for TTS

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Your Content</h3>
          <Badge variant="outline">{wordCount} words</Badge>
          {estimatedTime > 0 && (
            <Badge variant="secondary">~{estimatedTime} min audio</Badge>
          )}
        </div>
        {text && (
          <Button
            onClick={() => onTextChange("")}
            variant="outline"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <Card
        className={`p-6 transition-all duration-300 ${
          isDragging 
            ? "border-primary bg-gradient-accent" 
            : "bg-gradient-secondary hover:bg-card"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {!text ? (
          <div className="text-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-gradient-primary">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-medium mb-2">Add Your Text</h4>
                <p className="text-muted-foreground mb-4">
                  Paste your text below or drag & drop a .txt file
                </p>
                <div className="flex gap-2 justify-center">
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <Textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter your text here or upload a file..."
          className="min-h-[300px] bg-transparent border-0 text-lg leading-relaxed resize-none focus:ring-0"
        />
      </Card>
    </div>
  );
};