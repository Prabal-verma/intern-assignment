import React from "react";
import { SignInCard } from "./pages/sign-in";
import { SignUpCard } from "./pages/sign-up";
import { DashboardMobile } from "./pages/DashboardMobile";
import { DashboardDesktop } from "./pages/DashboardDesktop";
import { GoogleAuthCallback } from "./pages/GoogleAuthCallback";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { getNotes, createNote, deleteNote, getToken } from "./lib/api";
import { getUserInfo, getUserProfile } from "./lib/authApi";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getToken();
  
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{children}</>;
}

function Dashboard() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [notes, setNotes] = React.useState<
    { _id: string; title: string; content?: string }[]
  >([]);
  const [user, setUser] = React.useState<{ name: string; email: string; id?: string }>({
    name: "",
    email: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Get user info from localStorage first, then verify with backend
        const storedUser = getUserInfo();
        if (storedUser) {
          setUser(storedUser);
        }

        // Fetch user profile to ensure token is still valid
        try {
          const profileRes = await getUserProfile();
          if (profileRes.user) {
            setUser(profileRes.user);
          }
        } catch (profileErr) {
          // If profile fetch fails, token might be invalid
          console.warn("Failed to fetch user profile:", profileErr);
        }

        // Fetch notes
        const notesRes = await getNotes();
        setNotes(notesRes.notes || notesRes || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load data");
        // If it's an auth error, redirect to sign-in
        if (err.status === 401 || err.status === 403) {
          window.location.href = "/sign-in";
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const response = await createNote({ title, content });
      const newNote = response.note || response;
      setNotes((prev) => [newNote, ...prev]);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to create note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to delete note");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return isMobile ? (
    <DashboardMobile
      user={user}
      notes={notes}
      onCreateNote={handleCreateNote}
      onDeleteNote={handleDeleteNote}
    />
  ) : (
    <DashboardDesktop
      user={user}
      notes={notes}
      onCreateNote={handleCreateNote}
      onDeleteNote={handleDeleteNote}
    />
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignInCard />} />
        <Route path="/sign-up" element={<SignUpCard />} />
        <Route path="/auth/google" element={<GoogleAuthCallback />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </Router>
  );
}
