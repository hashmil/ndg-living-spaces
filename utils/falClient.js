import { fal } from "@fal-ai/client";

const apiKey = process.env.FAL_API_KEY;

if (!apiKey) {
  throw new Error("FAL_API_KEY is not set in environment variables");
}

fal.config({
  credentials: apiKey,
});

export default fal;
