import {Row, Col} from "react-bootstrap";
import Board from "main/components/Board";

//Player: spin the wheel, guess, buy a vowel, awards, solve the puzzle
//Game: initialize Board and two Player, declare winner


class Game extends React.Component {
    constructor(props) {
      super(props);
      const data = {
        "ice cream": "Food",
        hello: "Greeting"
      }; //require('../../../resource/puzzles.json');
      const keys = Object.keys(data);
      const dataSize = keys.length;
      this.puzzle = keys[Math.floor(Math.random() * dataSize)];
      this.hint = data[this.puzzle];
      this.puzzleDict = {};
      for (let i = 0; i < this.puzzle.length; i++) {
        if (this.puzzle[i] != " ") {
          if (!(this.puzzle[i] in this.puzzleDict)) {
            this.puzzleDict[this.puzzle[i]] = 1;
          } else {
            this.puzzleDict[this.puzzle[i]] += 1;
          }
        }
      }
      this.state = {
        award_1: 0,
        guess_1: "",
        award_2: 0,
        guess_2: "",
        currPlayerIndex: 1,
        guessedConsonants: [],
        guessedVowels: [],
        puzzleSolved: false,
        result: "spin it"
      };
      this.handleGuess = this.handleGuess.bind(this);
      this.handleBuyVowel = this.handleBuyVowel.bind(this);
      this.handleSolveThePuzzle = this.handleSolveThePuzzle.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
  
    //TODO: The wheel has 24 spaces ($500*4,$600*4,$700*4,$800*4,$900*4, $2500*1, Bankrupt*2, LoseATurn*1)
    spinTheWheel() {
      const rewards = [
        500,
        600,
        700,
        800,
        900,
        2500,
        "Bankrupt",
        500,
        600,
        700,
        800,
        900,
        "Bankrupt",
        500,
        600,
        700,
        800,
        900,
        "Lose a turn",
        500,
        600,
        700,
        800,
        900
      ];
      return rewards[Math.floor(Math.random() * 24)];
    }
  
    //TODO: spinTheWhell
    //if bankrupt, set award to 0, else if lose a turn, next player's turn;
    //if alphabet in phrase, add num of alphabet*reward to award and spinTheWhellagain,
    //else lose the turn to next player
    handleGuess(event) {
      const alphabet =
        (this.state.currPlayerIndex === 1) ? this.state.guess_1 : this.state.guess_2;
      let award = (this.state.currPlayerIndex === 1) ? "award_1" : "award_2";
      const reward = this.spinTheWheel();
      this.state.result = reward;
      if (reward === "Bankrupt") {
        let newPlayerIndex = (this.state.currPlayerIndex === 1) ? 2 : 1;
        this.setState({
          [award]: 0,
          currPlayerIndex: newPlayerIndex
        });
      } else if (
        reward === "Lose a turn" ||
        //this.state.guessedConsonants.includes(alphabet) ||
        !(alphabet in this.puzzleDict)
      ) {
        let newPlayerIndex = this.state.currPlayerIndex === 1 ? 2 : 1;
        this.setState({
          currPlayerIndex: newPlayerIndex
        });
      } else if (alphabet in this.puzzleDict) {
        var newGuessedConsonants = this.state.guessedConsonants;
        newGuessedConsonants.push(alphabet);
        this.setState({
          guessedConsonants: newGuessedConsonants
        });
        let newAward = award + this.puzzleDict[alphabet] * reward;
        this.setState({
          [award]: newAward
        });
      }
      event.preventDefault();
    }
  
    //TODO: each vowel cost $250
    //Contestants may continue to buy vowels so long as they have enough money to keep doing so,
    //until all of the vowels in the puzzle have been revealed
    handleBuyVowel(event) {
      const vowel =
        (this.state.currPlayerIndex === 1) ? this.state.guess_1 : this.state.guess_2;
      let award = this.state.currPlayerIndex === 1 ? "award_1" : "award_2";
      let newAward;
      if (event.target.name === "guess1") {
        newAward = this.state.award_1 - 250;
      } else {
        newAward = this.state.award_2 - 250;
      }
      this.setState({
        [award]: newAward
      });
      if (this.state.guessedVowels.includes(vowel)) {
        alert("This vowel has already been called.");
        let newPlayerIndex = this.state.currPlayerIndex === 1 ? 2 : 1;
        this.setState({
          currPlayerIndex: newPlayerIndex
        });
      } else if (vowel in this.puzzleDict) {
        var newGuessedVowels = this.state.guessedVowels;
        newGuessedVowels.push(vowel);
        this.setState({
          guessedVowels: newGuessedVowels
        });
      }
      event.preventDefault();
    }
  
    //TODO: if true, declare winner
    //else lose a turn
    handleSolveThePuzzle(event) {
      const guess =
        (this.state.currPlayerIndex === 1) ? this.state.guess_1 : this.state.guess_2;
      if (guess === this.puzzle) {
        this.setState({
          puzzleSolved: true
        });
      } else {
        alert("Wrong guess");
        let newPlayerIndex = this.state.currPlayerIndex === 1 ? 2 : 1;
        this.setState({
          currPlayerIndex: newPlayerIndex
        });
      }
      event.preventDefault();
    }
  
    handleChange = (event) => {
      const guess = (this.state.currPlayerIndex === 1)?'guess_1':'guess_2'
      this.setState({
        [guess]: event.target.value
      });
    };
    
    disabled1(){
      return this.state.currPlayerIndex !== 1;
    }
    disabled2(){
      return this.state.currPlayerIndex !== 2;
    }
  
  
    render() {
      let result1;
      let result2;
      let player1Turn;
      let player2Turn;
      if (this.state.currPlayerIndex === 1) {
        player1Turn = ": Your turn";
        result1 = "Spin the Wheel: " + this.state.result;
      } else {
        player2Turn = ": Your turn";
        result2 = "Spin the Wheel: " + this.state.result;
      }
      let status;
      let awardWinned;
      if (this.state.puzzleSolved) {
        if (this.state.currPlayerIndex === 1) {
          awardWinned = this.state.award_1;
        } else {
          awardWinned = this.state.award_2;
        }
        status =
          "Congratulations! Player " +
          this.state.currPlayerIndex +
          ", you are the winner!\nYou win $" +
          awardWinned +
          "!\n";
        //Display the entire phrase on board
      }
      return (
        <div className="game">
            <h1>Wheels of Fortune!</h1>
            <div className="game-board">
                <h2>Hint: {this.hint}</h2>
                <Board />
            </div>
            <div className="game-player">
            <Row>
                <Col>
                <div className="player1">
                    <h3>Player 1 {player1Turn}</h3>
                    <p>{result1}</p>
                    <form onSubmit={this.handleGuess}>
                        <label>Guess:
                        <input
                            name="guess1"
                            type="text"
                            onChange={this.handleChange}
                        />
                        </label>
                        <input
                            type="submit"
                            name="guess_1"
                            value="Guess"
                            disabled={this.disabled1()}
                        />
                        <br />
                    </form>
                    <form onSubmit={this.handleBuyVowel}>
                        <label>
                        Buy a vowel:
                        <input
                            name="buyVowel1"
                            type="text"
                            onChange={this.handleChange}
                        />
                        </label>
                        <input type="submit" name="buyVowel_1" value="Buy" disabled={this.disabled1()}/>
                        <br />
                    </form>
                    <form onSubmit={this.handleSolveThePuzzle}>
                        <label>
                        Solve the puzzle:
                        <input name="solvePuzzle1"
                            type="text"
                            onChange={this.handleChange}
                        />
                        </label>
                        <input
                        type="submit"
                        name="solvePuzzle_1"
                        value="Submit"
                        disabled={this.disabled1()}
                        />
                    </form>
                    <p>Current award: {this.state.award_1}</p>
                </div>
                </Col>
                <Col>
                <div className="player2">>
                    <h3>Player 2 {player2Turn}</h3>
                    <p>{result2}</p>
                    <form onSubmit={this.handleGuess}>
                        <label>
                        Guess:
                        <input
                            name="guess2"
                            type="text"
                            onChange={this.handleChange}
                        />
                        </label>
                        <input
                        type="submit"
                        name="guess_2"
                        value="Guess"
                        disabled={this.disabled2()}
                        />
                        <br />
                    </form>
                    <form onSubmit={this.handleBuyVowel}>
                        <label>
                        Buy a vowel:
                        <input
                            name="buyVowel2"
                            type="text"
                            onChange={this.handleChange}
                        />
                        </label>
                        <input
                        type="submit"
                        name="buyVowel_2"
                        value="Buy"
                        disabled={this.disabled2()}
                        />
                        <br />
                    </form>
                    <form onSubmit={this.handleSolveThePuzzle}>
                        <label>
                        Solve the puzzle:
                        <input
                            name="solvePuzzle2"
                            type="text"
                            onChange={this.handleChange}
                        />
                        </label>
                        <input
                        type="submit"
                        name="solvePuzzle_2"
                        value="Submit"
                        disabled={this.disabled2()}
                        />
                    </form>
                    <p>Current award: {this.state.award_2}</p>
                </div>
                </Col>
            </Row>
            </div>
          
            <div classname="game-result">
                <p>{status}</p>
            </div>
        </div>
      );
    }
  }



export default Game