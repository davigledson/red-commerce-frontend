import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import Produtos from './pages/produtos';
import Contato from './pages/contato';
import Navbar from './components/NavBar'; // certifique-se de que o nome do arquivo é 'Navbar.js'
import './index.css';
import Card from './components/card';
import { ThemeProvider } from 'flowbite-react';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/contato" element={<Contato />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
