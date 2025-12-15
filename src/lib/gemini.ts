import { GoogleGenerativeAI } from "@google/generative-ai";

const MODELS_TO_TRY = [
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
];

export async function generateAvatarSVG(apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `Generate a Minecraft-style blocky avatar in SVG format. Follow this EXACT pixelated, cubic style:

REQUIRED STYLE - Use this template as reference (Minecraft blocky aesthetic):
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background (grass or sky) -->
  <rect width="400" height="400" fill="#87CEEB"/>

  <!-- Head (cubic, no rounded edges) -->
  <rect x="140" y="100" width="120" height="120" fill="#D2B48C" stroke="#000" stroke-width="2"/>
  <!-- Hair/Hat layer (blocky) -->
  <rect x="135" y="95" width="130" height="60" fill="#8B4513" stroke="#000" stroke-width="2"/>

  <!-- Eyes (pixelated, square) -->
  <rect x="160" y="145" width="20" height="20" fill="#4169E1"/>
  <rect x="220" y="145" width="20" height="20" fill="#4169E1"/>
  <!-- Pupils -->
  <rect x="165" y="150" width="10" height="10" fill="#000"/>
  <rect x="225" y="150" width="10" height="10" fill="#000"/>
  <!-- Eye highlights -->
  <rect x="172" y="152" width="4" height="4" fill="#FFF"/>
  <rect x="232" y="152" width="4" height="4" fill="#FFF"/>

  <!-- Nose (small block) -->
  <rect x="190" y="170" width="20" height="15" fill="#C19A6B" stroke="#000" stroke-width="1"/>

  <!-- Mouth (pixelated line) -->
  <rect x="170" y="195" width="60" height="5" fill="#000"/>

  <!-- Body (rectangular, blocky) -->
  <rect x="140" y="230" width="120" height="100" fill="#FF6347" stroke="#000" stroke-width="2"/>
  <!-- Shirt details (pixelated) -->
  <rect x="155" y="245" width="90" height="10" fill="#DC143C"/>

  <!-- Arms (thin rectangles) -->
  <rect x="100" y="235" width="35" height="90" fill="#D2B48C" stroke="#000" stroke-width="2"/>
  <rect x="265" y="235" width="35" height="90" fill="#D2B48C" stroke="#000" stroke-width="2"/>

  <!-- Legs (blocky) -->
  <rect x="160" y="335" width="30" height="65" fill="#0000CD" stroke="#000" stroke-width="2"/>
  <rect x="210" y="335" width="30" height="65" fill="#0000CD" stroke="#000" stroke-width="2"/>

  <!-- Shoes (dark blocks) -->
  <rect x="160" y="385" width="30" height="15" fill="#333" stroke="#000" stroke-width="2"/>
  <rect x="210" y="385" width="30" height="15" fill="#333" stroke="#000" stroke-width="2"/>
</svg>

VARIATIONS - Randomize these (keep blocky/pixelated style):
1. SKIN COLOR (use ONE - blocky, no gradients):
   #D2B48C (tan), #F5DEB3 (wheat), #FFDAB9 (peach), #E3BC9A (beige),
   #8B7355 (brown), #654321 (dark brown), #2E1A0F (very dark)

2. HAIR/HAT COLOR (use ONE):
   #000000 (black), #2C1608 (very dark brown), #8B4513 (saddle brown), #CD853F (peru),
   #DAA520 (goldenrod), #F4A460 (sandy brown), #FF8C00 (dark orange), #B22222 (brick red),
   #708090 (slate gray), #4169E1 (royal blue - for dyed hair)

3. HAIR/HAT STYLE (choose ONE, always blocky):
   - Short blocky hair: <rect x="135" y="95" width="130" height="60" fill="HAIRCOLOR" stroke="#000" stroke-width="2"/>
   - Blocky hat: <rect x="130" y="85" width="140" height="70" fill="HAIRCOLOR" stroke="#000" stroke-width="2"/>
                 <rect x="125" y="140" width="150" height="15" fill="HAIRCOLOR" stroke="#000" stroke-width="2"/>
   - Pixelated helmet: <rect x="130" y="90" width="140" height="130" fill="HAIRCOLOR" opacity="0.3" stroke="#000" stroke-width="3"/>
   - Headband: <rect x="135" y="120" width="130" height="20" fill="HAIRCOLOR" stroke="#000" stroke-width="2"/>
   - No hair/Bald: (nothing extra)

4. CLOTHES COLOR (use ONE - bright, saturated like Minecraft):
   #FF6347 (tomato red), #32CD32 (lime green), #1E90FF (dodger blue), #FFD700 (gold),
   #FF1493 (deep pink), #00CED1 (dark turquoise), #9370DB (medium purple), #FF4500 (orange red)

5. EYE COLOR (use ONE - always blocky squares):
   #0000FF (blue), #00FF00 (green), #8B4513 (brown), #808080 (gray), #FF00FF (magenta - ender eyes)

6. ACCESSORIES (30% chance add ONE):
   - Pixelated glasses: <rect x="145" y="140" width="45" height="30" fill="none" stroke="#000" stroke-width="4"/>
                        <rect x="210" y="140" width="45" height="30" fill="none" stroke="#000" stroke-width="4"/>
                        <rect x="190" y="152" width="20" height="4" fill="#000"/>
   - Headphones: <rect x="120" y="130" width="15" height="40" fill="#333" stroke="#000" stroke-width="2"/>
                 <rect x="265" y="130" width="15" height="40" fill="#333" stroke="#000" stroke-width="2"/>

7. FACIAL HAIR (20% chance add blocky beard):
   <rect x="160" y="200" width="80" height="25" fill="HAIRCOLOR" stroke="#000" stroke-width="1"/>
   <rect x="165" y="220" width="70" height="15" fill="HAIRCOLOR" stroke="#000" stroke-width="1"/>

8. MOUTH EXPRESSION (choose ONE, always pixelated):
   - Smile: <rect x="170" y="195" width="10" height="5" fill="#000"/>
            <rect x="180" y="192" width="40" height="5" fill="#000"/>
            <rect x="220" y="195" width="10" height="5" fill="#000"/>
   - Neutral: <rect x="170" y="195" width="60" height="5" fill="#000"/>
   - Surprised: <rect x="185" y="190" width="30" height="20" fill="#000"/>

IMPORTANT:
- NO rounded corners (rx="0" always or omit rx entirely)
- NO circles or ellipses - only rectangles
- Use stark, bold colors typical of Minecraft
- All edges must be sharp and blocky
- Keep pixelated aesthetic throughout
- Return ONLY the complete SVG code, nothing else`;

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
