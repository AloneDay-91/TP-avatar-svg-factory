import { useEffect, useState } from "react";
import { supabase } from "@/db/supabase";
import { Layout } from "./Layout";
import { PageHeader } from "./PageHeader";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, ArrowLeft, Trash2, Download } from "lucide-react";

interface SavedAvatar {
  id: number;
  svg: string;
  created_at: string;
}

export default function Gallery() {
  const [avatars, setAvatars] = useState<SavedAvatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAvatars();
      } else {
        setLoading(false);
      }
    });
  }, []);

  const fetchAvatars = async () => {
    try {
      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvatars(data || []);
    } catch (error) {
      console.error("Error fetching avatars:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadSvg = (svg: string, id: number) => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `avatar-${id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const deleteAvatar = async (id: number) => {
    if (!confirm("Are you sure you want to delete this avatar?")) return;

    try {
      const { error } = await supabase
        .from('avatars')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAvatars(avatars.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting avatar:", error);
      alert("Failed to delete avatar");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to view your gallery</h2>
          <Button asChild>
            <a href="/">Go Home</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-purple-600">
          <a href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Generator
          </a>
        </Button>
        <PageHeader
          title="My Avatar Gallery"
          description="Your collection of saved geometric cats"
        />
      </div>

      {avatars.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <p className="mb-4">No avatars saved yet.</p>
            <Button asChild>
                <a href="/">Create one now!</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {avatars.map((avatar) => (
            <Card key={avatar.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div
                  className="w-full aspect-square bg-gray-50 rounded-lg mb-4 border-2 border-transparent group-hover:border-purple-100 transition-colors"
                  dangerouslySetInnerHTML={{ __html: avatar.svg }}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    {new Date(avatar.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-blue-600"
                      onClick={() => downloadSvg(avatar.svg, avatar.id)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                      onClick={() => deleteAvatar(avatar.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
