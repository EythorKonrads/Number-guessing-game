import { useState } from 'react';
import Scoreboard from './components/Scoreboard';
import './App.css';

function App() {
  const [targetNumber, setTargetNumber] = useState(
    () => Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1 and 100!');
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [name, setName] = useState('');
  const [won, setWon] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [refresh, setRefresh] = useState(0); // trigger scoreboard refresh

  const handleGuess = () => {
    if (gameOver) return;

    const numGuess = parseInt(guess);

    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setMessage('Please enter a number between 1 and 100.');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (numGuess === targetNumber) {
      setMessage(`Correct! The number was ${targetNumber}.`);
      setGameOver(true);
      setWon(true);
      incrementTotalGames();
    } else if (newAttempts >= 10) {
      setMessage(`Game over! The number was ${targetNumber}.`);
      setGameOver(true);
      setWon(false);
      incrementTotalGames();
    } else if (numGuess < targetNumber) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }

    setGuess('');
  };

  const incrementTotalGames = () => {
    const total = parseInt(localStorage.getItem('totalGames') || '0') + 1;
    localStorage.setItem('totalGames', total.toString());
  };

  const handleSaveScore = () => {
    if (!name.trim() || scoreSaved) return;

    // Score decreases with each attempt; minimum 100
    const score = Math.max(1000 - attempts * 80, 100);

    const newScore = { name, score, attempts };
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');
    scores.push(newScore);
    localStorage.setItem('scores', JSON.stringify(scores));

    setScoreSaved(true);
    setName('');
    setRefresh((r) => r + 1);

    setTimeout(() => {
      handleRestart();
    }, 800);
  };

  const handleRestart = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('Guess a number between 1 and 100!');
    setAttempts(0);
    setGameOver(false);
    setWon(false);
    setScoreSaved(false);
  };

  return (
    <div className="app">
      <div className="game-area">
        <h1>Number Guessing Game</h1>
        <p>{message}</p>

        {!gameOver && (
          <div className="input-area">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Your guess"
            />
            <button onClick={handleGuess}>Guess</button>
          </div>
        )}

        <p>Attempts: {attempts} / 10</p>

        {gameOver && won && !scoreSaved && (
          <div className="save-score">
            <p>You won in {attempts} attempts!</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <button onClick={handleSaveScore}>Save Score</button>
          </div>
        )}

        {gameOver && !won && (
          <button onClick={handleRestart} className="restart-btn">
            Play Again
          </button>
        )}
      </div>

      <Scoreboard refreshTrigger={refresh} />
    </div>
  );
}

export default App;
