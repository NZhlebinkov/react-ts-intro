import React, { useRef } from 'react';
import './App.css';

const BOARD_SIZE = 3;
type Piece = 'X' | 'O';
interface boardProps {
  squares: any,
  onClick: Function,
}

interface buttonProps {
  value: any,
  onClick: (event: any) => void,
}
interface tttState {
  history: Array<{squares: Array<Piece>, change: number|null}>,
  stepNumber: number,
  xIsNext: boolean,
  historyAscending: boolean,
}

const Square: React.FC<buttonProps> = (props) => {
  return (
    <button 
      className="square"
      onClick={props.onClick}
      >
      {props.value}
    </button>
  );
}
class Board extends React.Component<boardProps> {

  renderSquare(i: number) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(i: number) {
    let squares:JSX.Element[] = []
    for (let cell = 0; cell < BOARD_SIZE; cell++) {
      squares.push(this.renderSquare(i*BOARD_SIZE + cell))
    }
    return (
      <div className="board-row">
        {squares}
      </div>
    )
  }


  render() {
    let rows:JSX.Element[] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      rows.push(this.renderRow(i))
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component<{}, tttState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        change: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      historyAscending: true,
    }
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = getNext(this.state.xIsNext);
    this.setState({
      history: history.concat([{
        squares: squares,
        change: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number): void {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0.
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((_, step) => {
      const desc = step ?
      'Go to move #'+step + getCoord(history[step].change!): // change is only null at step 0
      'Go to game start';
      return (
        <li key={step}>
          <button onClick={()=> this.jumpTo(step)}>{step == this.state.stepNumber ? <b>{desc}</b> : desc}</button>
        </li>
      )
    })

    if(!this.state.historyAscending) moves.reverse();

    let status: string;
    if(winner) {
      status = "Winner: " + winner;
    } else {
      status = 'Next player: ' + getNext(this.state.xIsNext);
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i: number) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <input type="checkbox" onMouseDown={()=> this.setState({historyAscending: !this.state.historyAscending})}/> Toggle ordering
          {/* <div>{this.state.historyAscending?"Toggled":"Not"}</div> */}
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
function getCoord(i: number): string {
  return '(' + i%3 + ',' + Math.floor(i/3) + ')';
}

function getNext(xIsNext: boolean): Piece {
  return xIsNext ? 'X' : 'O';
}

function calculateWinner(squares: Array<Piece>) {
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

// ========================================

function App() {
  return (
    <Game />
  );
}

export default App;
