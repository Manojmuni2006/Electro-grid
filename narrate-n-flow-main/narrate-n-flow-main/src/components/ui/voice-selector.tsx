import { useState } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

const VOICES = [
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "Clear and professional" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", description: "Deep and authoritative" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Warm and engaging" },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura", description: "Smooth and confident" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", description: "Youthful and energetic" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", description: "Wise and distinguished" },
];

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceSelect: (voiceId: string) => void;
}

export const VoiceSelector = ({ selectedVoice, onVoiceSelect }: VoiceSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold">Choose Your Voice</h3>
        <Badge variant="secondary">AI Powered</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VOICES.map((voice) => (
          <Card
            key={voice.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-glow ${
              selectedVoice === voice.id 
                ? "ring-2 ring-primary bg-gradient-accent" 
                : "bg-card hover:bg-gradient-secondary"
            }`}
            onClick={() => onVoiceSelect(voice.id)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{voice.name}</h4>
                {selectedVoice === voice.id && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{voice.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};