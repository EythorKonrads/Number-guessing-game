import { useState } from 'react';
import Scoreboard from './components/Scoreboard';
import './App.css';

function App() {
  type Difficulty = 'Easy' | 'Medium' | 'Hard';
  const difficultySettings = {
    Easy: { maxNumber: 50, maxAttempts: 15, maxScore: 500 },
    Medium: { maxNumber: 100, maxAttempts: 10, maxScore: 1000 },
    Hard: { maxNumber: 200, maxAttempts: 7, maxScore: 2000 },
  };

  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1 and 100!');
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [name, setName] = useState('');
  const [won, setWon] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [refresh, setRefresh] = useState(0); // trigger scoreboard refresh
  const savedDifficulty =
    (localStorage.getItem('difficulty') as Difficulty) || 'Medium';
  const [difficulty, setDifficulty] = useState<Difficulty>(savedDifficulty);

  const [maxNumber, setMaxNumber] = useState(
    difficultySettings[savedDifficulty].maxNumber
  );
  const [targetNumber, setTargetNumber] = useState(
    () => Math.floor(Math.random() * maxNumber) + 1
  );
  const [maxAttempts, setMaxAttempts] = useState(
    difficultySettings[savedDifficulty].maxAttempts
  );
  const [maxScore, setMaxScore] = useState(
    difficultySettings[savedDifficulty].maxScore
  );

  const handleDifficultyChange = (selected: Difficulty) => {
    // Save the difficulty to localStorage
    localStorage.setItem('difficulty', selected);

    // Update states
    setDifficulty(selected);
    const settings = difficultySettings[selected];
    setMaxNumber(settings.maxNumber);
    setMaxAttempts(settings.maxAttempts);
    setMaxScore(settings.maxScore);

    // Restart the game for the new range
    handleRestart(settings.maxNumber);
  };

  const handleGuess = () => {
    if (gameOver) return;

    const numGuess = parseInt(guess);

    if (isNaN(numGuess) || numGuess < 1 || numGuess > maxNumber) {
      setMessage(`Please enter a number between 1 and ${maxNumber}.`);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (numGuess === targetNumber) {
      setMessage(`Correct! The number was ${targetNumber}.`);
      setGameOver(true);
      setWon(true);
      incrementTotalGames();
    } else if (newAttempts >= maxAttempts) {
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

    // Dynamic scoring based on difficulty
    const baseScore = maxScore;
    const deductionPerAttempt = baseScore / maxAttempts;
    const score = Math.max(
      baseScore - (attempts - 1) * deductionPerAttempt,
      50
    ); // floor score = 50

    const newScore = { name, score: Math.round(score), attempts, difficulty };
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');
    scores.push(newScore);
    localStorage.setItem('scores', JSON.stringify(scores));

    setScoreSaved(true);
    setName('');
    setRefresh((r) => r + 1);

    setMessage(`Score saved! You earned ${Math.round(score)} points.`);
    setTimeout(() => handleRestart(), 1200);
  };

  const handleRestart = (newMaxNumber?: number) => {
    const range = newMaxNumber ?? maxNumber;
    setTargetNumber(Math.floor(Math.random() * range) + 1);
    setGuess('');
    setMessage(`Guess a number between 1 and ${range}!`);
    setAttempts(0);
    setGameOver(false);
    setWon(false);
    setScoreSaved(false);
  };

  return (
    <div className="app">
      <div className="difficulty-selector">
        <h3>Difficulty: </h3>
        <select
          name="difficulty"
          value={difficulty}
          onChange={(e) => handleDifficultyChange(e.target.value as Difficulty)}
        >
          <option value="Easy">Easy (1–50)</option>
          <option value="Medium">Medium (1–100)</option>
          <option value="Hard">Hard (1–200)</option>
        </select>
      </div>
      <div className="game-area">
        <h1>Number Guessing Game</h1>
        <p>{message}</p>

        {!gameOver && (
          <div className="input-area">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !gameOver && guess.trim() !== '') {
                  handleGuess();
                }
              }}
              disabled={gameOver}
              placeholder="Your guess"
            />
            <button onClick={handleGuess}>Guess</button>
          </div>
        )}

        <p>
          Attempts: {attempts} / {maxAttempts}
        </p>

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
          <button onClick={() => handleRestart()} className="restart-btn">
            Play Again
          </button>
        )}
      </div>

      <Scoreboard refreshTrigger={refresh} />
    </div>
  );
}

export default App;
