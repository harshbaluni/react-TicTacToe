import React, { useState, useEffect } from "react";
import "./style.css";

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [xState, setXState] = useState(Array(9).fill(0));
  const [oState, setOState] = useState(Array(9).fill(0));
  const [turn, setTurn] = useState(1);
  const [mode, setMode] = useState(null);
  const [message, setMessage] = useState("");

  const checkWin = (x, o) => {
    for (let pattern of WIN_PATTERNS) {
      if (pattern.every(i => x[i] === 1)) return 1;
      if (pattern.every(i => o[i] === 1)) return 0;
    }
    if (x.every((_, i) => x[i] === 1 || o[i] === 1)) return 2;
    return -1;
  };

  const minimax = (x, o, depth, isMax) => {
    const result = checkWin(x, o);
    if (result === 1) return 10 - depth;
    if (result === 0) return depth - 10;
    if (result === 2) return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!x[i] && !o[i]) {
          x[i] = 1;
          best = Math.max(best, minimax(x, o, depth + 1, false));
          x[i] = 0;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!x[i] && !o[i]) {
          o[i] = 1;
          best = Math.min(best, minimax(x, o, depth + 1, true));
          o[i] = 0;
        }
      }
      return best;
    }
  };

  const findBestMove = () => {
    let bestVal = Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (!xState[i] && !oState[i]) {
        const newO = [...oState];
        newO[i] = 1;
        const moveVal = minimax([...xState], newO, 0, true);
        if (moveVal < bestVal) {
          bestVal = moveVal;
          move = i;
        }
      }
    }
    return move;
  };

  const handleClick = i => {
    if (xState[i] || oState[i] || mode === null || message) return;

    if (turn === 1) {
      const newX = [...xState];
      newX[i] = 1;
      setXState(newX);
      setTurn(0);
    } else if (mode === "PVP") {
      const newO = [...oState];
      newO[i] = 1;
      setOState(newO);
      setTurn(1);
    }
  };

  useEffect(() => {
    const winner = checkWin(xState, oState);
    if (winner !== -1) {
      if (winner === 1) setMessage("X wins!");
      else if (winner === 0) setMessage("O wins!");
      else setMessage("It's a tie!");
    } else if (mode === "AI" && turn === 0) {
      setTimeout(() => {
        const move = findBestMove();
        const newO = [...oState];
        newO[move] = 1;
        setOState(newO);
        setTurn(1);
      }, 500);
    }
  }, [xState, oState, turn]);

  const resetGame = () => {
    setXState(Array(9).fill(0));
    setOState(Array(9).fill(0));
    setTurn(1);
    setMessage("");
  };

  const Cell = ({ i }) => (
    <div className="cell" onClick={() => handleClick(i)}>
      {xState[i] ? "X" : oState[i] ? "O" : ""}
    </div>
  );

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>
      <div className="mode-buttons">
        <button onClick={() => setMode("PVP")}>Player vs Player</button>
        <button onClick={() => setMode("AI")}>Player vs AI</button>
        <button onClick={resetGame}>Reset</button>
      </div>
      <div className="board">
        {Array(9).fill(0).map((_, i) => <Cell key={i} i={i} />)}
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;
