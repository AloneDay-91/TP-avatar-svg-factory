import { useState, useEffect } from "react";
import { Layout } from "./Layout";
import { PageHeader } from "./PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

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
    <Layout>
      <PageHeader
        title="Cat Avatar Generator"
        description="Generate unique geometric cat SVG avatars powered by Gemini AI"
      />

      {/* Main Content */}
      <Card className="mb-8">
        <CardContent>
          {/* Generate Button */}
          <div className="text-center mb-8 pt-8">
            <Button
              onClick={generateAvatar}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 px-8 py-6 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Random Avatar"
              )}
            </Button>
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
                <Button
                  onClick={downloadSvg}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Download SVG
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Section */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Avatars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {history.map((avatar) => (
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
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}
