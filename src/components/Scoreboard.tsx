import { useEffect, useState } from 'react';

interface Score {
  name: string;
  score: number;
  attempts: number;
}

interface ScoreboardProps {
  refreshTrigger: number;
}

export default function Scoreboard({ refreshTrigger }: ScoreboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [totalGames, setTotalGames] = useState(0);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('scores') || '[]');
    const total = parseInt(localStorage.getItem('totalGames') || '0');
    setScores(savedScores);
    setTotalGames(total);
  }, [refreshTrigger]);

  return (
    <div className="scoreboard">
      <h2>🏆 Scoreboard</h2>
      <p>Total games played: {totalGames}</p>
      <ul>
        {scores.length === 0 && <li>No scores yet!</li>}
        {scores
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
          .map((s, i) => (
            <li key={i}>
              <strong>{s.name}</strong>: {s.score} pts ({s.attempts} tries)
            </li>
          ))}
      </ul>
    </div>
  );
}
