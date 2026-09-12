import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { OFFICE_PROJECTS } from "./src/officeProjects";

const PORT = 3000;

// Hardcoded interesting locations across the globe
const LOCATIONS = [
  "Eiffel Tower, Paris",
  "Taj Mahal, India",
  "Statue of Liberty, New York",
  "Great Wall of China",
  "Machu Picchu, Peru",
  "Colosseum, Rome",
  "Pyramids of Giza, Egypt",
  "Sydney Opera House",
  "Mount Fuji, Japan",
  "Santorini, Greece",
  "Stonehenge, UK",
  "Petra, Jordan",
  "Burj Khalifa, Dubai",
  "Niagara Falls, Canada",
  "Mount Everest, Himalayas",
  "Golden Gate Bridge, San Francisco",
  "Acropolis of Athens",
  "Angkor Wat, Cambodia",
  "Sagrada Familia, Barcelona",
  "Venice Canals, Italy",
  "Victoria Falls, Zambia",
  "Galapagos Islands",
  "Easter Island statues",
  "Chichen Itza, Mexico",
  "Yellowstone Grand Prismatic Spring",
  "Aurora Borealis in Iceland",
  "Serengeti National Park, Tanzania",
  "Banff National Park, Canada",
  "Salar de Uyuni, Bolivia",
  "Bora Bora overwater bungalows",
  "Maldives beaches",
  "Christ the Redeemer, Brazil",
  "Table Mountain, South Africa",
  "Neuschwanstein Castle, Germany",
  "St. Basil's Cathedral, Moscow",
  "Forbidden City, Beijing",
  "Halong Bay, Vietnam",
  "Times Square, New York at night",
  "Grand Canyon, Arizona",
  "Big Ben, London",
  "Louvre Museum pyramid, Paris",
  "Blue Lagoon, Iceland",
  "Mount Kilimanjaro",
  "Cinque Terre, Italy",
  "Lake Como, Italy",
  "The Alhambra, Spain",
  "Cappadocia hot air balloons, Turkey",
  "Antelope Canyon, Arizona"
];

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Load cached location descriptions
let locationInfoCache: Record<string, string> = {};
try {
  const jsonPath = path.join(process.cwd(), "src", "locationInfo.json");
  if (fs.existsSync(jsonPath)) {
    locationInfoCache = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  }
} catch (err) {
  console.warn("Could not read locationInfo.json at startup, using dynamic fallbacks.");
}

const LANDMARK_FALLBACK_IMAGES: Record<string, string> = {
  "Eiffel Tower, Paris": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&h=800&q=80",
  "Taj Mahal, India": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&h=800&q=80",
  "Statue of Liberty, New York": "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=600&h=800&q=80",
  "Great Wall of China": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&h=800&q=80",
  "Machu Picchu, Peru": "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&h=800&q=80",
  "Colosseum, Rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&h=800&q=80",
  "Pyramids of Giza, Egypt": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&h=800&q=80",
  "Sydney Opera House": "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&w=600&h=800&q=80",
  "Mount Fuji, Japan": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&h=800&q=80",
  "Santorini, Greece": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&h=800&q=80",
  "Stonehenge, UK": "https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&w=600&h=800&q=80",
  "Petra, Jordan": "https://images.unsplash.com/photo-1579606032822-e22295fa9856?auto=format&fit=crop&w=600&h=800&q=80",
  "Burj Khalifa, Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&h=800&q=80",
  "Niagara Falls, Canada": "https://images.unsplash.com/photo-1533094602577-199e35114234?auto=format&fit=crop&w=600&h=800&q=80",
  "Mount Everest, Himalayas": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&h=800&q=80",
  "Golden Gate Bridge, San Francisco": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&h=800&q=80",
  "Acropolis of Athens": "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=600&h=800&q=80",
  "Angkor Wat, Cambodia": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=800&q=80",
  "Sagrada Familia, Barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&h=800&q=80",
  "Venice Canals, Italy": "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&h=800&q=80",
  "Victoria Falls, Zambia": "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=600&h=800&q=80",
  "Galapagos Islands": "https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&w=600&h=800&q=80",
  "Easter Island statues": "https://images.unsplash.com/photo-1510097467424-192d713fd8c2?auto=format&fit=crop&w=600&h=800&q=80",
  "Chichen Itza, Mexico": "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=600&h=800&q=80",
  "Yellowstone Grand Prismatic Spring": "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=600&h=800&q=80",
  "Aurora Borealis in Iceland": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&h=800&q=80",
  "Serengeti National Park, Tanzania": "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&h=800&q=80",
  "Banff National Park, Canada": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&h=800&q=80",
  "Salar de Uyuni, Bolivia": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&h=800&q=80",
  "Bora Bora overwater bungalows": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=800&q=80",
  "Maldives beaches": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&h=800&q=80",
  "Christ the Redeemer, Brazil": "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=600&h=800&q=80",
  "Table Mountain, South Africa": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&h=800&q=80",
  "Neuschwanstein Castle, Germany": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=600&h=800&q=80",
  "St. Basil's Cathedral, Moscow": "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=600&h=800&q=80",
  "Forbidden City, Beijing": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&h=800&q=80",
  "Halong Bay, Vietnam": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&h=800&q=80",
  "Times Square, New York at night": "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&h=800&q=80",
  "Grand Canyon, Arizona": "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=600&h=800&q=80",
  "Big Ben, London": "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=600&h=800&q=80",
  "Louvre Museum pyramid, Paris": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&h=800&q=80",
  "Blue Lagoon, Iceland": "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=600&h=800&q=80",
  "Mount Kilimanjaro": "https://images.unsplash.com/photo-1650668301026-6415a77f9859?auto=format&fit=crop&w=600&h=800&q=80",
  "Cinque Terre, Italy": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&h=800&q=80",
  "Lake Como, Italy": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&h=800&q=80",
  "The Alhambra, Spain": "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=600&h=800&q=80",
  "Cappadocia hot air balloons, Turkey": "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=600&h=800&q=80",
  "Antelope Canyon, Arizona": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=600&h=800&q=80"
};

