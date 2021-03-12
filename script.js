"use strict";

class Player {
  constructor(sign, type) {
    this.sign = sign;
    this.type = type;
  }

  getSign() {
    return this.sign;
  }

  isBot() {
    return this.type === "Computer";
  }

  setType(newType) {
    this.type = newType;
  }

  getType() {
    return this.type;
  }
}

class GameBoard {
  states;
  constructor() {
    this.states = Array(9).fill("");
  }

  setState(index, sign) {
    this.states[index] = sign;
  }

  resetStates() {
    this.states.fill("");
  }
}

class ComputerPlay {
  getMove() {
    // get a random index from 0 to 8
    const move = Math.floor(Math.random() * 9);
    if (gameBoard.states[move] !== "") {
      // try again if index is already filled
      return this.getMove();
    }
    return move;
  }
}

class DisplayController {
  grids = document.querySelectorAll(".grid");
  gameOverModal = document.querySelector(".game__over");
  overlay = document.querySelector(".overlay");
  labelTurn = document.querySelector(".turn");
  resultLabel = document.querySelector(".result");
  playerLabel = document.querySelector(".player__label");
  btnSinglePlayer = document.querySelector(".single");
  btnMultiPlayer = document.querySelector(".multi");

  constructor() {
    this.grids.forEach((grid) =>
      grid.addEventListener("click", gameController.play)
    );

    this.btnSinglePlayer.onclick = this.switchMode.bind(this);

    this.btnMultiPlayer.onclick = this.switchMode.bind(this);
    document

      .querySelectorAll(".btn")
      .forEach((btn) => btn.addEventListener("click", gameController.reset));
  }

  updateBoard(field, sign) {
    field.textContent = sign;
    field.classList.add(sign);
  }

  // change current player label after each turn
  SwitchTurnLabel(newPlayer) {
    this.labelTurn.textContent = `${newPlayer}'s turn`;
  }

  switchMode(e) {
    if (e.target.classList.contains("active")) return;

    gameController.reset();

    this.btnMultiPlayer.classList.remove("active");
    this.btnSinglePlayer.classList.remove("active");

    gameController.multiplayer = !gameController.multiplayer;

    e.target.classList.add("active");

    if (e.target.textContent === "Singleplayer") {
      this.playerLabel.textContent = "Computer";
      gameController.playerO.setType("Computer");
    } else {
      this.playerLabel.textContent = "Player O";
      gameController.playerO.setType("Player O");
    }
  }

  resetBoard() {
    this.grids.forEach((grid) => {
      grid.textContent = "";
      grid.classList.remove("X");
      grid.classList.remove("O");
    });
    this.gameOverModal.classList.add("hidden");
    this.overlay.classList.add("hidden");
    this.SwitchTurnLabel("Player X");
  }

  gameOver(winner) {
    if (winner === "draw") {
      this.resultLabel.textContent = "Its a Tie!";
    } else {
      this.resultLabel.textContent = `${winner} Has Won!!`;
    }

    this.gameOverModal.classList.remove("hidden");
    this.overlay.classList.remove("hidden");
  }
}

const gameController = (function () {
  const playerX = new Player("X", "Player X");
  let playerO = new Player("O", "Player O");
  let currentPlayer = playerX;
  let isPlaying = true;

  function play() {
    if (this.textContent !== "" || !isPlaying) return;

    // Multi player
    const index = +this.dataset.index;

    displayController.updateBoard(this, currentPlayer.getSign());
    gameBoard.setState(index, currentPlayer.getSign());

    check(index);

    // Single player
    if (playerO.isBot()) {
      isPlaying = false;

      if (gameBoard.states.every((state) => state !== "")) return;

      const botMove = computerPlay.getMove();
      const botField = document.querySelector(`[data-index="${botMove}"]`);

      setTimeout(() => {
        displayController.updateBoard(botField, "O");
        isPlaying = true;
      }, 700);

      gameBoard.setState(botMove, "O");

      setTimeout(() => check(botMove), 800);
    }
  }

  function check(index) {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // check for win
    if (
      winConditions
        .filter((condition) => condition.includes(index))
        .some((condition) =>
          condition.every(
            (i) => gameBoard.states[i] === currentPlayer.getSign()
          )
        )
    ) {
      displayController.gameOver(currentPlayer.getType());
      isPlaying = false;

      // check for draw
    } else if (gameBoard.states.every((state) => state)) {
      displayController.gameOver("draw");
      isPlaying = false;
    } else {
      // switch player
      currentPlayer = currentPlayer === playerX ? playerO : playerX;
      displayController.SwitchTurnLabel(currentPlayer.getType());
    }
  }

  function reset() {
    gameBoard.resetStates();
    currentPlayer = playerX;
    displayController.resetBoard();
    isPlaying = true;
  }

  return { playerO, play, check, reset };
})();

const gameBoard = new GameBoard();

const computerPlay = new ComputerPlay();

const displayController = new DisplayController();
