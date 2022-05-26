let cellsList = document.querySelectorAll('div.main__cell');
let maxIndex = Math.sqrt(cellsList.length);
let cells = [];
let snake = [];
let xHead = 36;
let yHead = 32;
let exTail;
let cellEat;
let cellBonusEat;
let countEat = 0;
let cellsObstacles = [];
let bonusTimer = 10000;
let needObstacle = false;
let direction = 'left';
let intervalOfMoving;
let intervalOfChangeObstacle;
////////////////////////////
let difficulty = 5.5;

init();
makeSnake();
listenForMove();
makeEat();
changeObstacle(needObstacle);

function init() {
    for (let i = 0; i < maxIndex; i++) {
        cells.push([]);
    }
    for (let i = 0; i < cellsList.length; i++) {
        cells[i % maxIndex].push(cellsList[i]);
    }
}

function makeSnake() {
    cells[36][32].classList.add('snake', 'snake_head');
    cells[37][32].classList.add('snake');
    cells[38][32].classList.add('snake', 'snake_tail');

    snake.push(cells[36][32]);
    snake.push(cells[37][32]);
    snake.push(cells[38][32]);
}

function deleteHeadAndTail() {
    snake[0].classList.remove('snake_head');
    snake[snake.length - 1].classList.remove('snake_tail');
}

function makeHeadAndTail() {
    snake[0].classList.add('snake_head');
    snake[snake.length - 1].classList.add('snake_tail');
}

function listenForMove() {
    document.addEventListener('keydown', (e) => {
        if (e.defaultPrevented) {
            return;
        }
        if ((e.key == 'w' || e.key == 'W' || e.key == 'ц' || e.key == 'Ц' || e.key == 'ArrowUp')
            && direction != 'down' && direction != 'up') {
            clearInterval(intervalOfMoving);
            moving(shiftUp);
        }
        if ((e.key == 's' || e.key == 'S' || e.key == 'ы' || e.key == 'Ы' || e.key == 'ArrowDown')
            && direction != 'up' && direction != 'down') {
            clearInterval(intervalOfMoving);
            moving(shiftDown);
        }
        if ((e.key == 'a' || e.key == 'A' || e.key == 'ф' || e.key == 'Ф' || e.key == 'ArrowLeft')
            && direction != 'right' && direction != 'left') {
            clearInterval(intervalOfMoving);
            moving(shiftLeft);
        }
        if ((e.key == 'd' || e.key == 'D' || e.key == 'в' || e.key == 'В' || e.key == 'ArrowRight')
            && direction != 'left' && direction != 'right') {
            clearInterval(intervalOfMoving);
            moving(shiftRight);
        }
        e.preventDefault();
    }, true);
}

function shift() {
    cells[xHead][yHead].classList.add('snake');
    deleteHeadAndTail();
    snake.unshift(cells[xHead][yHead]);
    exTail = snake[snake.length - 1];
    snake.pop().classList.remove('snake');
    makeHeadAndTail();
    checkLose();
    checkEat();
}

function shiftUp() {
    yHead = (yHead - 1 + maxIndex) % maxIndex;
    shift();
    direction = 'up';
}

function shiftDown() {
    yHead = (yHead + 1) % maxIndex;
    shift();
    direction = 'down';
}

function shiftLeft() {
    xHead = (xHead - 1 + maxIndex) % maxIndex;
    shift();
    direction = 'left';
}

function shiftRight() {
    xHead = (xHead + 1) % maxIndex;
    shift();
    direction = 'right';
}

function moving(func) {
    intervalOfMoving = setInterval(func, 600 - difficulty * 100);
}

function getRandomCell() {
    let xRandom;
    let yRandom;
    do {
        xRandom = Math.floor(Math.random() * 63.99999);
        yRandom = Math.floor(Math.random() * 63.99999);
    } while (cells[xRandom][yRandom].classList.contains('snake') ||
    cells[xRandom][yRandom].classList.contains('bonus_eat') ||
    cells[xRandom][yRandom].classList.contains('eat') ||
    cells[xRandom][yRandom].classList.contains('obstacle') ||
        (((xHead + 7) % maxIndex > xRandom) && ((xHead - 7 + maxIndex) % maxIndex < xRandom) &&
            ((yHead + 7) % maxIndex > yRandom) && ((yHead - 7 + maxIndex) % maxIndex < yRandom)));
    return cells[xRandom][yRandom];
}

function getRandomBonusCell() {
    let xRandom;
    let yRandom;
    do {
        xRandom = Math.floor(Math.random() * 63.99999);
        yRandom = Math.floor(Math.random() * 63.99999);
    } while (cells[xRandom][yRandom].classList.contains('snake') ||
    cells[xRandom][yRandom].classList.contains('bonus_eat') ||
    cells[xRandom][yRandom].classList.contains('eat') ||
    cells[xRandom][yRandom].classList.contains('obstacle') ||
        (((xHead + 20) % maxIndex < xRandom) && ((xHead - 20 + maxIndex) % maxIndex > xRandom) &&
            ((yHead + 20) % maxIndex < yRandom) && ((yHead - 20 + maxIndex) % maxIndex > yRandom)));
    return cells[xRandom][yRandom];
}

function makeEat() {
    cellEat = getRandomCell();
    cellEat.classList.add('eat');
}

function makeBonusEat() {
    cellBonusEat = getRandomBonusCell();
    cellBonusEat.classList.add('bonus_eat');
}

function makeObstacle() {
    for (let i = 0; i < maxIndex; i++) {
        cellsObstacles.push(getRandomCell());
        cellsObstacles[i].classList.add('obstacle');
    }
}

function removeObstacle() {
    for (i of cellsObstacles) {
        i.classList.remove('obstacle');
    }
    cellsObstacles = [];
}

function changeObstacle(needObstacle) {
    if (needObstacle) {
        intervalOfChangeObstacle = setInterval(() => { removeObstacle(); makeObstacle(); }, 30000 - difficulty * 5000);
    }
}

function removeBonusEat() {
    setTimeout(() => cellBonusEat.classList.remove('bonus_eat'), bonusTimer);
}

function checkEat() {
    if (document.querySelectorAll('div.snake_head.eat, div.snake_head.bonus_eat').length > 0) {
        let eat = document.querySelector('div.snake_head.eat, div.snake_head.bonus_eat');
        let eatClasses = Array.prototype.slice.call(eat.classList);
        if (eatClasses.includes('eat')) {
            eat.classList.remove('eat');
            countEat++;
            exTail.classList.add('snake');
            snake.push(exTail);
            deleteHeadAndTail();
            makeHeadAndTail();
            makeEat();
            checkBonusTime();
        } else {
            eat.classList.remove('bonus_eat');
            exTail.classList.add('snake');
            snake.push(exTail);
            deleteHeadAndTail();
            makeHeadAndTail();
            makeEat();
        }
    }
}

function checkBonusTime() {
    if (countEat % 5 == 0) {
        countEat = 0;
        makeBonusEat();
        removeBonusEat();
    }
}

function checkLose() {
    if ((snake.length != new Set(snake).size) ||
        (document.querySelectorAll('div.snake_head.obstacle').length > 0)) {
        clearInterval(intervalOfMoving);
        clearInterval(intervalOfChangeObstacle);
        removeAll();
        changeMain();
    }
}

function removeAll() {
    removeObstacle();
    cellEat.classList.remove('eat');
    for (i of snake) {
        i.classList.remove('snake_head', 'snake');
    }
    snake = [];
}

function changeMain() {

}