import React from "react";
import {Row, Col} from "react-bootstrap";
import Data from "main/components//Data/"
//import * as Data from './phrases.json'

//import Board from "main/components/Board";

//Player: spin the wheel, guess, buy a vowel, awards, solve the puzzle
//Game: initialize Board and two Player, declare winner


class Game extends React.Component {
    constructor(props) {
      super(props);
      
      var keys = Object.keys(Data);
      var dataSize = keys.length;
      var index = Math.floor(Math.random() * dataSize);
      this.puzzle = keys[index];
      this.hint = Data[this.puzzle];
      this.puzzleDict = {};
      for (let i = 0; i < this.puzzle.length; i++) {
        if (this.puzzle[i] !== " ") {
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
        result_1: "spin it",
        result_2: "spin it",
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
      let alphabet;
      let award=this.state.award_1;
      const reward = this.spinTheWheel();
      if(this.state.currPlayerIndex === 1){
        this.setState({
          result_1:reward
        });
        alphabet = this.state.guess_1;
        award = this.state.award_1;
      } else {
        this.setState({
          result_2:reward
        });
        alphabet = this.state.guess_2;
        award = this.state.award_2;
      }
      if (reward === "Bankrupt") {
        let newPlayerIndex = (this.state.currPlayerIndex === 1) ? 2 : 1;
        if(this.state.currPlayerIndex === 1) {
          this.setState({
            award_1: 0,
            currPlayerIndex: newPlayerIndex
          });
        } else {
          this.setState({
            award_2: 0,
            currPlayerIndex: newPlayerIndex
          });
        }
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
        if(this.state.currPlayerIndex === 1) {
          this.setState({
            award_1: newAward
          });
        } else {
          this.setState({
            award_2: newAward
          });
        }
      }
      event.preventDefault();
    }
  
    //TODO: each vowel cost $250
    //Contestants may continue to buy vowels so long as they have enough money to keep doing so,
    //until all of the vowels in the puzzle have been revealed
    handleBuyVowel(event) {
      const vowel =
        (this.state.currPlayerIndex === 1) ? this.state.guess_1 : this.state.guess_2;
      let newAward;
      let oldAward = this.state.currPlayerIndex === 1 ? this.state.award_1 : this.state.award_2;
      if(oldAward<250){
        alert("No enough money!");
      } else {
        newAward = oldAward - 250;
        if (this.state.currPlayerIndex === 1) {
          this.setState({
            award_1: newAward
          });
        } else {
          this.setState({
            award_2: newAward
          });
        }
        
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
          //board show vowel
        }
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
      let result1="Spin the Wheel: ";
      let result2="Spin the Wheel: ";
      let player1Turn="\n";
      let player2Turn="\n";
      if (this.state.currPlayerIndex === 1) {
        player1Turn = ": Your turn";
        result1 += this.state.result_1;
      } else {
        player2Turn = ": Your turn";
        result2 += "Spin the Wheel: " + this.state.result_2;
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
            <h1 style={{textAlign: 'center',color:'aquamarine',textDecoration:'underline aquamarine', fontStyle:'italic', fontVariant:'small-caps'}}>Wheels of Fortune!</h1>
            <div className="game-board" >
                <h2 style={{textAlign: 'center', color:'blue'}}>Hint: {this.hint}</h2>
                
            </div>
            <div className="game-player">
            <Row>
                <Col>
                <div className="player1">
                    <h3 style={{color:'lightcoral',padding: 15}}>Player 1 {player1Turn}</h3>
                    <p style={{padding: 12}}>{result1}</p>
                    <form onSubmit={this.handleGuess}>
                        <label style={{padding: 12}}>Guess: 
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
                        <label style={{padding: 12}}>
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
                        <label style = {{padding: 12}}>
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
                    <p style = {{padding: 12}}>Current award: {this.state.award_1}</p>
                </div>
                </Col>
                <Col>
                <div className="player2">
                    <h3 style={{color:'lightcoral', padding: 12}}>Player 2 {player2Turn}</h3>
                    <p style = {{padding: 12}}>{result2}</p>
                    <form onSubmit={this.handleGuess}>
                        <label style = {{padding: 12}}>
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
                        <label style = {{padding: 12}}>
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
                        <label style = {{padding: 12}}>
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
                    <p style = {{padding: 12}}>Current award: {this.state.award_2}</p>
                </div>
                </Col>
            </Row>
            </div>
          
            <div classname="game-result">
                <h3>{status}</h3>
            </div>
        </div>
      );
    }
  }



export default Game
