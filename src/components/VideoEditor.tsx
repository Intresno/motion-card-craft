
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import SceneCard from "./SceneCard";
import { useToast } from "@/components/ui/use-toast";

interface Scene {
  title: string;
  imageUrl: string;
  audioUrl: string;
  duration?: number;
}

const VideoEditor = () => {
  const { toast } = useToast();
  const [scenes, setScenes] = useState<Scene[]>([
    {
      title: "My First Scene",
      imageUrl: "",
      audioUrl: "",
      duration: 5,
    },
  ]);
  const [renderLoading, setRenderLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const addScene = () => {
    setScenes([
      ...scenes,
      {
        title: `Scene ${scenes.length + 1}`,
        imageUrl: "",
        audioUrl: "",
        duration: 5,
      },
    ]);
  };

  const updateScene = (index: number, updatedScene: Scene) => {
    const newScenes = [...scenes];
    newScenes[index] = updatedScene;
    setScenes(newScenes);
  };

  const removeScene = (index: number) => {
    if (scenes.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one scene in your video",
        variant: "destructive",
      });
      return;
    }
    const newScenes = [...scenes];
    newScenes.splice(index, 1);
    setScenes(newScenes);
  };

  const exportJson = () => {
    return JSON.stringify(
      {
        template_id: "shorts_template_1",
        modifications: scenes,
      },
      null,
      2
    );
  };

  const renderVideo = async () => {
    try {
      setRenderLoading(true);
      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: "shorts_template_1",
          modifications: scenes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to render video");
      }

      const data = await response.json();
      setVideoUrl(data.video_url);
      
      toast({
        title: "Video rendered successfully",
        description: "Your video is now ready for download",
      });
    } catch (error) {
      toast({
        title: "Error rendering video",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setRenderLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Video Scene Generator</CardTitle>
          <CardDescription>
            Create and manage scenes for your video, then render them together
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Scenes</h2>
              <Button onClick={addScene} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Scene
              </Button>
            </div>

            {scenes.map((scene, index) => (
              <SceneCard
                key={index}
                index={index}
                scene={scene}
                onUpdate={updateScene}
                onRemove={removeScene}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="sticky top-6">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Export & Render</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="json">
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="json" className="flex-1">JSON Data</TabsTrigger>
                    <TabsTrigger value="render" className="flex-1">Render Video</TabsTrigger>
                  </TabsList>
                  <TabsContent value="json" className="space-y-4">
                    <Textarea
                      className="h-[300px] font-mono text-xs"
                      value={exportJson()}
                      readOnly
                    />
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(exportJson());
                        toast({ title: "Copied to clipboard" });
                      }}
                      className="w-full"
                    >
                      Copy JSON
                    </Button>
                  </TabsContent>
                  <TabsContent value="render" className="space-y-4">
                    <div className="text-center">
                      <p className="mb-4 text-muted-foreground">
                        Generate your video with all the scenes compiled together
                      </p>
                      <Button 
                        onClick={renderVideo} 
                        className="w-full"
                        disabled={renderLoading}
                      >
                        {renderLoading ? "Rendering..." : "Render Video"}
                      </Button>
                    </div>
                    {videoUrl && (
                      <div className="mt-4 p-4 bg-muted rounded-md">
                        <p className="mb-2 font-medium">Your video is ready!</p>
                        <a 
                          href={videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm block truncate"
                        >
                          {videoUrl}
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => window.open(videoUrl, "_blank")}
                        >
                          Download Video
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
