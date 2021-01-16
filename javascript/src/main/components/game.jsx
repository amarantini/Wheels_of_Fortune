import {Row, Col, Form, Button } from "react-bootstrap";


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
        this.puzzle = puzzle;
        this.playerIndex = playerIndex;
        this.puzzleDict = {};
        for(let i=0; i<puzzle.length; i++){
            if(puzzle[i] != " "){
                if(!(puzzle[i] in puzzleDict)){
                    puzzleDict[puzzle[i]] = 1;
                } else {
                    puzzleDict[puzzle[i]] += 1;
                }
            }
        }
        this.state = {
            award: 0,
            playing: true,
            reward: 0,
            guess: ""
        };
    }

    //TODO: The wheel has 24 spaces ($500*4,$600*4,$700*4,$800*4,$900*4, $2500*1, Bankrupt*2, LoseATurn*1)
    spinTheWheel() {
        const rewards = [500,600,700,800,900,2500,"Bankrupt",
                        500,600,700,800,900,"Bankrupt",
                        500,600,700,800,900,"Lose a turn",
                        500,600,700,800,900];
        return rewards[Math.floor(Math.random() * 24)];
    }

    //TODO: spinTheWhell
    //if bankrupt, set award to 0, else if lose a turn, next player's turn;
    //if alphabet in phrase, add num of alphabet*reward to award and spinTheWhellagain, 
    //else lose the turn to next player
    handleGuess() {
        const alphabet = this.guess;
        const reward = spinTheWheel();
        if(reward==="Bankrupt") {
            this.setState({
                award:0,
                playing: false
            });
        } else if (reward==="Lose a turn") {
            this.setState({
                playing: false
            });
        }
        //if(alphabet already called) next Player
        if(alphabet in puzzleDict){
            let newAward = award + puzzleDict[alphabet]*reward;
            this.setState({
                award: newAward
            });
            this.guess();
        } else {
            this.setState({
                playing: false
            });
        }

    }

    //TODO: each vowel cost $250
    //Contestants may continue to buy vowels so long as they have enough money to keep doing so, 
    //until all of the vowels in the puzzle have been revealed
    handleBuyVowel() {
        const vowel = this.guess;
        //if not all the vowels are reviewed
        this.setState({
            award: this.award-250
        });
        //if(vowel in puzzleDict)
    }

    //TODO: if true, declare winner
    //else lose a turn
    handleSolveThePuzzle() {

    }

    handleChange(event) {
        this.setState({guess: event.target.value});
    }

    render() {
        return (
            <form onSubmit={this.handleGuess}>
                <label>
                Guess:
                <input name="guess" type="text" value={this.state.guess} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Guess" />
                <br />
            <form onSubmit={this.handleBuyVowel}>
                <label>
                Buy a vowel:
                <input name="buyVowel" type="text" onChange={this.handleChange} />
                </label>
                <input type="submit" value="Buy" />
                <br />
            </form>
            <form onSubmit={this.handleSolveThePuzzle}></form>
                <label>
                Solve the puzzle:
                <input name="solvePuzzle" type="text" onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        const data = require('../../../resource/puzzles.json');
        const keys = Object.keys(data);
        const dataSize=keys.length;
        this.puzzle=keys[Math.floor(Math.random()*dataSize)];
        this.hint=data[puzzle];
        this.puzzleDict = {};
        for(let i=0; i<puzzle.length; i++){
            if(puzzle[i] != " "){
                if(!(puzzle[i] in puzzleDict)){
                    puzzleDict[puzzle[i]] = 1;
                } else {
                    puzzleDict[puzzle[i]] += 1;
                }
            }
        }
        this.state = {
            currPlayerIndex: "1"
        };
    }

    //TODO:
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-player">
                    <Row>
                        <Col><Player puzzle={phrase} playerIndex="1"/></Col>
                        <Col><Player puzzle={phrase} layerIndex="2"/></Col>
                    </Row>
                </div>
            </div>
        );
    }
}



ReactDOM.render(
    <Game />,
    document.getElementById('root')
);