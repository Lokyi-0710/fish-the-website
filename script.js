const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");
const websiteInput = document.getElementById("websiteInput");
const goButton = document.getElementById("goButton");

let gameRunning = false;
let targetWebsite = "";  // Used to save the URL entered by the user

// Pre-game function: Click the "Go" button to save the URL and start the game
goButton.addEventListener("click", () => {
    targetWebsite = websiteInput.value;
    if (targetWebsite) {
        document.getElementById("inputBar").style.display = "none";
        gameContainer.style.display = "block"; // Show the game
        startButton.style.display = "block";
    } else {
        alert("Please enter a valid URL!");
    }
});

// Create game backgrounds, monsters and progress bars...
class Background { 
    constructor() {
        this.bubbles = [];
        this.fishes = [];
        // Fish PNG
        this.fishImage = new Image();
        this.fishImage.src =  'Fish2.png';
        
        // Bubbles
        for (let i = 0; i < 20; i++) {
            this.bubbles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 5 + 2,
                speed: Math.random() * 1 + 0.5
            });
        }

        // BG small fishes
        for (let i = 0; i < 5; i++) {
            this.fishes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 30 + 10, 
                speed: Math.random() * 2 + 1
            });
        }
    }

    update() {
        // Bubbles
        this.bubbles.forEach(bubble => {
            bubble.y -= bubble.speed;
            if (bubble.y < 0) bubble.y = canvas.height;
        });

        // BG small fishes
        this.fishes.forEach(fish => {
            fish.x += fish.speed;
            if (fish.x > canvas.width) fish.x = -fish.size; // If the fish crosses the right boundary, reappear from the left
        });
    }

    draw() {
        // draw BG
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw Bubbles
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        this.bubbles.forEach(bubble => {
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // draw BG fishes
        if (this.fishImage.complete) {  // 确保图片加载完成后才绘制
            this.fishes.forEach(fish => {
                // 使用 drawImage 绘制鱼
                ctx.drawImage(this.fishImage, fish.x, fish.y, fish.size, fish.size); // 绘制鱼的图像
            });
        } else {
            // 如果图像未加载完成，使用占位符绘制
            this.fishes.forEach(fish => {
                ctx.fillStyle = "#FF4500"; // 默认鱼的颜色
                ctx.beginPath();
                ctx.arc(fish.x, fish.y, fish.size / 2, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }
}


class WebsiteMonster {
    constructor() {

        this.width = 120;
        this.height = 100;
        this.x = 150;
        this.y = Math.random() * (canvas.height - 200) + 100;
        this.speed = Math.random() * 1.5 + 0.5;
        this.direction = Math.random() < 0.5 ? -1 : 1;

        this.image = new Image();
        this.image.src = 'Fish1.png'; 
    }

    move() {
        this.y += this.speed * this.direction;
        if (this.y < 50 || this.y > canvas.height - 100) {
            this.direction *= -1;
        }
    }

    draw() {
        // Make sure the image is loaded
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height); 
        } else {
            // If the image is not fully loaded, you can add a placeholder or background color
            ctx.fillStyle = "#FFD700";  
            ctx.fillRect(this.x, this.y, this.width, this.height); 
        }
    }
}

class DataDragon {
    constructor() {
        this.width = 80; 
        this.height = 80; 
        this.x = 50; 
        this.y = canvas.height - this.height - 20;
        this.speed = 0; 
        this.isMovingUp = false;
        this.hookImage = new Image();
        this.hookImage.src = 'Fishhook.png'; 
    }

    move() {
        if (this.isMovingUp) {
            this.speed += 1.5;
        } else {
            this.speed -= 1;
        }
        this.y -= this.speed;
        if (this.y < 20) {
            this.y = 20;
            this.speed = 0;
        }
        if (this.y > canvas.height - this.height - 20) {
            this.y = canvas.height - this.height - 20;
            this.speed = 0;
        }
    }

    draw() {
        ctx.strokeStyle = "#2c2c2c"; 
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - 15, 0); 
        ctx.lineTo(this.x + this.width / 2 - 15, this.y); 
        ctx.stroke();

       
        if (this.hookImage.complete) {
            ctx.drawImage(this.hookImage, this.x, this.y, this.width, this.height);
        } else {
           
            ctx.fillStyle = "#FF4500"; 
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class ProgressBar {
    constructor() {
        this.width = 20;
        this.height = 200;
        this.x = 300;
        this.y = canvas.height - this.height;
        this.progress = 100;
    }
    update(monster, dragon) {
        if (monster.y > dragon.y && monster.y < dragon.y + dragon.height) {
            this.progress += 0.5;
        } else {
            this.progress -= 0.2;
        }
        this.progress = Math.max(0, Math.min(100, this.progress));
    }
    draw() {
        ctx.fillStyle = `rgba(0,0, ${this.progress * 2.5},0.3)`;
        ctx.fillRect(this.x, this.y + (100 - this.progress) * 2, this.width, this.progress * 2);
    }
}

let background = new Background();
let monster = new WebsiteMonster();
let dragon = new DataDragon();
let progressBar = new ProgressBar();

function gameLoop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.update();
    background.draw();
    monster.move();
    monster.draw();
    dragon.move();
    dragon.draw();
    progressBar.update(dragon, monster);
    progressBar.draw();

    if (progressBar.progress <= 0) {
        alert("Fishing failed! The web page is wandering!");
        gameRunning = false;
        startButton.style.display = "block";
        return;
    }
    if (progressBar.progress >= 100) {
        message.style.display = "block";
        setTimeout(() => {
            window.location.href = targetWebsite;  // Directs the URL entered by the user
        }, 2000);
        return;
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener("mousedown", () => { if (gameRunning) dragon.isMovingUp = true; });
window.addEventListener("mouseup", () => { if (gameRunning) dragon.isMovingUp = false; });


startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    gameRunning = true;
    background = new Background();
    monster = new WebsiteMonster();
    progressBar = new ProgressBar();
    gameLoop();
});

const audio = document.getElementById("bgMusic");
const inputBar = document.getElementById("inputBar");

inputBar.addEventListener("click", () => {
    audio.play();  // The user clicks the button and plays the music
});


