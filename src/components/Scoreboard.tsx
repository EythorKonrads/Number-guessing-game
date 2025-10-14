import { useEffect, useState } from 'react';

interface Score {
  name: string;
  score: number;
  attempts: number;
  difficulty?: string;
}

interface ScoreboardProps {
  refreshTrigger?: number; // optional — parent can bump this to force reload
}

export default function Scoreboard({ refreshTrigger }: ScoreboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [totalGames, setTotalGames] = useState(0);

  // load scores + totalGames from localStorage whenever refreshTrigger changes
  useEffect(() => {
    const savedScores = JSON.parse(
      localStorage.getItem('scores') || '[]'
    ) as Score[];
    const total = parseInt(localStorage.getItem('totalGames') || '0', 10);
    setScores(savedScores);
    setTotalGames(Number.isNaN(total) ? 0 : total);
  }, [refreshTrigger]);

  const handleClearScores = () => {
    const ok = window.confirm(
      'Are you sure you want to clear the scoreboard? This will remove all saved scores but will NOT change total games played.'
    );
    if (!ok) return;

    localStorage.removeItem('scores');
    setScores([]);
  };

  return (
    <div className="scoreboard">
      <button
        className="clear-btn"
        onClick={handleClearScores}
        title="Clear scoreboard"
        aria-label="Clear scoreboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3 6h18v2H3V6zm2 3h14l-1.2 11.4c-.1.9-.9 1.6-1.8 1.6H8c-.9 0-1.7-.7-1.8-1.6L5 9zm5 2v7h2v-7H10zm4 0v7h2v-7h-2zM9 4V2h6v2h5v2H4V4h5z" />
        </svg>
      </button>

      <h2>🏆 Scoreboard</h2>
      <p>Total games played: {totalGames}</p>

      <ul>
        {scores.length === 0 && <li>No scores yet!</li>}
        {scores
          .slice()
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
          .map((s, i) => (
            <li key={i} className="score-row">
              <strong>{s.name}</strong>
              <span className="score-meta">
                {s.score} pts{s.difficulty ? ` · ${s.difficulty}` : ''} ·{' '}
                {s.attempts} tries
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
