const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector(".score");
const blockHeight = 20;
const blockWidth = 100;
let score = 0;

const boardWidth = 560;
const boardHeight = 300;

const ballDiameter = 20;
let xDirection = 2;
let yDirection = 2;

let ballTimerId;

const userStart = [230, 10];
let currentUserPosition = userStart;

const ballStart = [270, 40];
let currentBallPosition = ballStart;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

//create blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

//draw blocks
function addBlocks() {
  for (let index = 0; index < blocks.length; index++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[index].bottomLeft[0] + "px";
    block.style.bottom = blocks[index].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

addBlocks();

//draw user
const user = document.createElement("div");
user.classList.add("user");
drawUser();
grid.appendChild(user);

function drawUser() {
  user.style.left = currentUserPosition[0] + "px";
  user.style.bottom = currentUserPosition[1] + "px";
}

function drawBall() {
  ball.style.left = currentBallPosition[0] + "px";
  ball.style.bottom = currentBallPosition[1] + "px";
}

//move user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentUserPosition[0] > 0) {
        currentUserPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentUserPosition[0] < boardWidth - blockWidth) {
        currentUserPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);

//draw ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

//move ball
function moveBall() {
  currentBallPosition[0] += xDirection;
  currentBallPosition[1] += yDirection;
  drawBall();
  checkCollisions();
}

moveBall();

ballTimerId = setInterval(moveBall, 30);

function checkCollisions() {
  checkForBlockCollision();
  checkForWallCollisions();
  checkForUserCollision();
  checkForGameOver();
}

function checkForUserCollision() {
  if (
    currentBallPosition[0] > currentUserPosition[0] &&
    currentBallPosition[0] < currentUserPosition[0] + blockWidth &&
    currentBallPosition[1] > currentUserPosition[1] &&
    currentBallPosition[1] < currentUserPosition[1] + blockHeight
  ) {
    changeDirection();
  }
}

function checkForBlockCollision() {
  for (let index = 0; index < blocks.length; index++) {
    let block = blocks[index];
    if (
      currentBallPosition[0] > block.bottomLeft[0] &&
      currentBallPosition[0] < block.bottomRight[0] &&
      currentBallPosition[1] + ballDiameter > block.bottomLeft[1] &&
      currentBallPosition[1] < block.topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[index].remove("block");
      blocks.splice(index, 1);
      changeDirection();
      scoreDisplay.innerHTML = ++score;
      checkForWin();
    }
  }
}

function checkForWin() {
  if (blocks.length === 0) {
    clearInterval(ballTimerId);
    scoreDisplay.innerHTML = `You Win!`;
    document.removeEventListener("keydown", moveUser);
  }
}

function checkForGameOver() {
  if (currentBallPosition[1] <= 0) {
    clearInterval(ballTimerId);
    scoreDisplay.innerHTML = `${score} You lose!`;
    document.removeEventListener("keydown", moveUser);
  }
}

function checkForWallCollisions() {
  if (currentBallPosition[0] >= boardWidth - ballDiameter) {
    changeDirection();
  }
  if (currentBallPosition[1] >= boardHeight - ballDiameter) {
    changeDirection();
  }
  if (currentBallPosition[0] <= 0) {
    changeDirection();
  }
}

function changeDirection() {
  if (xDirection == 2 && yDirection == 2) {
    yDirection = -2;
    return;
  }
  if (xDirection == 2 && yDirection == -2) {
    xDirection = -2;
    return;
  }
  if (xDirection == -2 && yDirection == -2) {
    yDirection = 2;
    return;
  }
  if (xDirection == -2 && yDirection == 2) {
    xDirection = 2;
    return;
  }
}
