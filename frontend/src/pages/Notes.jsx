import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createNote, deleteNote, getNotes } from "../services/noteService";

function Notes() {
  const me = JSON.parse(localStorage.getItem("user"));
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", subject: "", content: "", resourceLink: "" });
  const [publishing, setPublishing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadNotes = async () => {
    try {
      const { data } = await getNotes();
      setNotes(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load notes");
    }
  };

  useEffect(() => { loadNotes(); }, []);

  const publish = async (event) => {
    event.preventDefault();
    try {
      setPublishing(true);
      await createNote(form);
      setForm({ title: "", subject: "", content: "", resourceLink: "" });
      toast.success("Note published");
      loadNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not publish note");
    } finally {
      setPublishing(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteNote(id);
      setNotes((current) => current.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete note");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchTerm.toLowerCase();
    return (
      note.title?.toLowerCase().includes(query) ||
      note.subject?.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 p-8 md:p-10">
      <h1 className="text-4xl text-white font-bold">Notes</h1>
      <p className="text-gray-400 mt-2">Share useful study material, resources, and notes with your college community.</p>

      <form onSubmit={publish} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Note title" className="p-3 rounded-lg bg-slate-800 text-white outline-none" />
          <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject, e.g. Data Structures" className="p-3 rounded-lg bg-slate-800 text-white outline-none" />
        </div>
        <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your note description or summary here..." rows="4" className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none resize-y" />
        <input value={form.resourceLink} onChange={(e) => setForm({ ...form, resourceLink: e.target.value })} placeholder="PDF or Resource Link, e.g. Google Drive, GitHub (Optional)" className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none" />
        <button disabled={publishing} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 py-3 px-6 rounded-lg text-white font-semibold">
          {publishing ? "Publishing..." : "Publish Note"}
        </button>
      </form>

      <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-white">All Notes ({filteredNotes.length})</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by subject or title..."
          className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-lg outline-none w-full md:w-72"
        />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {filteredNotes.map((note) => {
          const ownNote = note.author?._id === (me?._id || me?.id);
          return (
            <article key={note._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between gap-3">
                  <span className="text-blue-400 text-sm font-semibold">{note.subject}</span>
                  {ownNote && <button onClick={() => remove(note._id)} className="text-sm text-red-400 hover:text-red-300">Delete</button>}
                </div>
                <h2 className="text-xl text-white font-bold mt-3">{note.title}</h2>
                <p className="text-gray-300 whitespace-pre-wrap mt-4">{note.content}</p>
                {note.resourceLink && (
                  <a
                    href={note.resourceLink.startsWith("http") ? note.resourceLink : `https://${note.resourceLink}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300 underline font-medium"
                  >
                    📎 Open Resource / PDF &rarr;
                  </a>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-5 pt-3 border-t border-slate-800">
                Shared by {note.author?.name || "Student"} · {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </article>
          );
        })}
      </div>
      {!filteredNotes.length && (
        <p className="text-gray-400 mt-8">
          {searchTerm ? "No notes found matching your search." : "No notes have been shared yet. Be the first to add one."}
        </p>
      )}
    </div>
  );
}

export default Notes;
