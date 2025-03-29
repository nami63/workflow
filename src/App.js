import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ConfigPage from './pages/ConfigPage';
import Output from './pages/Output';
import './App.css';

const App = () => {
  const [page, setPage] = useState('config');
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 max-w-4xl mx-auto">
        <nav className="flex mb-6 space-x-4">
          <button 
            onClick={() => setPage('config')} 
            className={`px-4 py-2 rounded ${page === 'config' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Config Page
          </button>
          <button 
            onClick={() => setPage('output')} 
            className={`px-4 py-2 rounded ${page === 'output' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Output Page
          </button>
        </nav>
        
        {page === 'config' ? <ConfigPage /> : <Output />}
      </div>
    </DndProvider>
  );
};

export default App;