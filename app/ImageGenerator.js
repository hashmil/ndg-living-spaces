"use client";

import { useState, useEffect, useCallback } from "react";
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
  const getRandomIndex = (array) => Math.floor(Math.random() * array.length);

  const [styleIndex, setStyleIndex] = useState(0);
  const [areaIndex, setAreaIndex] = useState(0);
  const [lightingIndex, setLightingIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Generate");
  const [status, setStatus] = useState("");

  const randomizeOptions = useCallback(() => {
    setStyleIndex(getRandomIndex(styles));
    setAreaIndex(getRandomIndex(areas));
    setLightingIndex(getRandomIndex(lighting));
  }, [styles, areas, lighting]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      randomizeOptions();
    }
  }, [randomizeOptions]);

  const cycleStyle = () => setStyleIndex((styleIndex + 1) % styles.length);
  const cycleArea = () => setAreaIndex((areaIndex + 1) % areas.length);
  const cycleLighting = () =>
    setLightingIndex((lightingIndex + 1) % lighting.length);

  const handleGenerate = async () => {
    const prompt = `a movie still of a ${styles[styleIndex]} style ${areas[areaIndex]} with ${lighting[lightingIndex]}, a small TOK coffee machine on a table, 8k, high quality`;

    setLoading(true);
    setButtonText("Brewing your image ☕ ...");
    setStatus("starting");

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

        setStatus(prediction.status); // Update status
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Image Container */}
        <div className="glass-panel relative w-full aspect-square max-w-2xl mx-auto overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
              <div className="spinner"></div>
              <div className="mt-4 text-white font-medium">{status}</div>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
              <svg
                className="w-24 h-24 placeholder-icon"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-lg font-medium">
                Your image will appear here
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex flex-wrap gap-3 justify-center items-center text-white/80">
            <button
              onClick={cycleStyle}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20">
              {styles[styleIndex]}
            </button>
            <span>style</span>
            <button
              onClick={cycleArea}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20">
              {areas[areaIndex]}
            </button>
            <span>with</span>
            <button
              onClick={cycleLighting}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20">
              {lighting[lightingIndex]}
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={randomizeOptions}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20">
              Randomize
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 gradient-button text-white font-medium py-3 px-6 rounded-full shadow-lg disabled:opacity-50">
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
