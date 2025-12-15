import { GoogleGenerativeAI } from "@google/generative-ai";

const MODELS_TO_TRY = [
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
];

export async function generateAvatarSVG(apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `Act as a Creative Front-End Developer.

Task: Generate the raw XML code for a valid SVG file representing a "Minimalist Geometric Cat Avatar".

IMPORTANT: you're NOT allowed to use "http://www.w3.org/2000/svg" or any xmlns link in the SVG tag.

Design Constraints (Strictly follow these):
1. Format: Output ONLY valid SVG XML code. No markdown, no explanations, no code blocks.
2. Canvas: viewBox="0 0 512 512"
3. Style: Neo-Memphis / Abstract Flat Design. Ultra-simplistic.
4. Shapes: Use ONLY basic primitives: <circle>, <rect>, <ellipse>, <polygon>. Do NOT use complex <path> data.

5. Composition Structure:
   - Background: A solid <rect> covering the whole canvas (512x512) with a random soft pastel color
   - Head: A large <circle> centered in the middle (cx="256" cy="256" r="140-160")
   - Ears: Two simple shapes on top of the head - RANDOMIZE between:
     * Triangular ears: <polygon points="..." /> (pointing up)
     * Rectangular ears: <rect /> (standing up)
   - Eyes: Two elements positioned on the face - RANDOMIZE shape between:
     * Circles: <circle />
     * Triangles: <polygon />
     * Horizontal rectangles: <rect />
   - Nose: A tiny shape centered below eyes - use <polygon> (inverted triangle) or <circle>
   - Mustaches: Simple <rect> elements on EACH side of the face
     * RANDOMIZE quantity: 2 to 4 mustaches per side (so 4 to 8 total)
     * Place them horizontally extending from the face sides

6. CRITICAL Randomization Rules - YOU MUST vary these for EVERY request:
   - Fur color (head + ears): Pick ONE random hex color from soft pastels or natural fur tones
     Examples: #FFB347, #FFDAB9, #E8C5B5, #D2B48C, #C0C0C0, #696969, #2F4F4F, etc.
   - Mustache color: Pick ONE random hex color (can be darker or contrasting)
     Examples: #000000, #333333, #8B4513, #A0522D, #CD853F, etc.
   - Background color: Pick ONE random soft pastel hex color
     Examples: #FFE4E1, #F0E68C, #E0BBE4, #B0E0E6, #DDA0DD, #FFDEAD, etc.
   - Eye color: Pick ONE random hex color
     Examples: #4169E1, #32CD32, #FFD700, #FF6347, #8A2BE2, etc.
   - Ear shape: Randomly choose triangle OR rectangle
   - Eye shape: Randomly choose circle, triangle, OR horizontal rectangle
   - Mustache count per side: Randomly choose 2, 3, or 4

7. Positioning Guidelines:
   - Ears: Top of head circle, symmetrically placed
   - Eyes: Upper-middle area of the face, horizontally aligned
   - Nose: Center, below eyes
   - Mustaches: Extend horizontally from left and right sides of the face circle

IMPORTANT OUTPUT RULES:
- Return ONLY the raw SVG code
- Start with: <svg viewBox="0 0 512 512">
- DO NOT include: xmlns="http://www.w3.org/2000/svg" or any namespace declarations
- End with: </svg>
- NO markdown formatting, NO code fences, NO explanations
- The output must be directly usable XML

Example structure (DO NOT copy colors/values, RANDOMIZE everything):
<svg viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#RandomBgColor"/>
  <circle cx="256" cy="256" r="150" fill="#RandomFurColor"/>
  <!-- Random ear shapes here -->
  <!-- Random eye shapes here -->
  <!-- Nose here -->
  <!-- 2-4 mustaches on left side -->
  <!-- 2-4 mustaches on right side -->
</svg>`;

  let lastError: Error | null = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);

      if (!svgMatch) {
        throw new Error("Failed to extract valid SVG from response");
      }

      return svgMatch[0];
    } catch (error) {
      lastError = error as Error;
      console.log(`Model ${modelName} failed, trying next...`);
      continue;
    }
  }

  throw new Error(
    `All models failed. Last error: ${lastError?.message || "Unknown error"}`
  );
}
