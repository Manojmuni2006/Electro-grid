import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { VoiceSelector } from "@/components/ui/voice-selector";
import { AudioPlayer } from "@/components/ui/audio-player";
import { TextInput } from "@/components/ui/text-input";
import { Mic, AudioWaveform, Sparkles, Key } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("9BWtsMINqrJLrRacOk9x");
  const [audioUrl, setAudioUrl] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const generateAudiobook = async () => {
    if (!text.trim()) {
      toast.error("Please add some text first!");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("Please enter your ElevenLabs API key!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + selectedVoice, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      toast.success("Audiobook generated successfully!");
    } catch (error) {
      console.error("Error generating audiobook:", error);
      toast.error("Failed to generate audiobook. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-audio-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-audio-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-3 rounded-full bg-gradient-primary">
                <AudioWaveform className="w-8 h-8" />
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Powered
              </Badge>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Echo Verse
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform any text into professional audiobooks with AI-powered voices
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Natural AI Voices
              </div>
              <div className="flex items-center gap-2">
                <AudioWaveform className="w-4 h-4" />
                Studio Quality
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Instant Generation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 space-y-12">
        {/* API Key Input */}
        {showApiKeyInput && (
          <Card className="p-6 bg-gradient-secondary border-2 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/20">
                <Key className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">ElevenLabs API Key Required</h3>
                  <p className="text-muted-foreground">
                    To generate audiobooks, you'll need an ElevenLabs API key. 
                    Get yours at{" "}
                    <a 
                      href="https://elevenlabs.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      elevenlabs.io
                    </a>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter your ElevenLabs API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => setShowApiKeyInput(false)}
                    disabled={!apiKey.trim()}
                    className="bg-gradient-primary"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {!showApiKeyInput && (
          <>
            {/* Text Input */}
            <TextInput text={text} onTextChange={setText} />

            {/* Voice Selection */}
            <VoiceSelector 
              selectedVoice={selectedVoice} 
              onVoiceSelect={setSelectedVoice} 
            />

            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={generateAudiobook}
                disabled={!text.trim() || isGenerating}
                size="lg"
                className="bg-gradient-primary text-lg px-8 py-6 shadow-glow hover:shadow-lg transition-all duration-300"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Audiobook
                  </>
                )}
              </Button>
            </div>

            {/* Audio Player */}
            <AudioPlayer 
              audioUrl={audioUrl} 
              isGenerating={isGenerating}
              title="Your Audiobook"
            />
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>© 2024 Echo Verse - Transform text into beautiful audiobooks</p>
      </footer>
    </div>
  );
};

export default Index;