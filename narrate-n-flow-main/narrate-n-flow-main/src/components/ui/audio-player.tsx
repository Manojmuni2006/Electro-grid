import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Play, Pause, Download, Volume2 } from "lucide-react";
import { Slider } from "./slider";

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
  isGenerating?: boolean;
}

export const AudioPlayer = ({ audioUrl, title = "Generated Audiobook", isGenerating = false }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setProgress(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isGenerating) {
    return (
      <Card className="p-6 bg-gradient-secondary">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-wave rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 40 + 20}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <span className="text-lg font-medium">Generating your audiobook...</span>
        </div>
      </Card>
    );
  }

  if (!audioUrl) return null;

  return (
    <Card className="p-6 bg-gradient-secondary">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button onClick={downloadAudio} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime((progress / 100) * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={togglePlayPause} size="lg" className="bg-gradient-primary">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4" />
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};