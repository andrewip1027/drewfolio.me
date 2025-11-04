const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('.'));

// API endpoint to check if server is running
app.get('/api/check', (req, res) => {
  res.json({ status: 'ok' });
});

// API endpoint to list directory contents
app.get('/api/list-directory', async (req, res) => {
  try {
    const directoryPath = req.query.path;
    
    // Security check to ensure we're only accessing images directory
    if (!directoryPath.startsWith('images/')) {
      throw new Error('Access denied');
    }

    const absolutePath = path.join(__dirname, directoryPath);
    const files = await fs.readdir(absolutePath);
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    res.json({ files: imageFiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});