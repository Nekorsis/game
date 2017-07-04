import './index.css';
import './reset.css';

const gameContainer = document.getElementsByClassName('game-field')[0];
const listOfCircleIds = [];
let timer;

const circleButton = document.getElementsByClassName('add-circle-btn')[0];
circleButton.onclick = () => {
    createCircle();
}

const startGameButton = document.getElementsByClassName('start-game-btn')[0];
startGameButton.onclick = () => {
    startGame();
}

const endGameButton = document.getElementsByClassName('end-game-btn')[0];
endGameButton.onclick = () => {
    stopGame();
}

const createCircle = () => {
    const getRandomCoordinates = () => {
        const containerSize = {w: gameContainer.clientWidth - 60, h: gameContainer.clientHeight - 60};
        const getRandomArbitrary = (min, max) => {
            return Math.round(Math.random() * (max - min) + min);
        }
        return {
            x: getRandomArbitrary(40, containerSize.w),
            y: getRandomArbitrary(40, containerSize.h),
        }
    }
    /* Initialize circle */
    const circle = document.createElement('div');
    circle.className = 'circle';

    /* Set circle id and push it to array to kepp track of it */
    const circleId = Math.round(Math.random() * (100000 - 1) + 1);
    circle.id = circleId;
    listOfCircleIds.push(circle.id);

    /* Setting onclick property */
    circle.onclick = () => {
        listOfCircleIds.forEach((element, index) => {
            if (element === circle.id) {
            }
        })
        circle.remove();
    }

    /* Mount circle in a random place */
    const coordinates = getRandomCoordinates();
    circle.style.left = coordinates.x +'px';
    circle.style.top = coordinates.y +'px';
    gameContainer.appendChild(circle);
};

const startGame = () => {
    timer = setInterval(() => {
        createCircle();
    }, 1000);
}

const stopGame = () => {
    clearInterval(timer);
}

// createCircle();
