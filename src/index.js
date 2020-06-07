import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// a controlled component which will be a toggle button
class ToggleButton extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  //calls the on change method passed as a prop
  handleChange(event){
    this.props.onChange(event.target.checked);
  }

  render(){
    return(
      <div className= "game-info">
        Display Ascending
        <label className="switch">
          <input type="checkbox" onChange={this.handleChange} checked={this.props.value}/>
          <span className="slider"></span>
        </label>
      </div>
    );
  }
}

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

  render() {

    const boardSize = 3;
    let rows = [];
    let counter = 0;
    // Use two loops to make the squares
    for(let i = 0; i < boardSize; i++){
      
      let cols = [];
      for(let j = 0; j < 3; j++){
        cols.push(this.renderSquare(counter));
        counter++;
      }

      rows.push(
        <div className="board-row">{cols}</div>
      );
    }

    return (
      <div>{rows}</div>
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
      isAscending: false
    };

    this.handleChange = this.handleChange.bind(this);
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

  //updates the boolean isAscending 
  handleChange(value){
    this.setState({isAscending: value});
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

    let moves = history.map((step, move) => {
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

    //if the state is set to false it means we want descending list
    if(!this.state.isAscending){
      moves.reverse();
    }

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
          <ToggleButton value={this.state.isAscending} onChange={this.handleChange}/>
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