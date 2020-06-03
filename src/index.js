import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//square component
function Square(props) {
  //props.value will be x, o, or null
  return (
    <button className="square" onClick={props.onClick} >
      {props.value} 
    </button>
  );
}

class Board extends React.Component {

  // i is the array index
  // value and onclick come from game class
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(counter){
    let cols = [];
    for(let j = 0; j < 3; j++){
      cols.push(
        this.renderSquare(counter)
      );
      counter++;
    }

    return cols;
  }

  renderBoard(){
    let counter = 0;
    let rows = [];
    for(let i = 0; i < 3; i++){
      rows.push(
        <div className="board-row">
          {this.renderRow(counter)}
        </div>
      );
      counter += 3;
    }
    return (
      <div>{rows}</div>
    );
  }


  render() {
    return (
      this.renderBoard()
      // <div>
      //   <div className="board-row">
      //     {this.renderSquare(0)}
      //     {this.renderSquare(1)}
      //     {this.renderSquare(2)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(3)}
      //     {this.renderSquare(4)}
      //     {this.renderSquare(5)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(6)}
      //     {this.renderSquare(7)}
      //     {this.renderSquare(8)}
      //   </div>
      // </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        currentMove: Array(2).fill(0),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let moves = current.currentMove.slice();

    //early return if there is already a winner or the square is filled
    if (checkWinner(squares) || squares[i]) {
      return;
    }

    moves = getRowCol(i);

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        currentMove: moves
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
    
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    //each time we re-render check if there is a winner
    const winner = checkWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ? 'go to move #' + move + ' at ' + history[move].currentMove : ' go to game start';
      return (
        <li key={move}>
          <button 
          /*step number is the length of history and if we go back the history gets 
          shortenned therefore the item we click is the new step number*/
          className={move === this.state.stepNumber ? 'bold-button' :''} 
          onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function checkWinner(squares) {
  const possibilities = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < possibilities.length; i++) {
    const [a, b, c] = possibilities[i];

    //check if the square at a is not null, then check the square at b and c if they are same as a
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getRowCol(i){
  let cord = [0,0];

  if (i <= 2) {
    cord[0] = 0;
    cord[1] = i;
  }
  else if (i > 2 && i <= 5) {
    cord[0] = 1;
    cord[1] = i-3;
  }
  else {
    cord[0] = 2;
    cord[1] = i-6;
  }
  
  return cord;
}