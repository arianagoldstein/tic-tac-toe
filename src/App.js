import { useState } from 'react';

/**
 * Square is a React component representing a clickable square button.
 * @param {object} props - The properties passed to the component.
 * @param {string} props.value - The value to be displayed inside the square.
 * @param {function} props.onSquareClick - The callback function to be executed when the square is clicked.
 * @returns {JSX.Element} - A React element representing the Square component.
 */
function Square({ value, onSquareClick, isWinningSquare }) {
  const squareClass = isWinningSquare ? 'square square-win' : 'square';
  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

/**
 * Board is a React component representing the Tic-Tac-Toe game board.
 * It maintains the state of all squares and handles user clicks to update the game state.
 * @returns {JSX.Element} - A React element representing the Board component.
 */
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const { winner, line} = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (!winner && squares.every((value) => value != null)) {
    status = 'Draw.';
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const renderSquare = (i) => {
    const isWinningSquare = line && line.includes(i);
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  };

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </>
  );
}


/**
 * Game is a React component representing the overall Tic-Tac-Toe game.
 * It contains the game board and game information.
 * @returns {JSX.Element} - A React element representing the Game component.
 */
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);  // list of previous moves
  const [currentMove, setCurrentMove] = useState(0);              // which step the user is currently viewing
  const xIsNext = currentMove % 2 == 0;                           // whether X or O should go next
  const currentSquares = history[currentMove];                    // squares to display on the Board

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        {move != currentMove ? (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          <span>{'You are on move #'}{move}</span>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


/**
 * calculateWinner is a helper function that determines the winner of a Tic-Tac-Toe game.
 * It takes an array of squares representing the current state of the game board.
 * @param {Array} squares - An array representing the values of squares in the game board.
 * @returns {string|null} - The symbol of the winner ('X' or 'O') or null if there is no winner.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}
