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
scoreContainer.innerHTML = `Your score is: ${score}`;

const circleButton = document.getElementsByClassName('add-circle-btn')[0];
circleButton.onclick = () => {
    createRedCircle();
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
    const unmountCircle = (listOfCircleIds, circle) => {
        listOfCircleIds.forEach((element, index) => {
            if (element.id === circle.id) {
                updateScore('remove');
                scoreContainer.innerHTML = `Your score is: ${score}`;;
                listOfCircleIds.splice(index, 1);
                circle.remove();
            }
        })
    }
    const unmountCircleByClick = (listOfCircleIds, circle) => {
        listOfCircleIds.forEach((element, index) => {
            if (element.id === circle.id) {
                updateScore('add');
                scoreContainer.innerHTML = `Your score is: ${score}`;;
                listOfCircleIds.splice(index, 1);
                circle.remove();
            }
        })
    }
    /* Initialize circle */
    const circle = document.createElement('div');
    circle.className = `${colour}-circle`;

    /* Set circle id and push it to array to kepp track of it */
    const circleId = Math.round(Math.random() * (100000 - 1) + 1);
    circle.id = circleId;

    /* Setting onclick property */
    circle.addEventListener('mousedown', (e) => {
        if (e.button === 0 && e.target.className.includes('red')) 
        {      
            unmountCircleByClick(listOfCircleIds, circle);
        }
        if (e.button === 2 && e.target.className.includes('blue'))
        {
            unmountCircleByClick(listOfCircleIds, circle);
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
    console.log(' ', isUniqueCoordinates(coordinates));
    circle.style.left = coordinates.x +'px';
    circle.style.top = coordinates.y +'px';
    listOfCircleIds.push({
        id: circle.id,
        x: circle.style.left,
        y: circle.style.top,
    });
    gameContainer.appendChild(circle);

    /* Set self-destruct timer */
    // setTimeout(() => {unmountCircle(listOfCircleIds, circle)}, 1800);
};

const startGame = () => {
    timer = setInterval(() => {
        const color = Math.random() >= 0.4 ? 'red' : 'blue';
        createRedCircle(color);
    }, 700);
}

const stopGame = () => {
    const clearFiels = (listOfCircleIds) => {
        listOfCircleIds.forEach(circl => {
            const circle = document.getElementById(circl.id);
            circle.remove();
        });
        listOfCircleIds = [];
    }
    //clearFiels(listOfCircleIds);
    clearInterval(timer);
}

