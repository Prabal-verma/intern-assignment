import * as React from "react";
import { LogOut, Plus, Trash2 } from "lucide-react";
import { logout } from "../lib/authApi";
import { useNavigate } from "react-router-dom";

export function DashboardDesktop({
  user,
  notes,
  onCreateNote,
  onDeleteNote,
}: {
  user: { name: string; email: string };
  notes: { _id: string; title: string; content?: string }[];
  onCreateNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}) {
  const [newTitle, setNewTitle] = React.useState("");
  const [newContent, setNewContent] = React.useState("");
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    logout();
    navigate("/sign-in");
  };
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-row items-center">
      {/* Left: Sidebar */}
      <div className="w-full flex flex-col justify-center items-center p-12">
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.png" alt="Logo" className="h-8 w-15 rounded" />
        </div>
        <div className="w-full max-w-md rounded-xl bg-white shadow p-6 mb-6">
          <div className="font-semibold text-2xl text-neutral-900 mb-1">
            Welcome, {user.name} !
          </div>
          <div className="text-base text-neutral-500">Email: {user.email}</div>
        </div>
        <form
          className="w-full max-w-md flex flex-col gap-2 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (newTitle.trim() && newContent.trim()) {
              onCreateNote(newTitle.trim(), newContent.trim());
              setNewTitle("");
              setNewContent("");
            }
          }}
        >
          <input
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            placeholder="New note title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <textarea
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            placeholder="Note content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            required
          />
          <button
            type="submit"
            className="h-11 rounded-lg bg-blue-600 text-white font-semibold px-4 flex items-center hover:bg-blue-700"
          >
            <Plus className="size-5 mr-2" />
            Create
          </button>
        </form>
        <div className="w-full max-w-md">
          <div className="font-medium text-neutral-900 mb-2">Notes</div>
          <div className="flex flex-col gap-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow border border-neutral-200"
              >
                <span className="text-neutral-800 text-base">{note.title}</span>
                <button
                  className="text-neutral-400 hover:text-red-500"
                  onClick={() => onDeleteNote(note._id)}
                  title="Delete note"
                  aria-label="Delete note"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          className="mt-8 text-blue-600 font-medium flex items-center gap-1 hover:underline"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