const PHOTO_IDS = [
  10, 11, 12, 13, 14, 15, 16, 17, 28, 29, 37, 39, 43, 49, 50, 
  54, 57, 58, 59, 61, 62, 63, 64, 65, 68, 69, 71, 74, 82, 87, 
  91, 111, 112, 113, 114, 115, 119, 122, 129, 133, 134, 136, 139, 142, 146, 
  152, 153, 154, 158, 161, 163, 164, 169, 175, 177, 180, 185, 188, 191, 196
];

function getLandmarkPhoto(location: string, index: number): string {
  if (LANDMARK_FALLBACK_IMAGES[location]) {
    return LANDMARK_FALLBACK_IMAGES[location];
  }
  const pid = PHOTO_IDS[index % PHOTO_IDS.length];
  return `https://picsum.photos/id/${pid}/400/500`;
}

async function startServer() {
  const app = express();
  
  app.use(express.json({ limit: '50mb' }));

  // API endpoint for retrieving curated 48 office interior projects
  app.get("/api/office-projects", (req, res) => {
    res.json({ success: true, projects: OFFICE_PROJECTS });
  });

  // API endpoint for generating location card data
  app.post("/api/generate-location", async (req, res) => {
    try {
      const { index, userImageBase64, generateAi } = req.body;
      const location = LOCATIONS[index % LOCATIONS.length];
      
      // Default high quality landmark image
      let finalBase64 = getLandmarkPhoto(location, index);
      
      // Fast, pre-compiled editorial info from locationInfoCache
      let info = locationInfoCache[location] || "";

      // Only run Gemini image generation if explicitly requested by client (e.g. single on-demand generation)
      // and billing/quota is available. This prevents the 48-request burst quota exhaustion on globe load.
      if (generateAi && process.env.GEMINI_API_KEY) {
        try {
          let parts: any[] = [{ text: `A bright, vivid, photorealistic travel photo taken directly in front of the ${location}. Extremely detailed background. High quality, stunning. Keep the exact same subjects from the original image—preserving the exact number of people, their faces, body structures, and poses. Only change their outfits to be culturally or weather appropriate for the location, and seamlessly place them in this new environment.` }];
          
          if (userImageBase64) {
            const match = userImageBase64.match(/^data:(image\/[a-zA-Z]*);base64,([^"]*)$/);
            if (match && match.length === 3) {
              parts.unshift({
                inlineData: {
                  mimeType: match[1],
                  data: match[2],
                },
              });
            }
          }

          const imageResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: { parts },
            config: {
              imageConfig: { aspectRatio: "3:4" }
            },
          });

          let base64EncodeString = "";
          for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              base64EncodeString = part.inlineData.data;
              break;
            }
          }

          if (base64EncodeString) {
            finalBase64 = `data:image/png;base64,${base64EncodeString}`;
          }
        } catch (e: any) {
          const errMsg = e?.message || e?.toString() || '';
          const isQuota = e?.status === 429 || errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED');
          if (isQuota) {
            // Free tier account (image gen has limit: 0) or rate-limit hit. Seamless fallback to curated photo.
            console.log(`[Rate Limit Notice] Gemini image quota unavailable for ${location}. Kept landmark photograph.`);
          } else {
            console.warn(`[Image Generation Warning] ${location}:`, errMsg);
          }
        }
      }

      if (!info) {
        info = `# ${location}\n\nA magnificent world-renowned destination offering breathtaking sights and rich history.`;
      }

      res.json({ success: true, base64: finalBase64, location, info });
    } catch (e) {
      console.error("Error in /api/generate-location:", e);
      res.status(500).json({ success: false });
    }
  });

  // API endpoint for generating location description
  app.post("/api/location-info", async (req, res) => {
    try {
      const { location } = req.body;
      if (locationInfoCache[location]) {
        return res.json({ info: locationInfoCache[location] });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({ info: `# ${location}\n\nA magnificent world-renowned destination offering breathtaking sights and rich history.` });
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: `Provide information about ${location} exactly in this format:
# [Name of Location], [Name of Country] [Country Flag Emoji]
[One short, engaging paragraph about the location as a travel destination]
Do not include any other text or introductory phrases.`,
        });
        res.json({ info: response.text });
      } catch (e: any) {
        const errMsg = e?.message || e?.toString() || '';
        if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
          return res.json({ info: `# ${location}\n\nA magnificent world-renowned destination offering breathtaking sights and rich history.` });
        }
        throw e;
      }
    } catch (e) {
      console.error("Location info error:", e);
      res.status(500).json({ info: "Could not load information at this time." });
    }
  });

  // Endpoint to start omni generation
  app.post('/api/generate-video', async (req, res) => {
    try {
      const { imageBase64, prompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ success: false, error: "Missing API Key" });
      }

      const match = imageBase64.match(/^data:(image\/[a-zA-Z]*);base64,([^"]*)$/);
      if (!match || match.length !== 3) {
        return res.status(400).json({ success: false, error: "Invalid base64 image" });
      }

      console.log(`Sending request to Gemini Omni...`);

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.1-flash',
        input: [
            { type: 'image' as const, data: match[2], mime_type: match[1] },
            { type: 'text', text: prompt || 'A beautiful cinematic panning video' }
        ],
        response_format: { type: 'video', delivery: 'uri' },
        store: true,
        background: false,
        stream: false
      });

      console.log(`Interaction created: ${interaction.id}`);
      
      if (!interaction.output_video || !interaction.output_video.uri) {
        throw new Error('No video URI returned from interaction.');
      }
      
      const fileIdMatch = interaction.output_video.uri.match(/files\/([a-zA-Z0-9_-]+)/);
      const fileId = fileIdMatch ? fileIdMatch[1] : null;

      res.json({ success: true, interactionId: interaction.id, uri: interaction.output_video.uri, fileId });
    } catch (e: any) {
      console.error('Error generating video:', e);
      res.status(500).json({ success: false, error: e?.body || e.message });
    }
  });

  // Endpoint to poll file status
  app.post('/api/video-status', async (req, res) => {
    try {
      const { fileId } = req.body;
      if (!fileId) return res.status(400).json({ error: "fileId is required" });
      
      const fInfo = await ai.files.get({ name: `files/${fileId}` });
      const state = (fInfo.state as any)?.name || fInfo.state;
      // Map state to the expected 'done' boolean for the frontend
      const done = state === 'ACTIVE' || state === 'FAILED' || state === 'STATE_UNSPECIFIED' ? state === 'ACTIVE' : (state === 'SUCCEEDED' || state === 'FAILED');
      
      // Usually, if it's available for download it's ACTIVE, but we'll return the raw state too
      res.json({ done: state === 'ACTIVE' || state === 'SUCCEEDED', state });
    } catch(e: any) {
      console.error("Video polling error:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  const videoCache = new Map<string, Buffer>();

  app.get('/api/video-download', async (req, res) => {
    try {
      const fileId = req.query.fileId as string;
      if (!fileId) {
        return res.status(400).json({ error: "fileId is required" });
      }

      let buffer = videoCache.get(fileId);
      if (!buffer) {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/files/${fileId}:download?alt=media&key=${apiKey}`;
        const upstream = await fetch(url);
        if (!upstream.ok) {
          return res.status(upstream.status).send(`Failed to fetch video: ${upstream.statusText}`);
        }
        buffer = Buffer.from(await upstream.arrayBuffer());
        if (videoCache.size >= 12) {
          const oldest = videoCache.keys().next().value;
          if (oldest) videoCache.delete(oldest);
        }
        videoCache.set(fileId, buffer);
      }

      const total = buffer.length;
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      const range = req.headers.range;
      if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range);
        let start = match && match[1] ? parseInt(match[1], 10) : 0;
        let end = match && match[2] ? parseInt(match[2], 10) : total - 1;
        if (Number.isNaN(start)) start = 0;
        if (Number.isNaN(end) || end >= total) end = total - 1;
        if (start > end || start >= total) {
          res.status(416).setHeader('Content-Range', `bytes */${total}`).end();
          return;
        }
        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
        res.setHeader('Content-Length', end - start + 1);
        res.end(buffer.subarray(start, end + 1));
      } else {
        res.setHeader('Content-Length', total);
        res.end(buffer);
      }
    } catch(e: any) {
      console.error("Video download error:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
