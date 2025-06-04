import React, { useState } from 'react';
import { FiBookOpen, FiRotateCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function FlashcardPage() {
  const [input, setInput] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please paste some notes to generate flashcards.");
      return;
    }

    setLoading(true);
    setError("");
    setFlashcards([]);

    try {
      const response = await fetch("http://localhost:5000/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      const data = await response.json();

      if (data.flashcards) {
        setFlashcards(data.flashcards);
      } else {
        setError("Error generating flashcards. Try again.");
      }
    } catch (err) {
      console.error("Error generating flashcards:", err);
      setError("Something went wrong while generating.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-light rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2
        className="text-2xl font-bold text-primary mb-4 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <FiBookOpen className="mr-2 text-2xl" />
        Flashcard Generator
      </motion.h2>
      
      <textarea
        className="w-full p-4 border border-secondary rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        rows="6"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your notes here..."
      />

      <motion.button
        onClick={handleGenerate}
        className="flex items-center justify-center bg-highlight text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-primary hover:text-white transition-colors"
        whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(235,255,216,0.4)" }}
        whileTap={{ scale: 0.97 }}
        disabled={loading}
      >
        {loading ? (
          <>
            <FiRotateCw className="animate-spin mr-2 text-xl" />
            Generating...
          </>
        ) : (
          <>
            Generate
          </>
        )}
      </motion.button>

      {error && (
        <motion.p
          className="mt-4 text-red-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {error}
        </motion.p>
      )}

      <div className="mt-6 space-y-4">
        {flashcards.map((fc, i) => (
          <motion.div
            key={i}
            className="bg-white p-4 rounded-xl shadow border border-secondary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
          >
            <p className="font-semibold mb-1">Q: {fc.question}</p>
            <p className="text-gray-700">A: {fc.answer}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
