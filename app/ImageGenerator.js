"use client";

import { useState } from "react";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const styles = ["Bohemian", "Modern", "Minimalist"];
const areas = ["living room", "bedroom", "kitchen"];
const lighting = ["sunlight streaming in", "soft lighting", "bright lighting"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ImageGenerator() {
  const [styleIndex, setStyleIndex] = useState(0);
  const [areaIndex, setAreaIndex] = useState(0);
  const [lightingIndex, setLightingIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  const cycleStyle = () => setStyleIndex((styleIndex + 1) % styles.length);
  const cycleArea = () => setAreaIndex((areaIndex + 1) % areas.length);
  const cycleLighting = () =>
    setLightingIndex((lightingIndex + 1) % lighting.length);

  const handleGenerate = async () => {
    const prompt = `a movie still of a ${styles[styleIndex]} style ${areas[areaIndex]} with ${lighting[lightingIndex]}, a small TOK coffee machine on a table, 8k, high quality`;

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to create prediction");
      }

      let prediction = await response.json();
      console.log("Prediction response:", prediction);

      if (!prediction.id) {
        throw new Error("Prediction ID is missing");
      }

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const statusResponse = await fetch(`/api/predictions/${prediction.id}`);

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text();
          console.error("Error fetching prediction status:", errorText);
          throw new Error("Failed to fetch prediction status");
        }

        prediction = await statusResponse.json();
        console.log("Updated prediction:", prediction);
      }

      if (prediction.output && prediction.output.length > 0) {
        setImageUrl(prediction.output[0]);
      } else {
        console.error("No output in prediction response");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 h-96 bg-gray-300 mb-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={cycleStyle}
          className="px-2 py-1 border rounded text-black">
          {styles[styleIndex]}
        </button>
        <span className="text-black">style</span>
        <button
          onClick={cycleArea}
          className="px-2 py-1 border rounded text-black">
          {areas[areaIndex]}
        </button>
        <span className="text-black">with</span>
        <button
          onClick={cycleLighting}
          className="px-2 py-1 border rounded text-black">
          {lighting[lightingIndex]}
        </button>
      </div>
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-500 text-white rounded">
        Generate
      </button>
    </div>
  );
}
