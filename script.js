"use strict";

// VARIABLES

const grids = document.querySelectorAll(".grid");
const title = document.querySelector(".title");
// store grid states in an array
const states = Array(9).fill("");
const chips = ["X", "O"];
// store turn in a variable
let turn = 0;
// store game state in a variable
let isPlaying = true;

// EVENT LISTENERS

grids.forEach((grid) => grid.addEventListener("click", play));

document.querySelector(".reset").addEventListener("click", reset);

// FUNCTIONS

function play(e) {
  // If the grid is already taken then return
  if (this.textContent !== "" || !isPlaying) return;

  // Draw on the grid
  this.textContent = chips[turn];
  this.classList.add(chips[turn]);

  // fill the states array for the given grid
  const index = this.dataset.index;
  states[index] = chips[turn];

  check(turn);
}

// check for diff scenarios
function check(player) {
  // check for win
  if (
    // horrizontal check
    (states[0] === states[1] && states[1] === states[2] && states[0]) ||
    (states[3] === states[4] && states[4] === states[5] && states[3]) ||
    (states[6] === states[7] && states[7] === states[8] && states[6]) ||
    // vertical check
    (states[0] === states[3] && states[3] === states[6] && states[0]) ||
    (states[1] === states[4] && states[4] === states[7] && states[1]) ||
    (states[2] === states[5] && states[5] === states[8] && states[2]) ||
    // diagonal check
    (states[0] === states[4] && states[4] === states[8] && states[0]) ||
    (states[2] === states[4] && states[4] === states[6] && states[2])
  ) {
    title.textContent = `Player ${player + 1} Wins!`;
    grids.forEach((grid) => grid.classList.add("game-over"));
    isPlaying = false;

    // check for draw
  } else if (states.every((state) => state)) {
    title.textContent = `It's a Tie!`;
    grids.forEach((grid) => grid.classList.add("game-over"));
    isPlaying = false;
  } else {
    // switch player
    turn = turn === 0 ? 1 : 0;
  }
}

// reset function
function reset() {
  states.fill("");
  turn = 0;
  isPlaying = true;
  grids.forEach((grid) => {
    grid.textContent = "";
    grid.classList.remove("X");
    grid.classList.remove("O");
    grid.classList.remove("game-over");
  });
  title.textContent = `Let's Play Tic Tac Toe!`;
}
