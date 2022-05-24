let cellsList = document.querySelectorAll('div.main__cell');
let cells = [];
let maxIndex = Math.sqrt(cellsList.length);
for (let i = 0; i < maxIndex; i++) {
    cells.push([]);
}
for (let i = 0; i < cellsList.length; i++) {
    cells[i % maxIndex].push(cellsList[i]);
}

let snake;
let xHead = 36;
let yHead = 32;
let direction = 'left';
let intervalOfMoving;
let intervalOfChangeObstacle;
////////////////////////////
let difficulty = 0.5;

makeSnake();
listenForMove();
makeEat();
changeObstacle();

function makeSnake() {
    cells[36][32].classList.add('snake');
    cells[37][32].classList.add('snake');
    cells[38][32].classList.add('snake');

    let snakeList = document.querySelectorAll('div.snake');
    snake = Array.prototype.slice.call(snakeList);
    makeHeadAndTail();
}

function deleteHeadAndTail() {
    for (let i = 0; i < snake.length; i++) {
        snake[i].classList.remove('snake_head', 'snake_tail');
    }
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

function shiftUp() {
    cells[xHead][(yHead - 1 + maxIndex) % maxIndex].classList.add('snake');
    snake.unshift(cells[xHead][(yHead - 1 + maxIndex) % maxIndex]);
    yHead = (yHead - 1 + maxIndex) % maxIndex;
    deleteHeadAndTail();
    snake.pop().classList.remove('snake');
    makeHeadAndTail();
    direction = 'up';
}

function shiftDown() {
    cells[xHead][(yHead + 1) % maxIndex].classList.add('snake');
    snake.unshift(cells[xHead][(yHead + 1) % maxIndex]);
    yHead = (yHead + 1) % maxIndex;
    deleteHeadAndTail();
    snake.pop().classList.remove('snake');
    makeHeadAndTail();
    direction = 'down';
}

function shiftLeft() {
    cells[(xHead - 1 + maxIndex) % maxIndex][yHead].classList.add('snake');
    snake.unshift(cells[(xHead - 1 + maxIndex) % maxIndex][yHead]);
    xHead = (xHead - 1 + maxIndex) % maxIndex;
    deleteHeadAndTail();
    snake.pop().classList.remove('snake');
    makeHeadAndTail();
    direction = 'left';
}

function shiftRight() {
    cells[(xHead + 1) % maxIndex][yHead].classList.add('snake');
    snake.unshift(cells[(xHead + 1) % maxIndex][yHead]);
    xHead = (xHead + 1) % maxIndex;
    deleteHeadAndTail();
    snake.pop().classList.remove('snake');
    makeHeadAndTail();
    direction = 'right';
}

function moving(func) {
    intervalOfMoving = setInterval(func, 1000 * difficulty);
}

function getRandomCell() {
    let xRandom;
    let yRandom;
    do {
        xRandom = Math.floor(Math.random() * 63.99999);
        yRandom = Math.floor(Math.random() * 63.99999);
    } while (cells[xRandom][yRandom].classList.contains('snake') ||
    cells[xRandom][yRandom].classList.contains('eat') ||
    cells[xRandom][yRandom].classList.contains('obstacle') ||
    (((xHead + 7) % maxIndex > xRandom) && ((xHead - 7 + maxIndex) % maxIndex < xRandom)) ||
        (((yHead + 7) % maxIndex > yRandom) && ((yHead - 7 + maxIndex) % maxIndex < yRandom)));
    return cells[xRandom][yRandom];
}

function makeEat() {
    getRandomCell().classList.add('eat');
}

function makeObstacle() {
    for (let i = 0; i < 50; i++) {
        getRandomCell().classList.add('obstacle');
    }
}

function deleteObstacle() {
    let obstacles = document.querySelectorAll('div.obstacle');
    for (i of obstacles) {
        i.classList.remove('obstacle');
    }
}

function changeObstacle() {
    intervalOfChangeObstacle = setInterval(() => {deleteObstacle(); makeObstacle();}, 5000);
}
