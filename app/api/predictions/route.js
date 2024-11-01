import { NextResponse } from "next/server";
import fal from "@/utils/falClient";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const input = {
      prompt,
      image_size: "portrait_16_9",
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
      output_format: "jpeg",
      loras: [
        {
          path: "https://storage.googleapis.com/fal-flux-lora/f331225cc5394850a281837fd4be45de_pytorch_lora_weights.safetensors",
          scale: 1,
        },
      ],
      // lora_weights: {
      //   path: "https://storage.googleapis.com/fal-flux-lora/f331225cc5394850a281837fd4be45de_pytorch_lora_weights.safetensors",
      //   scale: 1,
      // },
    };

    console.log("Input configuration:", JSON.stringify(input, null, 2));
    console.log(
      "LoRA configuration:",
      JSON.stringify(input.lora_weights, null, 2)
    );

    const result = await fal.subscribe("fal-ai/flux-lora", {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Generation progress:");
          update.logs
            .map((log) => log.message)
            .forEach((msg) => {
              console.log(`- ${msg}`);
              // Look for any LoRA-related messages
              if (msg.toLowerCase().includes("lora")) {
                console.log("LoRA-related message found:", msg);
              }
            });
        }
      },
    });

    console.log("Full FAL AI Response:", JSON.stringify(result.data, null, 2));
    console.log("Request ID:", result.requestId);

    if (!result?.data?.images?.[0]?.url) {
      console.error("Invalid response structure from FAL AI:", result);
      return NextResponse.json(
        { error: "Failed to generate image - invalid response structure" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "succeeded",
      output: [result.data.images[0].url],
    });
  } catch (error) {
    console.error("Error in FAL AI generation:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      response: error.response?.data,
    });

    if (error.response?.data) {
      return NextResponse.json(
        { error: error.response.data.message || "FAL AI service error" },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
