import './index.css';
import './reset.css';

const gameContainer = document.getElementsByClassName('game-field')[0];
const listOfCircles = [];

const createCircle = () => {
    const getRandomCoordinates = () => {
        const containerSize = {w: gameContainer.clientWidth - 40, h: gameContainer.clientHeight - 40};
        const getRandomArbitrary = (min, max) => {
            console.log('max: ', max);
            return Math.round(Math.random() * (max - min) + min);
        }
        return {
            x: getRandomArbitrary(40, containerSize.w),
            y: getRandomArbitrary(40, containerSize.h),
        }
    }
    const circle = document.createElement('div');
    circle.className = 'circle';
    const coordinates = getRandomCoordinates();
    console.log('coordinates: ', coordinates);
    circle.style.left = coordinates.x +'px';
    circle.style.top = coordinates.y +'px';
    gameContainer.appendChild(circle);
};
createCircle();
