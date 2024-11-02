"use client";

import { useState, useEffect, useCallback } from "react";

const celebrities = [
  "David Bowie",
  "Grace Jones",
  "Lady Gaga",
  "Prince",
  "Madonna",
  "Elton John",
  "Audrey Hepburn",
  "Freddie Mercury",
  "Björk",
  "Andy Warhol",
];

const celebrityStyles = {
  "David Bowie":
    "Futuristic kitchen interior, metallic surfaces, zigzag patterns, cosmic lighting, geometric shapes, space-age appliances, otherworldly atmosphere",
  "Grace Jones":
    "Bold geometric kitchen interior, high contrast black and white, avant-garde architecture, dramatic lighting, angular surfaces, minimalist luxury",
  "Lady Gaga":
    "Theatrical kitchen interior, dramatic crystal chandeliers, metallic accents, bold color pops, haute couture inspired fixtures, luxurious marble",
  Prince:
    "Purple-themed kitchen interior, velvet textures, gold accents, romantic lighting, ornate details, luxurious fixtures, mysterious ambiance",
  Madonna:
    "Pop art kitchen interior, bold colors, iconic art pieces, glamorous lighting, mix of vintage and modern, provocative design elements",
  "Elton John":
    "Flamboyant kitchen interior, crystal embellishments, piano-inspired elements, extravagant lighting fixtures, bold patterns, theatrical design",
  "Audrey Hepburn":
    "Elegant Parisian kitchen interior, classic black and white theme, refined details, sophisticated lighting, timeless fixtures, romantic atmosphere",
  "Freddie Mercury":
    "Opulent kitchen interior, rich textures, theatrical lighting, grand design elements, royal colors, dramatic architectural features",
  Björk:
    "Ethereal kitchen interior, organic shapes, nature-inspired elements, Nordic design, ethereal lighting, avant-garde fixtures, surreal atmosphere",
  "Andy Warhol":
    "Pop art kitchen interior, screen print inspired patterns, bold primary colors, factory-style elements, artistic lighting, industrial chic",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ImageGenerator() {
  const [celebrityIndex, setCelebrityIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Generate Space ✨");
  const [status, setStatus] = useState("");

  const randomizeOptions = useCallback(() => {
    setCelebrityIndex(Math.floor(Math.random() * celebrities.length));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      randomizeOptions();
    }
  }, [randomizeOptions]);

  const cycleCelebrity = () =>
    setCelebrityIndex((celebrityIndex + 1) % celebrities.length);

  const handleGenerate = async () => {
    const celebrity = celebrities[celebrityIndex];
    const celebrityStyle = celebrityStyles[celebrity];
    const prompt = `a black TOK Dolce Nestle Gusto coffee machine, on a kitchen counter, ${celebrityStyle}, photorealistic, ultra-detailed, 8k`;

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

      const data = await response.json();
      console.log("Response from API:", data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!data.output?.[0]) {
        throw new Error("No image URL in response");
      }

      setImageUrl(data.output[0]);
      setStatus("succeeded");
    } catch (error) {
      console.error("Error generating image:", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setButtonText("Generate Space ✨");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Image Container - Wrapper */}
        <div className="flex justify-center">
          <div
            className="glass-panel relative overflow-hidden"
            style={{
              height: "min(calc((100vw - 2rem) * 16/9), calc(100dvh - 12rem))",
              width: "min(100%, calc((100dvh - 12rem) * 9/16))",
            }}>
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-between bg-black bg-opacity-50">
                <div className="flex-1 flex items-center justify-center w-full">
                  <div className="spinner" />
                </div>
                <div className="font-medium text-white capitalize p-6">
                  {status}
                </div>
              </div>
            ) : imageUrl ? (
              <div className="w-full h-full">
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
                <div className="w-[20%] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 37 37"
                    fill="none"
                    className="w-full h-auto placeholder-icon opacity-60">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.16655 2.46667H30.8332C31.8145 2.46667 32.7556 2.8565 33.4495 3.55038C34.1434 4.24426 34.5332 5.18537 34.5332 6.16667V30.8333C34.5332 31.8146 34.1434 32.7558 33.4495 33.4496C32.7556 34.1435 31.8145 34.5333 30.8332 34.5333H6.16655C5.18525 34.5333 4.24414 34.1435 3.55026 33.4496C2.85637 32.7558 2.46655 31.8146 2.46655 30.8333V6.16667C2.46655 5.18537 2.85637 4.24426 3.55026 3.55038C4.24414 2.8565 5.18525 2.46667 6.16655 2.46667ZM6.16655 4.93334C5.83945 4.93334 5.52575 5.06328 5.29445 5.29458C5.06316 5.52587 4.93322 5.83957 4.93322 6.16667V20.6312L9.08215 16.4823C9.18731 16.3768 9.31261 16.2936 9.4506 16.2376C9.58859 16.1815 9.73644 16.1538 9.88535 16.1561C10.0343 16.1584 10.1812 16.1907 10.3174 16.251C10.4536 16.3112 10.5762 16.3983 10.6781 16.5069L19.4224 25.8753L26.3488 18.9489C26.5569 18.7411 26.8391 18.6243 27.1332 18.6243C27.4274 18.6243 27.7095 18.7411 27.9176 18.9489L32.0666 23.0979V6.16667C32.0666 5.83957 31.9366 5.52587 31.7053 5.29458C31.474 5.06328 31.1603 4.93334 30.8332 4.93334H6.16655ZM4.93322 30.8333V23.7688L9.83942 18.8651L18.5764 28.2236L22.0544 32.0667H6.16655C5.83945 32.0667 5.52575 31.9367 5.29445 31.7054C5.06316 31.4741 4.93322 31.1604 4.93322 30.8333ZM30.8332 32.0667H25.0489L20.9246 27.5107L27.1332 21.3021L32.0666 26.2355V30.8333C32.0666 31.1604 31.9366 31.4741 31.7053 31.7054C31.474 31.9367 31.1603 32.0667 30.8332 32.0667ZM16.4032 13.5667C16.4032 13.0106 16.6241 12.4773 17.0173 12.0841C17.4105 11.6909 17.9438 11.47 18.4999 11.47C19.056 11.47 19.5893 11.6909 19.9825 12.0841C20.3757 12.4773 20.5966 13.0106 20.5966 13.5667C20.5966 14.1227 20.3757 14.656 19.9825 15.0492C19.5893 15.4424 19.056 15.6633 18.4999 15.6633C17.9438 15.6633 17.4105 15.4424 17.0173 15.0492C16.6241 14.656 16.4032 14.1227 16.4032 13.5667ZM18.4999 9.25001C17.933 9.25001 17.3717 9.36166 16.848 9.5786C16.3242 9.79553 15.8484 10.1135 15.4475 10.5143C15.0467 10.9152 14.7287 11.391 14.5118 11.9148C14.2949 12.4385 14.1832 12.9998 14.1832 13.5667C14.1832 14.1335 14.2949 14.6949 14.5118 15.2186C14.7287 15.7423 15.0467 16.2182 15.4475 16.619C15.8484 17.0199 16.3242 17.3378 16.848 17.5548C17.3717 17.7717 17.933 17.8833 18.4999 17.8833C19.6447 17.8833 20.7427 17.4286 21.5522 16.619C22.3618 15.8095 22.8166 14.7115 22.8166 13.5667C22.8166 12.4218 22.3618 11.3239 21.5522 10.5143C20.7427 9.7048 19.6447 9.25001 18.4999 9.25001Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-lg font-medium text-center">
                  Your image will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="glass-panel p-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white/60">In the style of</span>
              <button
                onClick={cycleCelebrity}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20">
                {celebrities[celebrityIndex]}
              </button>
              <button
                onClick={randomizeOptions}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white border border-white/20"
                title="Randomize">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="w-5 h-5">
                  <g clipPath="url(#clip0_21_2)">
                    <path
                      d="M11 0C11.7956 0 12.5587 0.31607 13.1213 0.87868C13.6839 1.44129 14 2.20435 14 3V6H17C17.7956 6 18.5587 6.31607 19.1213 6.87868C19.6839 7.44129 20 8.20435 20 9V17C20 17.7956 19.6839 18.5587 19.1213 19.1213C18.5587 19.6839 17.7956 20 17 20H9C8.20435 20 7.44129 19.6839 6.87868 19.1213C6.31607 18.5587 6 17.7956 6 17V14H3C2.20435 14 1.44129 13.6839 0.87868 13.1213C0.31607 12.5587 0 11.7956 0 11L0 3C0 2.20435 0.31607 1.44129 0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0L11 0ZM17 8H9C8.75507 8.00003 8.51866 8.08996 8.33563 8.25272C8.15259 8.41547 8.03566 8.63975 8.007 8.883L8 9V17C8.00003 17.2449 8.08996 17.4813 8.25272 17.6644C8.41547 17.8474 8.63975 17.9643 8.883 17.993L9 18H17C17.2449 18 17.4813 17.91 17.6644 17.7473C17.8474 17.5845 17.9643 17.3603 17.993 17.117L18 17V9C18 8.75507 17.91 8.51866 17.7473 8.33563C17.5845 8.15259 17.3603 8.03566 17.117 8.007L17 8ZM10 15C10.2652 15 10.5196 15.1054 10.7071 15.2929C10.8946 15.4804 11 15.7348 11 16C11 16.2652 10.8946 16.5196 10.7071 16.7071C10.5196 16.8946 10.2652 17 10 17C9.73478 17 9.48043 16.8946 9.29289 16.7071C9.10536 16.5196 9 16.2652 9 16C9 15.7348 9.10536 15.4804 9.29289 15.2929C9.48043 15.1054 9.73478 15 10 15ZM16 15C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17C15.7348 17 15.4804 16.8946 15.2929 16.7071C15.1054 16.5196 15 16.2652 15 16C15 15.7348 15.1054 15.4804 15.2929 15.2929C15.4804 15.1054 15.7348 15 16 15ZM13 12C13.2652 12 13.5196 12.1054 13.7071 12.2929C13.8946 12.4804 14 12.7348 14 13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14C12.7348 14 12.4804 13.8946 12.2929 13.7071C12.1054 13.5196 12 13.2652 12 13C12 12.7348 12.1054 12.4804 12.2929 12.2929C12.4804 12.1054 12.7348 12 13 12ZM11.117 2.007L11 2H3C2.75507 2.00003 2.51866 2.08996 2.33563 2.25272C2.15259 2.41547 2.03566 2.63975 2.007 2.883L2 3V11C2.00003 11.2449 2.08996 11.4813 2.25272 11.6644C2.41547 11.8474 2.63975 11.9643 2.883 11.993L3 12H6V9C6 8.20435 6.31607 7.44129 6.87868 6.87868C7.44129 6.31607 8.20435 6 9 6H12V3C12 2.75507 11.91 2.51866 11.7473 2.33563C11.5845 2.15259 11.3603 2.03566 11.117 2.007ZM10 9C10.2652 9 10.5196 9.10536 10.7071 9.29289C10.8946 9.48043 11 9.73478 11 10C11 10.2652 10.8946 10.5196 10.7071 10.7071C10.5196 10.8946 10.2652 11 10 11C9.73478 11 9.48043 10.8946 9.29289 10.7071C9.10536 10.5196 9 10.2652 9 10C9 9.73478 9.10536 9.48043 9.29289 9.29289C9.48043 9.10536 9.73478 9 10 9ZM16 9C16.2652 9 16.5196 9.10536 16.7071 9.29289C16.8946 9.48043 17 9.73478 17 10C17 10.2652 16.8946 10.5196 16.7071 10.7071C16.5196 10.8946 16.2652 11 16 11C15.7348 11 15.4804 10.8946 15.2929 10.7071C15.1054 10.5196 15 10.2652 15 10C15 9.73478 15.1054 9.48043 15.2929 9.29289C15.4804 9.10536 15.7348 9 16 9ZM4.513 8.993C4.77822 8.993 5.03257 9.09836 5.22011 9.28589C5.40764 9.47343 5.513 9.72778 5.513 9.993C5.513 10.2582 5.40764 10.5126 5.22011 10.7001C5.03257 10.8876 4.77822 10.993 4.513 10.993C4.24778 10.993 3.99343 10.8876 3.80589 10.7001C3.61836 10.5126 3.513 10.2582 3.513 9.993C3.513 9.72778 3.61836 9.47343 3.80589 9.28589C3.99343 9.09836 4.24778 8.993 4.513 8.993ZM4.513 5.993C4.77822 5.993 5.03257 6.09836 5.22011 6.28589C5.40764 6.47343 5.513 6.72778 5.513 6.993C5.513 7.25822 5.40764 7.51257 5.22011 7.70011C5.03257 7.88764 4.77822 7.993 4.513 7.993C4.24778 7.993 3.99343 7.88764 3.80589 7.70011C3.61836 7.51257 3.513 7.25822 3.513 6.993C3.513 6.72778 3.61836 6.47343 3.80589 6.28589C3.99343 6.09836 4.24778 5.993 4.513 5.993ZM4.513 2.993C4.77822 2.993 5.03257 3.09836 5.22011 3.28589C5.40764 3.47343 5.513 3.72778 5.513 3.993C5.513 4.25822 5.40764 4.51257 5.22011 4.70011C5.03257 4.88764 4.77822 4.993 4.513 4.993C4.24778 4.993 3.99343 4.88764 3.80589 4.70011C3.61836 4.51257 3.513 4.25822 3.513 3.993C3.513 3.72778 3.61836 3.47343 3.80589 3.28589C3.99343 3.09836 4.24778 2.993 4.513 2.993ZM9.513 2.993C9.77822 2.993 10.0326 3.09836 10.2201 3.28589C10.4076 3.47343 10.513 3.72778 10.513 3.993C10.513 4.25822 10.4076 4.51257 10.2201 4.70011C10.0326 4.88764 9.77822 4.993 9.513 4.993C9.24778 4.993 8.99343 4.88764 8.80589 4.70011C8.61836 4.51257 8.513 4.25822 8.513 3.993C8.513 3.72778 8.61836 3.47343 8.80589 3.28589C8.99343 3.09836 9.24778 2.993 9.513 2.993Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_21_2">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full gradient-button text-white font-medium py-2 px-6 rounded-full shadow-lg disabled:opacity-50">
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
