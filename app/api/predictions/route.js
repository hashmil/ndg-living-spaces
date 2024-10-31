import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    // Adjusted dimensions to be divisible by 8
    const options = {
      version:
        "fa1a58cbbacf7740f31b903bf8851d70e2e3efd5c1e392d948be882b075f0c2d",
      input: {
        prompt,
        width: 1024, // Already divisible by 8
        height: 1816, // Adjusted from 1820 to be divisible by 8
        refine: "no_refiner",
        scheduler: "KarrasDPM",
        lora_scale: 0.8,
        num_outputs: 1,
        guidance_scale: 7.5,
        apply_watermark: true,
        high_noise_frac: 0.89,
        negative_prompt: "text, watermark, low quality",
        prompt_strength: 0.8,
        num_inference_steps: 25,
      },
    };

    console.log("Sending options to Replicate:", options);
    const prediction = await replicate.predictions.create(options);
    console.log("Received prediction response:", prediction);

    if (!prediction?.id) {
      console.error("No prediction ID received:", prediction);
      return NextResponse.json(
        { detail: "Failed to create prediction - no ID received" },
        { status: 500 }
      );
    }

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error("Error creating prediction:", error);
    return NextResponse.json(
      { detail: error.message || "Failed to create prediction" },
      { status: 500 }
    );
  }
}
