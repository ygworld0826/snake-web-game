const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let gameOver = false;
let score = 0;
let started = false;

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    if (!started) {
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('스페이스바를 눌러 시작하세요', canvas.width/2, canvas.height/2);
        ctx.textAlign = 'start';
    }
    if (gameOver) {
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('게임 오버! 스페이스바로 재시작', canvas.width/2, canvas.height/2);
        ctx.textAlign = 'start';
    }
}

function update() {
    if (!started || gameOver) return;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        return;
    }

    // Self collision
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            gameOver = true;
            return;
        }
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Prevent food spawning on the snake
    for (let part of snake) {
        if (food.x === part.x && food.y === part.y) {
            placeFood();
            return;
        }
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: 5, y: 5 };
    gameOver = false;
    score = 0;
    started = false;
}

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}

document.addEventListener('keydown', e => {
    if (!started && e.code === 'Space') {
        started = true;
        direction = { x: 1, y: 0 };
    } else if (gameOver && e.code === 'Space') {
        resetGame();
        started = true;
        direction = { x: 1, y: 0 };
    } else if (started && !gameOver) {
        switch (e.key) {
            case 'ArrowUp': if (direction.y !== 1) direction = { x: 0, y: -1 }; break;
            case 'ArrowDown': if (direction.y !== -1) direction = { x: 0, y: 1 }; break;
            case 'ArrowLeft': if (direction.x !== 1) direction = { x: -1, y: 0 }; break;
            case 'ArrowRight': if (direction.x !== -1) direction = { x: 1, y: 0 }; break;
        }
    }
});

gameLoop();
