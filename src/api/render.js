
// This file will be the API endpoint handler for frontend requests

import { createServer } from 'node:http';
import serverApp from '../server/index.js';

// Create a server with the Express app
const server = createServer(serverApp);

export default function handler(req, res) {
  // Pass the request to the Express app
  server(req, res);
}
</lov-add-dependency>node-fetch@2.6.6</lov-add-dependency>
<lov-add-dependency>cors@2.8.5</lov-add-dependency>
<lov-add-dependency>express@4.18.2</lov-add-dependency>
<lov-add-dependency>@remotion/bundler@4.0.139</lov-add-dependency>
<lov-add-dependency>@remotion/renderer@4.0.139</lov-add-dependency>
<lov-add-dependency>@remotion/media-utils@4.0.139</lov-add-dependency>
<lov-add-dependency>remotion@4.0.139</lov-add-dependency>

Now let's set up a server file to run both our frontend and backend:

<lov-write file_path="server.js">
const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./src/server/index');

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Mount API routes
app.use('/', apiRoutes);

// Serve static files from the build directory in production
app.use(express.static(path.join(__dirname, 'dist')));

// Handle any requests that don't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
