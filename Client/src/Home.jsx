import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit2, FiBookOpen } from "react-icons/fi"; // Feather icons

export default function Home() {
  return (
    <div className="min-h-screen bg-light flex flex-col justify-between">
      {/* Hero Section */}
      <motion.div
        className="p-10 text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl font-extrabold text-primary mb-4 drop-shadow-md"
          whileHover={{ scale: 1.02, textShadow: "0px 0px 8px rgba(141, 188, 199, 0.7)" }}
        >
          Second Brain for Students
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-xl mx-auto mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Save smart notes, generate flashcards, mind maps, and quizzes powered by AI.
        </motion.p>
      </motion.div>

      {/* Feature Card Section */}
      <motion.div
        className="bg-secondary rounded-3xl shadow-xl p-8 max-w-2xl mx-auto transition-all"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="mt-4 space-y-6">
          <Link to="/editor">
            <motion.button
              className="flex items-center justify-center bg-primary text-white py-3 px-6 w-full rounded-xl font-medium shadow-lg hover:bg-highlight hover:text-black transition-colors "
              whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(141, 188, 199, 0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              <FiEdit2 className="mr-2 text-2xl" />
              Start Taking Notes
            </motion.button>
          </Link>

          <Link to="/flashcards">
            <motion.button
              className="flex items-center justify-center bg-primary text-white py-3 px-6 w-full rounded-xl font-medium shadow-lg hover:bg-highlight hover:text-black transition-colors"
              whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(235, 255, 216, 0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              <FiBookOpen className="mr-2 text-2xl" />
              Generate Flashcards
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="mt-10 text-center text-sm text-gray-500 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        © {new Date().getFullYear()} Second Brain • Built with React & flask , TailwindCSS & Gemini API
      </motion.footer>
    </div>
  );
}
