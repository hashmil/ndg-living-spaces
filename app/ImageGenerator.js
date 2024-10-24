"use client";

import { useState } from "react";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Add more styles and lighting options here
const styles = [
  "Bohemian",
  "Modern",
  "Minimalist",
  "Industrial",
  "Scandinavian",
  "Rustic",
  "Traditional",
  "Mid-Century Modern",
  "Contemporary",
  "Art Deco",
];

const areas = ["living room", "bedroom", "kitchen"];

const lighting = [
  "sunlight streaming in",
  "soft lighting",
  "bright lighting",
  "candlelight",
  "neon lighting",
  "natural light",
  "ambient lighting",
  "task lighting",
  "accent lighting",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ImageGenerator() {
  const [styleIndex, setStyleIndex] = useState(0);
  const [areaIndex, setAreaIndex] = useState(0);
  const [lightingIndex, setLightingIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Generate");

  const cycleStyle = () => setStyleIndex((styleIndex + 1) % styles.length);
  const cycleArea = () => setAreaIndex((areaIndex + 1) % areas.length);
  const cycleLighting = () =>
    setLightingIndex((lightingIndex + 1) % lighting.length);

  const handleGenerate = async () => {
    const prompt = `a movie still of a ${styles[styleIndex]} style ${areas[areaIndex]} with ${lighting[lightingIndex]}, a small TOK coffee machine on a table, 8k, high quality`;

    setLoading(true);
    setButtonText("Brewing your image ☕ ...");

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
      console.log("Full prediction response:", prediction);

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000); // Wait for 1 second before polling again
        const statusResponse = await fetch(`/api/predictions/${prediction.id}`);
        prediction = await statusResponse.json();
        console.log("Updated prediction:", prediction);
      }

      if (prediction.output && prediction.output.length > 0) {
        setImageUrl(prediction.output[0]);
      } else {
        console.error("No output in prediction response");
        setImageUrl(null); // Optionally reset the image URL if there's no output
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
      setButtonText("Generate");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-[85vw] h-[85vw] sm:w-[70vw] sm:h-[70vw] bg-gray-300 mb-4 flex items-center justify-center">
        {loading && <div className="spinner"></div>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-center space-x-2 mb-4">
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
        {buttonText}
      </button>
    </div>
  );
}
