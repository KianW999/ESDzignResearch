// A curated list of stable Picsum photo IDs to ensure consistent loading and a nice variety.
// These represent high-quality portrait/architecture/nature photography.
export const PHOTO_IDS = [
  10, 11, 12, 13, 14, 15, 16, 17, 28, 29, 37, 39, 43, 49, 50, 
  54, 57, 58, 59, 61, 62, 63, 64, 65, 68, 69, 71, 74, 82, 87, 
  91, 111, 112, 113, 114, 115, 119, 122, 129, 133, 134, 136, 139, 142, 146, 
  152, 153, 154, 158, 161, 163, 164, 169, 175, 177, 180, 185, 188, 191, 196
];

export const GLOBE_RADIUS = 6.0;
export const CARD_WIDTH = 1.8;
export const CARD_HEIGHT = 2.4;
export const TOTAL_CARDS = 48;

export const LOCATIONS = [
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

export const LANDMARK_IMAGES: Record<string, string> = {
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

export function getLandmarkImageUrl(location: string, index: number): string {
  if (LANDMARK_IMAGES[location]) {
    return LANDMARK_IMAGES[location];
  }
  const photoId = PHOTO_IDS[index % PHOTO_IDS.length];
  return `https://picsum.photos/id/${photoId}/400/500`;
}
