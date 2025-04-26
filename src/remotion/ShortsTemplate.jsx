
import { Sequence, useVideoConfig } from 'remotion';
import { Scene } from './Scene';

export const ShortsTemplate = ({ scenes = [] }) => {
  const { fps } = useVideoConfig();

  // Track the cumulative duration for positioning sequences
  let cumulativeDuration = 0;

  return (
    <>
      {scenes.map((scene, index) => {
        // Get the current scene's duration (or default to 5 seconds)
        const sceneDuration = scene.duration || 5;
        
        // Calculate start frame based on previous scenes
        const startFrame = cumulativeDuration * fps;
        
        // Update the cumulative duration for the next scene
        cumulativeDuration += sceneDuration;
        
        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={Math.ceil(sceneDuration * fps)}
          >
            <Scene
              title={scene.title}
              imageUrl={scene.imageUrl}
              audioUrl={scene.audioUrl}
              duration={sceneDuration}
            />
          </Sequence>
        );
      })}
    </>
  );
};
