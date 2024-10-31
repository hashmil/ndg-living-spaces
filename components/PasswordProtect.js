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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="glass-panel p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Welcome
        </h1>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                isPasswordIncorrect ? "border-red-500" : "border-white/20"
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {isPasswordIncorrect && (
              <p className="text-red-400 text-sm mt-2">Incorrect password</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full gradient-button text-white font-medium py-3 px-6 rounded-lg shadow-lg">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
