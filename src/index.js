import './index.css';
import './reset.css';

const gameContainer = document.getElementsByClassName('game-field')[0];
const redAudio = document.getElementsByClassName('audio-red')[0];
const blueAudio = document.getElementsByClassName('audio-blue')[0];
const scoreContainer =  document.getElementsByClassName('score-field')[0];
const comboContainer =  document.getElementsByClassName('combo-field')[0];

/*
gameContainer.onclick = () => {
    gameContainer.classList.add('--shaking');   
};

gameContainer.addEventListener('animationend', () => {
    gameContainer.className = 'game-field';
});
*/

gameContainer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

let combo = 0;
let circlesSize = 80;
let listOfCircleIds = [];
let timer;
let score = 0;
let counter = 0;
let isGameStarted = false;

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

const updateDOM = () => {
    scoreContainer.innerHTML = `Your score is: ${score}`;
    comboContainer.innerHTML = `Combo: ${combo}`;
}

updateDOM();

const updateScore = (action) => {
    if (action === 'add') {
        score = score + 100;
        updateDOM();
    }
    if (action === 'remove') {
        score = score - 100;
        updateDOM();
    }
}

const updateCombo = (action) => {
    if (action === 'add') {
        combo = combo + 1;
        updateDOM();
    }
    if (action === 'break') {
        combo = 0;
        updateDOM();
    }
}

const createRedCircle = (colour) => {
    let isCircleClicked = false;
    const getRandomCoordinates = () => {
        const containerSize = {w: 1025 - circlesSize, h: 625 - circlesSize};
        const getRandomArbitrary = (min, max) => {
            return Math.round(Math.random() * (max - min) + min);
        }
        const x = getRandomArbitrary(40, containerSize.w);
        const y = getRandomArbitrary(40, containerSize.h);
        const something = listOfCircleIds.every(circle => {
            console.log(x - parseInt((circle.x.split('p')[0])));
            return  (x - parseInt((circle.x.split('p')[0]))) >= 150 
        });
        console.log('something: ', something);
        return {
            x,
            y,
        }
    }
    const unmountCircleByTimeOut = (listOfCircleIds, circle) => {
        const scoreText = document.createElement('div');
        circle.className = 'score-text';
        circle.innerHTML = '';
        scoreText.innerHTML = '-100';
        circle.appendChild(scoreText);
        updateScore('remove');
        updateCombo('break');
        setTimeout(() => {
            listOfCircleIds.forEach((element, index) => {
            if (element.id === circle.id) {
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
        updateScore('add');
        updateCombo('add');
        circle.appendChild(scoreText);
        setTimeout(() => {
            listOfCircleIds.forEach((element, index) => {
                if (element.id === circle.id) {
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
    circle.style.width = `${circlesSize}px`;
    circle.style.height = `${circlesSize}px`;
    circle.style.lineHeight = `${circlesSize}px`;
    counter = counter + 1;

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
            redAudio.play()     
            unmountCircleByClick(listOfCircleIds, circle);
        } else if (e.button === 2 && e.target.className.includes('red')) {
            unmountCircleByTimeOut(listOfCircleIds, circle);
        } else if (e.button === 2 && e.target.className.includes('blue')) {
            isCircleClicked = true;
            blueAudio.play()
            unmountCircleByClick(listOfCircleIds, circle);
        } else if (e.button === 0 && e.target.className.includes('blue')) {
            unmountCircleByTimeOut(listOfCircleIds, circle);
        }
    }

    /* Mount circle in a random place */
    let coordinates = getRandomCoordinates();
    circle.style.left = coordinates.x +'px';
    circle.style.top = coordinates.y +'px';
    listOfCircleIds.push({
        id: circle.id,
        x: circle.style.left,
        y: circle.style.top,
    });
    gameContainer.appendChild(circle);

    /* Set self-destruct timer */
    setTimeout(() => {
        if (!isCircleClicked) {
            unmountCircleByTimeOut(listOfCircleIds, circle);
            return;
        }}, 1300);
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

