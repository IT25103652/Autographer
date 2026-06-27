import { NextRequest, NextResponse } from "next/server";
import { storage, databases } from "@/lib/appwrite";
import { ID } from "appwrite";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "ai_photo_studio";
const GENERATIONS_COLLECTION_ID = "generations";
const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "ai-images";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceImageUrl, prompt, userId, themeName } = body;

    if (!sourceImageUrl || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: sourceImageUrl, prompt" },
        { status: 400 }
      );
    }

    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token not configured" },
        { status: 500 }
      );
    }

    // Call Replicate API for text-to-image generation (using Flux or Stable Diffusion)
    const replicateResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "flux-schnell", // Fast text-to-image model
        input: {
          prompt: prompt,
          image: sourceImageUrl, // Optional: use source image as reference for img2img
          num_inference_steps: 28,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!replicateResponse.ok) {
      const errorData = await replicateResponse.json();
      return NextResponse.json(
        { error: "Replicate API error", details: errorData },
        { status: replicateResponse.status }
      );
    }

    const prediction = await replicateResponse.json();

    // Poll for result
    let result = prediction;
    while (result.status === "starting" || result.status === "processing") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        },
      });
      
      result = await pollResponse.json();
      
      if (result.status === "failed") {
        return NextResponse.json(
          { error: "Generation failed", details: result.error },
          { status: 500 }
        );
      }
    }

    if (result.status !== "succeeded") {
      return NextResponse.json(
        { error: "Generation did not complete", status: result.status },
        { status: 500 }
      );
    }

    const outputImageUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    // Save generation to Appwrite database
    if (databases && userId) {
      try {
        await databases.createDocument(
          APPWRITE_DATABASE_ID,
          GENERATIONS_COLLECTION_ID,
          ID.unique(),
          {
            userId,
            tool: "generator",
            beforeUrl: sourceImageUrl,
            afterUrl: outputImageUrl,
            themeName: themeName || "Custom",
            createdAt: new Date().toISOString(),
          }
        );
      } catch (dbError) {
        console.error("Failed to save generation to database:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      outputImageUrl,
      predictionId: prediction.id,
    });

  } catch (error) {
    console.error("Generator API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
