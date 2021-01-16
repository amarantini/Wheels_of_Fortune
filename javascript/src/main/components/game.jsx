import {Button} from "react-bootstrap";


//Square: contain alphabet
//Board: render the entire phrase, and handle guess
//Player: spin the wheel, guess, buy a vowel, awards, solve the puzzle
//Game: initialize Board and two Player, declare winner


function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //squares: Array(9).fill(null),
            //xIsNext: true,
        };
    }
  
    /*handleClick(i) {
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }*/
    
    //TODO:
    renderSquare(i) {
        return (
            <Square
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
            />
        );
    }
    
    //TODO:
    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
    
        return (
            <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
            </div>
        );
    }
}

class Player extends Reaxt.Component {
    constructor(props) {
        super(props);
        this.state = {
            award: 0,
            playing: true,
            reward: 0
        };
    }

    //TODO: The wheel has 24 spaces ($500*5,$600*5,$700*5,$900*5, $2500*1, Bankrupt*2, LoseATurn*1)
    spinTheWheel() {
        return {
            //reward = ?
        }
    }

    //TODO: spinTheWhell
    //if bankrupt, set award to 0, else if lose a turn, next player's turn;
    //if alphabet in phrase, add num of alphabet*reward to award and spinTheWhellagain, 
    //else lose the turn to next player
    guess(alphabet) {
        /*
        reward = spinTheWheel
        if(reward===Bankrupt) {
            award=0
            next player
        } else if (reward===LoseATurn) {
            next player
        }
        if(alphabet already called) next Player
        if(alphabet in phrase){
            award += reward*num of alphabet
            next guess
        } else {
            next player
        }
        */
    }

    //TODO: each vowel cost $250
    //Contestants may continue to buy vowels so long as they have enough money to keep doing so, 
    //until all of the vowels in the puzzle have been revealed
    buyVowel(vowel) {

    }

    //TODO: if true, declare winner
    //else lose a turn
    solveThePuzzle(phrase) {

    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //squares: Array(9).fill(null),
            player1: Player(),
            player2: Player()
        };
    }
    //TODO:
    render() {
        return (
            <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
            </div>
        );
    }
}



ReactDOM.render(
    <Game />,
    document.getElementById('root')
);