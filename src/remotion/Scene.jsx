
import { useEffect, useState } from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, Audio, spring, interpolate } from 'remotion';

export const Scene = ({ title, subtitle, imageUrl, audioUrl, duration = 5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Fade-in effect for the title
  const opacity = interpolate(
    frame,
    [0, 30, fps * duration - 30, fps * duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Scale and entrance animation
  const scale = spring({
    frame,
    from: 0.8,
    to: 1,
    fps,
    durationInFrames: 30,
  });

  useEffect(() => {
    // Load the audio
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.oncanplaythrough = () => {
        setAudioLoaded(true);
      };
      audio.onerror = () => {
        console.error('Failed to load audio:', audioUrl);
        setAudioLoaded(false);
      };
      audio.load();
    } else {
      setAudioLoaded(true);
    }
  }, [audioUrl]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background image */}
      {imageUrl && (
        <Img
          src={imageUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      
      {/* Overlay to enhance text legibility */}
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      />
      
      {/* Title and subtitle text */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            padding: '0 50px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '32px',
              color: 'white',
              textAlign: 'center',
              padding: '20px 50px 0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              fontFamily: 'Arial, sans-serif',
              opacity: 0.9,
            }}
          >
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
      
      {/* Audio */}
      {audioUrl && audioLoaded && <Audio src={audioUrl} />}
    </AbsoluteFill>
  );
};
