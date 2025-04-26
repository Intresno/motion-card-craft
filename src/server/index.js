
const express = require('express');
const { bundle } = require('@remotion/bundler');
const { getCompositions, renderMedia } = require('@remotion/renderer');
const { getAudioDurationInSeconds } = require('@remotion/media-utils');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Serve static files from the 'out' directory
app.use('/videos', express.static(path.resolve(__dirname, '../../out')));

// Ensure the output directory exists
const outputDir = path.resolve(__dirname, '../../out');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

app.post('/api/render', async (req, res) => {
  try {
    const { template_id, modifications } = req.body;

    if (!template_id || !modifications || !Array.isArray(modifications)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Calculate durations for scenes with audio
    for (const scene of modifications) {
      if (scene.audioUrl) {
        try {
          scene.duration = await getAudioDurationInSeconds(scene.audioUrl);
        } catch (error) {
          console.error('Error calculating audio duration:', error);
          // Use default duration if audio duration calculation fails
          scene.duration = scene.duration || 5;
        }
      }
    }

    // Create a unique filename for this render
    const filename = `video-${Date.now()}.mp4`;
    const outputLocation = path.resolve(outputDir, filename);

    // Bundle the remotion project
    const bundled = await bundle(path.resolve(__dirname, '../remotion/index.js'));
    
    // Get the compositions from the bundle
    const compositions = await getCompositions(bundled);
    
    // Find the specified template
    const composition = compositions.find((c) => c.id === template_id);
    
    if (!composition) {
      return res.status(404).json({ error: `Template "${template_id}" not found` });
    }

    // Calculate total duration
    const totalDuration = modifications.reduce((sum, scene) => sum + (scene.duration || 5), 0);

    // Render the video
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation,
      inputProps: {
        scenes: modifications,
      },
      durationInFrames: Math.ceil(totalDuration * 30), // 30fps
      fps: 30,
    });

    // Generate video URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const videoUrl = `${baseUrl}/videos/${filename}`;

    res.json({
      success: true,
      video_url: videoUrl,
      filename,
    });

  } catch (error) {
    console.error('Error rendering video:', error);
    res.status(500).json({
      error: 'Failed to render video',
      message: error.message,
    });
  }
});

// Start the server only when run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

module.exports = app; // Export for potential testing
