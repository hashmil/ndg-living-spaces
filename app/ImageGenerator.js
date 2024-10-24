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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="relative w-[85vw] h-[85vw] sm:w-[60vh] sm:h-[60vh] bg-gray-800 mb-4 flex items-center justify-center border border-gray-700">
        {loading && (
          <>
            <div className="spinner"></div>
            <div className="absolute bottom-4 text-white bg-black bg-opacity-75 px-2 py-1 rounded">
              {status}
            </div>
          </>
        )}
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
          className="px-2 py-1 border border-white rounded text-white hover:bg-gray-700">
          {styles[styleIndex]}
        </button>
        <span className="text-white">style</span>
        <button
          onClick={cycleArea}
          className="px-2 py-1 border border-white rounded text-white hover:bg-gray-700">
          {areas[areaIndex]}
        </button>
        <span className="text-white">with</span>
        <button
          onClick={cycleLighting}
          className="px-2 py-1 border border-white rounded text-white hover:bg-gray-700">
          {lighting[lightingIndex]}
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={randomizeOptions}
          className="p-2 border border-white rounded text-white hover:bg-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 800 701"
            fill="none">
            <path
              d="M-3.90577e-05 550C-3.90577e-05 563.867 4.79996 575.867 14.4 586C24 596.134 36 600.934 50.4 600.401H100C134.133 600.401 166.667 593.734 197.6 580.4C228.533 567.067 254.933 549.2 276.8 526.8C298.667 504.4 316.533 477.734 330.4 446.8C344.267 415.867 350.933 383.6 350.4 350C350.4 308.934 364.8 273.734 393.6 244.4C422.4 215.067 457.867 200.4 500 200.4H600V250C600 261.2 603.2 270.8 609.6 278.8C616 286.8 623.2 292.667 631.2 296.4C639.2 300.134 648.533 301.2 659.2 299.6C669.867 298 678.667 293.467 685.6 286L785.6 186C795.733 175.334 800.533 163.334 800 150C799.467 136.667 794.667 124.934 785.6 114.8L685.6 14.8005C677.6 7.3338 668.533 2.80047 658.4 1.20047C648.267 -0.399531 638.933 0.667136 630.4 4.40047C621.867 8.1338 614.667 14.0005 608.8 22.0005C602.933 30.0005 600 39.3338 600 50.0005V100.4H500C466.4 100.4 434.133 107.067 403.2 120.4C372.267 133.734 345.6 151.334 323.2 173.2C300.8 195.067 282.933 221.734 269.6 253.2C256.267 284.667 249.867 316.934 250.4 350C250.4 391.6 235.733 427.067 206.4 456.4C177.067 485.734 141.6 500.401 100 500.401H50.4C36.5333 500.401 24.5333 505.2 14.4 514.8C4.26663 524.4 -0.533372 536.134 -3.90577e-05 550ZM-3.90577e-05 150.8C-3.90577e-05 164.667 4.79996 176.4 14.4 186C24 195.6 36 200.4 50.4 200.4H100C123.467 200.4 145.067 205.467 164.8 215.6C184.533 225.734 201.867 239.6 216.8 257.2C228 223.067 244.533 192.4 266.4 165.2C217.867 122 162.4 100.4 100 100.4H50.4C36.5333 100.4 24.5333 105.467 14.4 115.6C4.26663 125.734 -0.533372 137.467 -3.90577e-05 150.8ZM334.4 536.4C381.867 579.067 437.067 600.401 500 600.401H600V650.8C600 661.467 603.2 671.067 609.6 679.6C616 688.134 623.2 694 631.2 697.2C639.2 700.4 648.533 701.2 659.2 699.6C669.867 698 678.667 693.467 685.6 686L785.6 586C795.733 575.867 800.533 563.867 800 550C799.467 536.134 794.667 524.667 785.6 515.6L685.6 415.6C677.6 407.6 668.533 402.8 658.4 401.2C648.267 399.6 638.933 400.667 630.4 404.4C621.867 408.134 614.667 414.267 608.8 422.801C602.933 431.334 600 440.667 600 450.8V500.401H500C477.067 500.401 455.467 495.6 435.2 486C414.933 476.4 397.867 462.534 384 444.4C372.267 478.534 355.733 509.2 334.4 536.4Z"
              fill="white"
            />
          </svg>
        </button>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300">
          {buttonText}
        </button>
      </div>
    </div>
  );
}
