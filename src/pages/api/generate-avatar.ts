import type { APIRoute } from "astro";
import { generateAvatarSVG } from "../../lib/gemini";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const apiKey = import.meta.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY is not configured",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const svg = await generateAvatarSVG(apiKey);
    const timestamp = Date.now();

    return new Response(
      JSON.stringify({
        svg,
        timestamp,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating avatar:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate avatar",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
