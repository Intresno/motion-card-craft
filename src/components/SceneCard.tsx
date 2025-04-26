import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface SceneCardProps {
  index: number;
  scene: {
    title: string;
    subtitle?: string;
    imageUrl?: string;
    audioUrl?: string;
    duration?: number;
  };
  onUpdate: (index: number, scene: any) => void;
  onRemove: (index: number) => void;
}

const SceneCard = ({ index, scene, onUpdate, onRemove }: SceneCardProps) => {
  const [localScene, setLocalScene] = useState({ ...scene });
  const [syncWithAudio, setSyncWithAudio] = useState(false);

  useEffect(() => {
    setLocalScene({ ...scene });
  }, [scene]);

  const handleChange = (field: string, value: string | number) => {
    const updatedScene = { ...localScene, [field]: value };
    setLocalScene(updatedScene);
    onUpdate(index, updatedScene);
  };

  return (
    <Card className="mb-4 border-2 hover:border-primary/30 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Scene {index + 1}</CardTitle>
        <Button variant="outline" size="icon" onClick={() => onRemove(index)} className="h-8 w-8">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`title-${index}`}>Title</Label>
          <Input
            id={`title-${index}`}
            value={localScene.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor={`subtitle-${index}`}>Subtitle (Optional)</Label>
          <Input
            id={`subtitle-${index}`}
            value={localScene.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            className="mt-1"
            placeholder="Add a subtitle (optional)"
          />
        </div>
        <div>
          <Label htmlFor={`imageUrl-${index}`}>Image URL (Optional)</Label>
          <Input
            id={`imageUrl-${index}`}
            value={localScene.imageUrl || ""}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            className="mt-1"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <Label htmlFor={`audioUrl-${index}`}>Audio URL (Optional)</Label>
          <Input
            id={`audioUrl-${index}`}
            value={localScene.audioUrl || ""}
            onChange={(e) => handleChange("audioUrl", e.target.value)}
            className="mt-1"
            placeholder="https://example.com/audio.mp3"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Label htmlFor={`duration-${index}`}>Duration (seconds)</Label>
            <Input
              id={`duration-${index}`}
              type="number"
              value={localScene.duration || 0}
              onChange={(e) => handleChange("duration", parseFloat(e.target.value))}
              className="mt-1"
              disabled={syncWithAudio && localScene.audioUrl}
            />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id={`sync-audio-${index}`}
              checked={syncWithAudio}
              onCheckedChange={(checked) => {
                setSyncWithAudio(checked === true);
                if (checked && localScene.audioUrl) {
                  handleChange("duration", undefined);
                }
              }}
            />
            <Label htmlFor={`sync-audio-${index}`}>Sync with audio duration</Label>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {syncWithAudio
            ? "Duration will be calculated from audio length"
            : "Set custom duration in seconds"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        {localScene.imageUrl && (
          <div className="text-xs text-muted-foreground">
            Image preview available
          </div>
        )}
        {localScene.audioUrl && (
          <div className="text-xs text-muted-foreground">
            Audio source ready
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SceneCard;
