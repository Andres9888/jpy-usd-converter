import React from 'react';
import './App.css';
import CurrencyConverter from './components/CurrencyConverter';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sakura-pattern-light to-dollar-pattern-light bg-fixed flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-kon">
          <span className="text-hinomaru">JPY</span> ⇄ <span className="text-usd-green">USD</span> Converter
        </h1>
        <p className="text-gray-600 text-lg">
          Convert between Japanese Yen and US Dollar
        </p>
      </header>

      <main className="w-full max-w-lg">
        <CurrencyConverter />
      </main>
    </div>
  );
}

export default App;