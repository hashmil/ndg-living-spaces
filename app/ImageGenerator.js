"use client";

import { useState } from "react";

const styles = ["Bohemian", "Modern", "Minimalist"];
const areas = ["living room", "bedroom", "kitchen"];
const lighting = ["sunlight streaming in", "soft lighting", "bright lighting"];

export default function ImageGenerator() {
  const [styleIndex, setStyleIndex] = useState(0);
  const [areaIndex, setAreaIndex] = useState(0);
  const [lightingIndex, setLightingIndex] = useState(0);

  const cycleStyle = () => setStyleIndex((styleIndex + 1) % styles.length);
  const cycleArea = () => setAreaIndex((areaIndex + 1) % areas.length);
  const cycleLighting = () =>
    setLightingIndex((lightingIndex + 1) % lighting.length);

  const handleGenerate = () => {
    const output = `a movie still of a ${styles[styleIndex]} style ${areas[areaIndex]} with ${lighting[lightingIndex]}, a small TOK coffee machine on a table, 8k, high quality`;
    console.log(output);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 h-96 bg-gray-300 mb-4"></div>
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
