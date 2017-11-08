import './index.css';
import './reset.css';

const FIELD_WIDTH = 825;
const FIELD_HEIGHT = 525;

const gameContainer = document.getElementsByClassName('game-field')[0];
const redAudio = document.getElementsByClassName('audio-red')[0];
const blueAudio = document.getElementsByClassName('audio-blue')[0];
const scoreContainer = document.getElementsByClassName('score-field')[0];
const comboContainer = document.getElementsByClassName('combo-field')[0];

gameContainer.style.width = `${FIELD_WIDTH}px`;
gameContainer.style.height = `${FIELD_HEIGHT}px`;

gameContainer.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

let combo = 0;
const circlesSize = 80;
let listOfCircleIds = [];
let timer;
let score = 0;
let counter = 0;
let isGameStarted = false;

const updateScoreNodes = () => {
  scoreContainer.innerHTML = `Your score is: ${score}`;
  comboContainer.innerHTML = `Combo: ${combo}`;
};

updateScoreNodes();

const updateScore = (action) => {
  if (action === 'add') {
    score += 100;
    updateScoreNodes();
  }
  if (action === 'remove') {
    score -= 100;
    updateScoreNodes();
  }
};

const updateCombo = (action) => {
  if (action === 'add') {
    combo += 1;
    updateScoreNodes();
  }
  if (action === 'break') {
    combo = 0;
    updateScoreNodes();
  }
};

const createRedCircle = (colour) => {
  let isCircleClicked = false;
  const getRandomCoordinates = () => {
    const containerSize = { w: FIELD_WIDTH - circlesSize, h: FIELD_HEIGHT - circlesSize };
    const getRandomArbitrary = (min, max) => Math.round(Math.random() * (max - min) + min);
    const x = getRandomArbitrary(40, containerSize.w);
    const y = getRandomArbitrary(40, containerSize.h);
    listOfCircleIds.every((circle) => {
      return (x - parseInt((circle.x.split('p')[0]), 10)) >= 150;
    });
    return {
      x,
      y,
    };
  };

  const unmountCircleByTimeOut = (circle) => {
    const scoreText = document.createElement('div');
    const currentCircle = circle;
    currentCircle.className = 'score-text';
    currentCircle.innerHTML = '';
    scoreText.innerHTML = '-100';
    currentCircle.appendChild(scoreText);
    updateScore('remove');
    updateCombo('break');
    setTimeout(() => {
      listOfCircleIds.forEach((element, index) => {
        if (element.id === currentCircle.id) {
          listOfCircleIds.splice(index, 1);
          currentCircle.remove();
          scoreText.remove();
        }
      });
    }, 250);
  };

  const unmountCircleByClick = (circle) => {
    const scoreText = document.createElement('div');
    const currentCircle = circle;
    currentCircle.className = 'score-text';
    currentCircle.innerHTML = '';
    scoreText.innerHTML = '+100';
    updateScore('add');
    updateCombo('add');
    currentCircle.appendChild(scoreText);
    setTimeout(() => {
      listOfCircleIds.forEach((element, index) => {
        if (element.id === currentCircle.id) {
          listOfCircleIds.splice(index, 1);
          currentCircle.remove();
          scoreText.remove();
        }
      });
    }, 250);
  };

  /* Initialize circle */
  const circle = document.createElement('div');
  circle.className = `${colour}-circle`;
  circle.style.width = `${circlesSize}px`;
  circle.style.height = `${circlesSize}px`;
  circle.style.lineHeight = `${circlesSize}px`;
  counter += 1;

  /* Set circle id and push it to array to kepp track of it */
  const circleId = counter;
  circle.id = circleId;
  circle.innerHTML = circleId;
  circle.isClicked = false;

  circle.onmousedown = (e) => {
    e.stopPropagation();
    if (circle.isClicked) {
      e.preventDefault();
      return;
    }
    circle.isClicked = true;
    if (e.button === 0 && e.target.className.includes('red')) {
      isCircleClicked = true;
      redAudio.play();
      unmountCircleByClick(circle);
    } else if (e.button === 2 && e.target.className.includes('red')) {
      unmountCircleByTimeOut(circle);
    } else if (e.button === 2 && e.target.className.includes('blue')) {
      isCircleClicked = true;
      blueAudio.play();
      unmountCircleByClick(circle);
    } else if (e.button === 0 && e.target.className.includes('blue')) {
      unmountCircleByTimeOut(circle);
    }
  };

  /* Mount circle in a random place */
  const coordinates = getRandomCoordinates();
  circle.style.left = `${coordinates.x}px`;
  circle.style.top = `${coordinates.y}px`;
  listOfCircleIds.push({
    id: circle.id,
    x: circle.style.left,
    y: circle.style.top,
  });
  gameContainer.appendChild(circle);

  /* Set self-destruct timer */

  setTimeout(() => {
    if (!isCircleClicked) {
      unmountCircleByTimeOut(circle);
    }
  }, 1300);
};

const startGame = () => {
  if (!isGameStarted) {
    isGameStarted = !isGameStarted;
    timer = setInterval(() => {
      const color = Math.random() >= 0.4 ? 'red' : 'blue'; // randoming colors for circles, should do more red`s
      createRedCircle(color);
    }, 400);
  }
};

const stopGame = () => {
  const clearField = (listOfCircles) => {
    listOfCircles.forEach((circle) => {
      const domCircle = document.getElementById(circle.id); // get circles from dom
      domCircle.remove(); // call delete method in them
    });
    listOfCircleIds = []; // set list of circle id's empty for no reason
  };
  clearField(listOfCircleIds);
  clearInterval(timer);
  isGameStarted = !isGameStarted;
};

const circleButton = document.getElementsByClassName('add-circle-btn')[0];
circleButton.onclick = () => {
  createRedCircle('red');
};

const startGameButton = document.getElementsByClassName('start-game-btn')[0];
startGameButton.onclick = () => {
  startGame();
};

const endGameButton = document.getElementsByClassName('end-game-btn')[0];
endGameButton.onclick = () => {
  stopGame();
};

