# AnywhereGlobe

An interactive 3D spherical gallery of world landmarks and destinations built with React, Three.js, React Three Fiber, and Tailwind CSS.

## Features

- **3D Interactive Globe**: Smooth orbit controls, momentum dragging, and card hover interactions on a dynamic spherical layout.
- **Curated Global Landmarks**: 48 iconic destinations featuring high-resolution photography and historical editorial context.
- **Traveler Visualization**: Upload a photo to see yourself visualized across destinations with custom avatar traveler badges.
- **Destination Dossiers**: In-depth historical summaries, cultural context, and landmark background for each location.
- **Production Ready**: Fully responsive layout with high-performance Canvas textures and WebGL rendering.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations**: `motion`
- **Backend**: Express (Node.js) proxying API requests and serving static assets
- **AI Integration**: `@google/genai` (Google Gen AI SDK)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd anywhere-globe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and add your Gemini API key (optional for core browsing):
   ```bash
   cp .env.example .env
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```
