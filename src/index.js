import './index.css';
import './reset.css';

const gameContainer = document.getElementsByClassName('game-field')[0];
gameContainer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
const scoreContainer =  document.getElementsByClassName('score-field')[0];
let listOfCircleIds = [];
let timer;
let score = 0;
let counter = 0;
let isGameStarted = false;
scoreContainer.innerHTML = `Your score is: ${score}`;

const circleButton = document.getElementsByClassName('add-circle-btn')[0];
circleButton.onclick = () => {
    createRedCircle('red');
}

const startGameButton = document.getElementsByClassName('start-game-btn')[0];
startGameButton.onclick = () => {
    startGame();
}

const endGameButton = document.getElementsByClassName('end-game-btn')[0];
endGameButton.onclick = () => {
    stopGame();
}

const updateScore = (action) => {
    if (action === 'add') {
        score = score + 100;
    }
    if (action === 'remove') {
        score = score - 100;
    }
}

const createRedCircle = (colour) => {
    const getRandomCoordinates = () => {
        const containerSize = {w: 600 - 60, h: 460 - 60};
        const getRandomArbitrary = (min, max) => {
            return Math.round(Math.random() * (max - min) + min);
        }
        return {
            x: getRandomArbitrary(40, containerSize.w),
            y: getRandomArbitrary(40, containerSize.h),
        }
    }
    const unmountCircleByTimeOut = (listOfCircleIds, circle) => {
        const scoreText = document.createElement('div');
        circle.className = 'score-text';
        circle.innerHTML = '';
        scoreText.innerHTML = '-100';
        circle.appendChild(scoreText);
        setTimeout(() => {
            listOfCircleIds.forEach((element, index) => {
            if (element.id === circle.id) {
                updateScore('remove');
                scoreContainer.innerHTML = `Your score is: ${score}`;;
                listOfCircleIds.splice(index, 1);
                circle.remove();
                scoreText.remove();
            }
        })
        }, 250);
        
    }
    const unmountCircleByClick = (listOfCircleIds, circle) => {
        const scoreText = document.createElement('div');
        circle.className = 'score-text';
        circle.innerHTML = '';
        scoreText.innerHTML = '+100';
        circle.appendChild(scoreText);
        setTimeout(() => {
            listOfCircleIds.forEach((element, index) => {
                if (element.id === circle.id) {
                    updateScore('add');
                    scoreContainer.innerHTML = `Your score is: ${score}`;;
                    listOfCircleIds.splice(index, 1);
                    circle.remove();   
                    scoreText.remove();      
                }
            });
        }, 250);
    }

    /* Initialize circle */
    const circle = document.createElement('div');
    circle.className = `${colour}-circle`;
    counter = counter + 1;

    /* Set circle id and push it to array to kepp track of it */
    const circleId = counter;
    circle.id = circleId;
    circle.innerHTML = circleId;
    circle.isClicked = false;

    /* Setting onclick property */
    circle.addEventListener('mousedown', (e) => {
        if (circle.isClicked) {
            e.preventDefault();
            return;
        }
        circle.isClicked = true;
        if (e.button === 0 && e.target.className.includes('red')) {     
            unmountCircleByClick(listOfCircleIds, circle);
        } else if (e.button === 2 && e.target.className.includes('red')) {
            unmountCircleByTimeOut(listOfCircleIds, circle);
        } else if (e.button === 2 && e.target.className.includes('blue')) {
            unmountCircleByClick(listOfCircleIds, circle);
        } else if (e.button === 0 && e.target.className.includes('blue')) {
            unmountCircleByTimeOut(listOfCircleIds, circle);
        }
    });

    /* Mount circle in a random place */
    let coordinates = getRandomCoordinates();
    const isUniqueCoordinates = (coordinates) => {
        const isUnique = listOfCircleIds.every(circle => {
            console.log('isUniqueCoordinatesX : ',
            coordinates.x + 80, parseInt((circle.x.split('p')[0])) + 80);
            console.log('isUniqueCoordinatesY : ',
            coordinates.y + 80, parseInt((circle.y.split('p')[0])) + 80);
            return (coordinates.x + 80 !== parseInt((circle.x.split('p')[0])) + 80) 
            || 
            (coordinates.y + 80 !== parseInt((circle.y.split('p')[0])) + 80);
        });
        return isUnique;
    };
    // console.log(' ', isUniqueCoordinates(coordinates));
    circle.style.left = coordinates.x +'px';
    circle.style.top = coordinates.y +'px';
    listOfCircleIds.push({
        id: circle.id,
        x: circle.style.left,
        y: circle.style.top,
    });
    gameContainer.appendChild(circle);

    /* Set self-destruct timer */
    setTimeout(() => {unmountCircleByTimeOut(listOfCircleIds, circle)}, 1300);
};

const startGame = () => {
    if (!isGameStarted) {
        isGameStarted = !isGameStarted;
        timer = setInterval(() => {
            const color = Math.random() >= 0.4 ? 'red' : 'blue';
            createRedCircle(color);
        }, 700);
        return;
    }
    return;
}

const stopGame = () => {
    const clearFiels = (listOfCircleIds) => {
        listOfCircleIds.forEach(circl => {
            const circle = document.getElementById(circl.id);
            circle.remove();
        });
        listOfCircleIds = [];
    }
    clearFiels(listOfCircleIds);
    clearInterval(timer);
}

