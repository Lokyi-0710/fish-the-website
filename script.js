const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");
const websiteInput = document.getElementById("websiteInput");
const goButton = document.getElementById("goButton");

let gameRunning = false;
let targetWebsite = "";  // 用于保存用户输入的网址

// 游戏前置功能：点击 "Go" 按钮后保存网址并开始游戏
goButton.addEventListener("click", () => {
    targetWebsite = websiteInput.value;
    if (targetWebsite) {
        document.getElementById("inputBar").style.display = "none";
        gameContainer.style.display = "block"; // 显示游戏画面
        startButton.style.display = "block";
    } else {
        alert("Please enter a valid URL!");
    }
});

// 创建游戏背景、怪物和进度条等类...
// 以下是简化后的类，保持不变
class Background { 
    constructor() {
        this.bubbles = [];
        this.fishes = [];
        // 加载鱼的PNG素材
        this.fishImage = new Image();
        this.fishImage.src = 'Fish2.png'; // 替换为鱼的PNG图片路径
        
        // 初始化气泡
        for (let i = 0; i < 20; i++) {
            this.bubbles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 5 + 2,
                speed: Math.random() * 1 + 0.5
            });
        }

        // 初始化鱼
        for (let i = 0; i < 5; i++) {
            this.fishes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 30 + 10, // 设置鱼的尺寸
                speed: Math.random() * 2 + 1 // 设置鱼的游动速度
            });
        }
    }

    update() {
        // 更新气泡的位置
        this.bubbles.forEach(bubble => {
            bubble.y -= bubble.speed;
            if (bubble.y < 0) bubble.y = canvas.height;
        });

        // 更新鱼的位置
        this.fishes.forEach(fish => {
            fish.x += fish.speed;
            if (fish.x > canvas.width) fish.x = -fish.size; // 如果鱼越过右边界，从左边重新出现
        });
    }

    draw() {
        // 绘制背景
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制气泡
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        this.bubbles.forEach(bubble => {
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // 绘制鱼
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

        // 加载PNG素材
        this.image = new Image();
        this.image.src = 'Fish1.png'; // 在这里替换成你的PNG图像的路径
    }

    move() {
        this.y += this.speed * this.direction;
        if (this.y < 50 || this.y > canvas.height - 100) {
            this.direction *= -1;
        }
    }

    draw() {
        // 确保图像已经加载完成
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // 使用PNG素材绘制图像
        } else {
            // 如果图像未加载完成，可以添加占位符或背景色
            ctx.fillStyle = "#FFD700";  // 原先的填充色
            ctx.fillRect(this.x, this.y, this.width, this.height); // 仅作为备用图形
        }
    }
}


class DataDragon {
    constructor() {
        this.width = 80; // 鱼钩的宽度
        this.height = 80; // 鱼钩的高度
        this.x = 50; // 鱼钩的初始水平位置
        this.y = canvas.height - this.height - 20; // 初始垂直位置
        this.speed = 0; // 垂直运动速度
        this.isMovingUp = false;

        // 加载鱼钩的PNG素材
        this.hookImage = new Image();
        this.hookImage.src = 'Fishhook.png'; // 替换为你的鱼钩PNG素材路径
    }

    move() {
        // 控制鱼钩的垂直运动
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
        // 画鱼线
        ctx.strokeStyle = "#2c2c2c"; // 设置鱼线的颜色
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - 15, 0); // 鱼线从钩子开始的上方位置
        ctx.lineTo(this.x + this.width / 2 - 15, this.y); // 鱼线的终点是鱼钩的y坐标
        ctx.stroke();

        // 确保图像已加载
        if (this.hookImage.complete) {
            // 绘制鱼钩图像
            ctx.drawImage(this.hookImage, this.x, this.y, this.width, this.height);
        } else {
            // 如果图像未加载，画一个占位符（可以删除）
            ctx.fillStyle = "#FF4500"; // 占位符颜色
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
            this.progress += 1.5;
        } else {
            this.progress -= 0.5;
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
            window.location.href = targetWebsite;  // 导向用户输入的网址
        }, 2000);
        return;
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener("mousedown", () => { if (gameRunning) dragon.isMovingUp = true; });
window.addEventListener("mouseup", () => { if (gameRunning) dragon.isMovingUp = false; });

// 开始游戏的操作
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
    audio.play();  // 用户点击按钮后播放音乐
});


