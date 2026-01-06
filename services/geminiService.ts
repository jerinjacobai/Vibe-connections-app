import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const generateProfiles = async (count: number = 5, userVibes: string[] = []): Promise<UserProfile[]> => {
  try {
    const userVibeContext = userVibes.length > 0 
        ? `The user is specifically looking for: ${userVibes.join(', ')}. Ensure some profiles match these.` 
        : "";

    const prompt = `Generate ${count} dating profiles for a "Friends with Benefits" / Casual dating app called "Vibe". 
    Target audience: 19-30 years old.
    ${userVibeContext}
    
    Fields required:
    - mood: One word describing current energy (e.g. "Chill", "Wild", "Bored", "Spontaneous").
    - lookingFor: Short phrase (e.g. "Fun tonight", "Regular FWB", "Late night drives").
    - bio: Short, direct, witty, maybe slightly flirty but SFW. Max 100 chars.
    - interests: 3-4 distinct general tags (e.g., "Rooftop Bars", "Techno", "Tattoos", "Gym").
    - vibes: 2-3 specific "Buddy" types. Mix of: "Smoke Buddy", "Pluck Buddy", "Tennis Buddy", "Football Buddy", "FIFA Buddy", "CSGO Buddy", "Gym Buddy", "Club Buddy", "Travel Buddy", "Cuddle Buddy".
    - jobTitle: Use this field for a "Vibe Status" (e.g., "Partner in crime", "Bad influence").
    - distance: 1-15 miles.

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
      imageUrl: `https://picsum.photos/seed/${profile.id}vibe/600/900`,
      // Generate random initial rating between 4.5 and 9.8
      rating: Number((Math.random() * (9.8 - 4.5) + 4.5).toFixed(1)),
      ratingCount: Math.floor(Math.random() * 50) + 1
    }));

  } catch (error) {
    console.error("Failed to generate profiles", error);
    return [
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
      }
    ];
  }
};

export const generateIcebreaker = async (profile: UserProfile): Promise<string> => {
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