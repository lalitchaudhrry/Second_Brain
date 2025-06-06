import React, { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { FiSave, FiEdit2, FiTrash2, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function NoteEditor() {
  const [value, setValue] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [editingId, setEditingId] = useState(null); // null → not editing, ID → editing that note
  const [error, setError] = useState("");

  // 1. Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const res = await fetch("https://second-brain-q4w4.onrender.com/api/notes");
      const data = await res.json();
      setSavedNotes(data.notes || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setSavedNotes([]);
    }
    setLoadingNotes(false);
  };

  // 2. Save a brand-new note
  const handleSave = async () => {
    if (!value.trim()) {
      setError("Cannot save an empty note.");
      return;
    }
    setLoadingSave(true);
    setError("");
    try {
      const response = await fetch("https://second-brain-q4w4.onrender.com/api/save-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value.trim() }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        alert(data.message);
        setValue("");
        fetchNotes();
      }
    } catch (err) {
      console.error("Error saving note:", err);
      setError("Something went wrong while saving.");
    }
    setLoadingSave(false);
  };

  // 3. Delete a note by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`https://second-brain-q4w4.onrender.com/api/notes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        // If we were editing this note, cancel edit
        if (editingId === id) {
          setEditingId(null);
          setValue("");
        }
        fetchNotes();
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note.");
    }
  };

  // 4. Initiate editing a note: load its content and set editingId
  const startEdit = (note) => {
    setValue(note.content);
    setEditingId(note.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll editor into view
  };

  // 5. Perform update on an existing note
  const handleUpdate = async () => {
    if (!value.trim()) {
      setError("Cannot save an empty note.");
      return;
    }
    setLoadingSave(true);
    setError("");
    try {
      const res = await fetch(`https://second-brain-q4w4.onrender.com/api/notes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setValue("");
        setEditingId(null);
        fetchNotes();
      } else {
        setError(data.error || "Failed to update note.");
      }
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Something went wrong while updating.");
    }
    setLoadingSave(false);
  };

  // 6. Cancel editing mode
  const cancelEdit = () => {
    setEditingId(null);
    setValue("");
    setError("");
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-light rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-primary flex items-center">
          {editingId ? (
            <>
              <FiEdit2 className="mr-2 text-2xl" /> Edit Note
            </>
          ) : (
            <>
              <FiEdit2 className="mr-2 text-2xl" /> Take Notes
            </>
          )}
        </h2>
        {editingId && (
          <motion.button
            onClick={cancelEdit}
            className="text-gray-500 hover:text-gray-800 transition"
            whileHover={{ scale: 1.1 }}
          >
            <FiXCircle size={24} />
          </motion.button>
        )}
      </motion.div>

      {/* Markdown Editor */}
      <div data-color-mode="light" className="border border-secondary rounded-md overflow-hidden mb-4">
        <MDEditor value={value} onChange={setValue} height={300} />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Save / Update Button */}
      <motion.button
        onClick={editingId ? handleUpdate : handleSave}
        disabled={loadingSave || !value.trim()}
        className="flex items-center justify-center mt-2 px-5 py-2 rounded-lg bg-highlight text-gray-800 font-semibold shadow-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: value.trim() ? 1.03 : 1, boxShadow: "0px 8px 20px rgba(235,255,216,0.4)" }}
        whileTap={{ scale: value.trim() ? 0.97 : 1 }}
      >
        <FiSave className="mr-2 text-xl" />
        {loadingSave ? (editingId ? "Updating..." : "Saving...") : editingId ? "Update Note" : "Save Note"}
      </motion.button>

      {/* Divider */}
      <div className="my-6 border-t border-secondary" />

      {/* Saved Notes List */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-primary mb-2">Your Saved Notes</h3>
        {loadingNotes ? (
          <p className="text-gray-500">Loading notes...</p>
        ) : savedNotes.length === 0 ? (
          <p className="text-gray-500 italic">No notes saved yet.</p>
        ) : (
          savedNotes.map((note, idx) => (
            <motion.div
              key={note.id}
              className="flex flex-col bg-white p-4 rounded-xl shadow border border-secondary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
            >
              <div className="flex justify-between items-start">
                {/* Render note content as plain Markdown text; you can also render HTML if desired */}
                <pre className="whitespace-pre-wrap text-gray-800 flex-1">{note.content}</pre>
                <div className="flex space-x-2 ml-4">
                  <motion.button
                    onClick={() => startEdit(note)}
                    className="text-primary hover:text-primary-dark transition"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiEdit2 size={20} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(note.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiTrash2 size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
