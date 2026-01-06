import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

// Lazy initialization to prevent crash on module load if key is missing
let aiClient: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key is missing. The app will use fallback data.");
      // We don't throw here to allow the app to load, but subsequent calls will fail or use mock data
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

const MODEL_NAME = "gemini-3-flash-preview";

export const generateProfiles = async (count: number = 5, userVibes: string[] = [], genderInterest: string = 'All'): Promise<UserProfile[]> => {
  const ai = getAI();
  
  if (!ai) {
    // Return fallback data immediately if no API key
    return getFallbackProfiles();
  }

  try {
    const userVibeContext = userVibes.length > 0 
        ? `The user is specifically looking for: ${userVibes.join(', ')}. Ensure some profiles match these.` 
        : "";
        
    const genderContext = genderInterest !== 'All' 
        ? `The user is interested in ${genderInterest} profiles. Generate mostly ${genderInterest} names and personas.`
        : "The user is interested in all genders. Generate a mix of Male and Female profiles.";

    const prompt = `Generate ${count} dating profiles for a "Friends with Benefits" / Casual dating app called "Vibe". 
    Target audience: 19-30 years old.
    ${genderContext}
    ${userVibeContext}
    
    Fields required:
    - mood: One word describing current energy (e.g. "Chill", "Wild", "Bored", "Spontaneous").
    - lookingFor: Short phrase (e.g. "Fun tonight", "Regular FWB", "Late night drives").
    - bio: Short, direct, witty, maybe slightly flirty but SFW. Max 100 chars.
    - interests: 3-4 distinct general tags (e.g., "Rooftop Bars", "Techno", "Tattoos", "Gym").
    - vibes: 2-3 specific "Buddy" types. Mix of: "Smoke Buddy", "Pluck Buddy", "Tennis Buddy", "Football Buddy", "FIFA Buddy", "CSGO Buddy", "Gym Buddy", "Club Buddy", "Travel Buddy", "Cuddle Buddy".
    - jobTitle: Use this field for a "Vibe Status" (e.g., "Partner in crime", "Bad influence").
    - distance: 1-15 miles.
    
    IMPORTANT: Provide valid JSON only.

    Return JSON array.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              age: { type: Type.INTEGER },
              bio: { type: Type.STRING },
              jobTitle: { type: Type.STRING },
              interests: { type: Type.ARRAY, items: { type: Type.STRING } },
              vibes: { type: Type.ARRAY, items: { type: Type.STRING } },
              distance: { type: Type.INTEGER },
              mood: { type: Type.STRING },
              lookingFor: { type: Type.STRING },
            },
            required: ["id", "name", "age", "bio", "jobTitle", "interests", "vibes", "distance", "mood", "lookingFor"],
          },
        },
      },
    });

    const data = JSON.parse(response.text || "[]");
    
    return data.map((profile: any, index: number) => ({
      ...profile,
      // Using a different seed structure to try and get more "candids" or "portraits"
      // We append genderInterest if specific to guide standard photo seed logic slightly if using real AI gen later, 
      // but for Picsum, the seed is just a string. 
      imageUrl: `https://picsum.photos/seed/${profile.id}${genderInterest === 'All' ? '' : genderInterest}vibe/600/900`,
      // Generate random initial rating between 4.5 and 9.8
      rating: Number((Math.random() * (9.8 - 4.5) + 4.5).toFixed(1)),
      ratingCount: Math.floor(Math.random() * 50) + 1
    }));

  } catch (error) {
    console.error("Failed to generate profiles", error);
    return getFallbackProfiles();
  }
};

export const generateIcebreaker = async (profile: UserProfile): Promise<string> => {
    const ai = getAI();
    if (!ai) return "Hey, love your vibe.";

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Write a confident, smooth, and short text message opener for someone with this bio: "${profile.bio}" and looking for "${profile.lookingFor}". It should be cool, not desperate.`,
        });
        return response.text || "Vibe check? 👀";
    } catch (e) {
        return "Hey, love your vibe.";
    }
}

const getFallbackProfiles = (): UserProfile[] => [
  {
    id: "fallback-1",
    name: "Sasha",
    age: 23,
    bio: "Here for a good time, not a long time. 🌙",
    jobTitle: "Night Owl",
    interests: ["Clubbing", "Afters", "Spicy Food"],
    vibes: ["Smoke Buddy", "Club Buddy"],
    imageUrl: "https://picsum.photos/seed/sasha/600/900",
    distance: 2,
    mood: "Wild",
    lookingFor: "Fun tonight",
    rating: 8.9,
    ratingCount: 12
  },
  {
    id: "fallback-2",
    name: "Jay",
    age: 26,
    bio: "Gym rat by day, gamer by night. Need player 2.",
    jobTitle: "Chill Vibes Only",
    interests: ["Gym", "Gaming", "Drive"],
    vibes: ["FIFA Buddy", "Gym Buddy"],
    imageUrl: "https://picsum.photos/seed/jay/600/900",
    distance: 5,
    mood: "Chill",
    lookingFor: "Gaming buddy +",
    rating: 7.5,
    ratingCount: 8
  },
  {
    id: "fallback-3",
    name: "Riley",
    age: 24,
    bio: "Spontaneous adventures? I'm in.",
    jobTitle: "Explorer",
    interests: ["Hiking", "Photography", "Coffee"],
    vibes: ["Hiking Buddy", "Travel Buddy"],
    imageUrl: "https://picsum.photos/seed/riley/600/900",
    distance: 8,
    mood: "Spontaneous",
    lookingFor: "Adventure",
    rating: 9.2,
    ratingCount: 5
  }
];