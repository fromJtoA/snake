let cellsList = document.querySelectorAll('div.main__cell');
let maxIndex = Math.sqrt(cellsList.length);
let cells = [];
let snake;
let xHead = 36;
let yHead = 32;
let exTail;
let cellEat;
let needObstacle = true;
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
    
    for (let i = 0; i < maxIndex; i++) {
        for (let j = 0; j < maxIndex; j++) {
            if ((i % 2 == 1) && (j % 2 == 1)) { cells[i][j].classList.add('main__cell_gray') };
        }
        //???????????
    }
}

function makeSnake() {
    cells[36][32].classList.add('snake', 'snake_head');
    cells[37][32].classList.add('snake');
    cells[38][32].classList.add('snake', 'snake_tail');

    let snakeList = document.querySelectorAll('div.snake, div.snake_head');
    snake = Array.prototype.slice.call(snakeList);
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
    cheakEating();
    cheakLose();
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
    cells[xRandom][yRandom].classList.contains('eat') ||
    cells[xRandom][yRandom].classList.contains('obstacle') ||
    (((xHead + 7) % maxIndex > xRandom) && ((xHead - 7 + maxIndex) % maxIndex < xRandom)) || 
    (((yHead + 7) % maxIndex > yRandom) && ((yHead - 7 + maxIndex) % maxIndex < yRandom)));
    //????????????????????????????
    return cells[xRandom][yRandom];
}

function makeEat() {
    cellEat = getRandomCell();
    cellEat.classList.add('eat');
}

function makeObstacle() {
    for (let i = 0; i < maxIndex; i++) {
        getRandomCell().classList.add('obstacle');
    }
}

function removeObstacle() {
    let obstacles = document.querySelectorAll('div.obstacle');
    for (i of obstacles) {
        i.classList.remove('obstacle');
    }
}

function changeObstacle(needObstacle) {
    if (needObstacle) {
        intervalOfChangeObstacle = setInterval(() => { removeObstacle(); makeObstacle(); }, 30000 - difficulty * 5000);
    }
}

function cheakEating() {
    if (document.querySelectorAll('div.snake_head.eat').length > 0) {
        document.querySelector('div.snake_head.eat').classList.remove('eat');
        exTail.classList.add('snake');
        snake.push(exTail);
        deleteHeadAndTail();
        makeHeadAndTail();
        makeEat();
    }
}

function cheakLose() {
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
}

function changeMain() {

}