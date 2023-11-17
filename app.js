const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const runner = {
    x: 50,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    isJumping: false,
    jumpHeight: 100,
    jumpCount: 0,
    speed: 5
};

const obstacles = [];
let score = 0;

window.addEventListener("keydown", jump);

function jump(event) {
    if (event.code === "Space" && !runner.isJumping) {
        runner.isJumping = true;
    }
}

function update() {
    if (runner.isJumping) {
        runner.y -= 5;
        runner.jumpCount += 5;

        if (runner.jumpCount >= runner.jumpHeight) {
            runner.isJumping = false;
            runner.jumpCount = 0;
        }
    } else if (runner.y < canvas.height - runner.height) {
        runner.y += 5;
    }

    // Move obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= runner.speed;

        // Check for collision with obstacles
        if (
            runner.x < obstacles[i].x + obstacles[i].width &&
            runner.x + runner.width > obstacles[i].x &&
            runner.y < obstacles[i].y + obstacles[i].height &&
            runner.y + runner.height > obstacles[i].y
        ) {
            gameOver();
        }

        // Remove obstacles that are off-screen
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            i--;
        }
    }

    // Generate new obstacles
    if (Math.random() < 0.02) {
        const obstacle = {
            x: canvas.width,
            y: canvas.height - 50,
            width: 20,
            height: 20,
        };
        obstacles.push(obstacle);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw runner
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(runner.x, runner.y, runner.width, runner.height);

    // Draw obstacles
    ctx.fillStyle = "#FF0000";
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }

    // Draw score
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, 10, 20);
}

function gameOver() {
    alert("Game Over! Score: " + score);
    document.location.reload();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();