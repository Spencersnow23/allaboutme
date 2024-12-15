const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;  // Size of each square
const rows = canvas.height / scale;
const columns = canvas.width / scale;

// Snake and food initialization
let snake;
let food;
let score = 0;

(function setup() {
    snake = new Snake();
    food = new Food();
    window.setInterval(update, 100);  // Update the game every 100 ms
    window.addEventListener("keydown", e => {
        const direction = e.key.replace("Arrow", "").toLowerCase();
        snake.changeDirection(direction);
    });
})();

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.move();
    snake.draw();
    food.draw();
    if (snake.eat(food)) {
        food = new Food();
        score++;
    }
    if (snake.collide()) {
        alert("Game Over! Your score: " + score);
        score = 0;
        snake = new Snake();
    }
}

function Snake() {
    this.snakeArray = [{ x: 5, y: 5 }];
    this.direction = 'right';

    this.move = function() {
        const head = this.snakeArray[0];
        let newHead;

        if (this.direction === 'up') {
            newHead = { x: head.x, y: head.y - 1 };
        } else if (this.direction === 'down') {
            newHead = { x: head.x, y: head.y + 1 };
        } else if (this.direction === 'left') {
            newHead = { x: head.x - 1, y: head.y };
        } else if (this.direction === 'right') {
            newHead = { x: head.x + 1, y: head.y };
        }

        this.snakeArray.unshift(newHead);
        this.snakeArray.pop();
    };

    this.draw = function() {
        ctx.fillStyle = "green";
        for (let i = 0; i < this.snakeArray.length; i++) {
            const part = this.snakeArray[i];
            ctx.fillRect(part.x * scale, part.y * scale, scale, scale);
        }
    };

    this.changeDirection = function(newDirection) {
        if (newDirection === 'up' && this.direction !== 'down') {
            this.direction = 'up';
        } else if (newDirection === 'down' && this.direction !== 'up') {
            this.direction = 'down';
        } else if (newDirection === 'left' && this.direction !== 'right') {
            this.direction = 'left';
        } else if (newDirection === 'right' && this.direction !== 'left') {
            this.direction = 'right';
        }
    };

    this.eat = function(food) {
        const head = this.snakeArray[0];
        if (head.x === food.x && head.y === food.y) {
            this.snakeArray.push({});
            return true;
        }
        return false;
    };

    this.collide = function() {
        const head = this.snakeArray[0];
        // Check if the snake hits the walls
        if (head.x < 0 || head.y < 0 || head.x >= columns || head.y >= rows) {
            return true;
        }
        // Check if the snake hits its own body
        for (let i = 1; i < this.snakeArray.length; i++) {
            if (head.x === this.snakeArray[i].x && head.y === this.snakeArray[i].y) {
                return true;
            }
        }
        return false;
    };
}

function Food() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);

    this.draw = function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    };
}
