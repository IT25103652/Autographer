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
    const { imageUrl, objectPrompt, userId, objectMask } = body;

    if (!imageUrl || !objectPrompt) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrl, objectPrompt" },
        { status: 400 }
      );
    }

    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token not configured" },
        { status: 500 }
      );
    }

    // Call Replicate API for object replacement using Stable Diffusion Inpainting
    const replicateResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "stability-ai/stable-diffusion-inpainting:95b722d4655db29c0ac26b28696c3eb98ef70df8575a6aca6d0cec1d3e1ea2f1",
        input: {
          image: imageUrl,
          prompt: objectPrompt,
          mask: objectMask || imageUrl, // In production, you'd need a proper mask for the object area
          num_inference_steps: 30,
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
          { error: "Object replacement failed", details: result.error },
          { status: 500 }
        );
      }
    }

    if (result.status !== "succeeded") {
      return NextResponse.json(
        { error: "Object replacement did not complete", status: result.status },
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
            tool: "object-replacement",
            beforeUrl: imageUrl,
            afterUrl: outputImageUrl,
            themeName: objectPrompt,
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
    console.error("Object Replacement API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
