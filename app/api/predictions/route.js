import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  const { prompt } = await request.json();

  const options = {
    version: "fa1a58cbbacf7740f31b903bf8851d70e2e3efd5c1e392d948be882b075f0c2d", // Use the specific model version
    input: {
      prompt,
      width: 1024,
      height: 1024,
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

  const prediction = await replicate.predictions.create(options);

  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }

  return NextResponse.json(prediction, { status: 201 });
}
