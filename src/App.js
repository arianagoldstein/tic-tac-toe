import { useState } from 'react';

/**
 * Square is a React component representing a clickable square button.
 * @param {object} props - The properties passed to the component.
 * @param {string} props.value - The value to be displayed inside the square.
 * @param {function} props.onSquareClick - The callback function to be executed when the square is clicked.
 * @returns {JSX.Element} - A React element representing the Square component.
 */
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
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
    if (calculateWinner(squares) || squares[i]) {
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

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
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
      return squares[a];
    }
  }
  return null;
}

// notes
  // since state is private to the component that defines it, you cannot update the Board's state
  // directly from Square
  // so we pass down a function from the Board component to the Square component, and have Square call 
  // that function when a square is clicked


  // we want to store the game's state in the parent Board component
  // the Board component can tell each Square what to display by passing a prop
  // this keeps the child components in sync with each other and with their parent

  // state handling is in the Board component
  // parent Board component passes props to the child Square components so that they can
  // be displayed correctly
  // when clicking on a Square, the child Square component now asks the parent Board component
  // to update the state of the board