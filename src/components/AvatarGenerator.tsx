import { useState, useEffect } from "react";

interface Avatar {
  svg: string;
  timestamp: number;
}

const HISTORY_KEY = "avatar-history";
const MAX_HISTORY = 10;

export default function AvatarGenerator() {
  const [currentSvg, setCurrentSvg] = useState<string>("");
  const [history, setHistory] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  }, [history]);

  const generateAvatar = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-avatar");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate avatar");
      }

      const newAvatar: Avatar = {
        svg: data.svg,
        timestamp: data.timestamp,
      };

      setCurrentSvg(data.svg);

      // Add to history (keep last MAX_HISTORY items)
      setHistory((prev) => {
        const updated = [newAvatar, ...prev];
        return updated.slice(0, MAX_HISTORY);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error generating avatar:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadSvg = () => {
    if (!currentSvg) return;

    const blob = new Blob([currentSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `simpson-avatar-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadAvatar = (avatar: Avatar) => {
    setCurrentSvg(avatar.svg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Avatar Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate unique SVG avatars powered by Gemini AI
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Generate Button */}
          <div className="text-center mb-8">
            <button
              onClick={generateAvatar}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Random Avatar"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          {/* Avatar Display */}
          {currentSvg && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div
                  className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200"
                  dangerouslySetInnerHTML={{ __html: currentSvg }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={downloadSvg}
                  className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Download SVG
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Recent Avatars
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {history.map((avatar, index) => (
                <button
                  key={avatar.timestamp}
                  onClick={() => loadAvatar(avatar)}
                  className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-purple-400 transition-all hover:shadow-md cursor-pointer group"
                >
                  <div
                    className="w-full aspect-square"
                    dangerouslySetInnerHTML={{ __html: avatar.svg }}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {new Date(avatar.timestamp).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
