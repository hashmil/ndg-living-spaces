"use client";

import { useState, useEffect } from "react";

export default function PasswordProtect({ children }) {
  const [inputPassword, setInputPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (inputPassword === process.env.NEXT_PUBLIC_PAGE_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      setIsPasswordIncorrect(false);
    } else {
      setIsPasswordIncorrect(true);
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <form
          onSubmit={handlePasswordSubmit}
          className="flex flex-col items-center">
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            placeholder="Enter password"
            className={`mb-2 p-2 border rounded text-black ${
              isPasswordIncorrect ? "border-red-500" : "border-white"
            }`}
          />
          {isPasswordIncorrect && (
            <p className="text-red-500 text-sm mb-4">Incorrect password</p>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
