import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import NoteEditor from './NoteEditor';
import FlashcardPage from './FlashCardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={<NoteEditor />} />
      <Route path="/flashcards" element ={<FlashcardPage/>} />
    </Routes>
  );
}

export default App;
