const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const lanes = [100, 200, 300];
let currentLane = 1;
let score = 0;
let gameOver = false;
let speed = 3;
let clickSound = new Audio("sounds effect/die.mp3");
let die = new Audio("click_sound.wav");

const player = {
  x: lanes[currentLane],
  y: 540,
  width: 50,
  height: 50,
  color: "#00ff00", // boshlang‘ich rang
};

let coins = [];
let obstacles = [];

// Tasodifiy rang qaytaruvchi funksiya
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Klaviatura boshqaruvi
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft();
  else if (e.key === "ArrowRight") moveRight();
});

function moveLeft() {
  if (currentLane > 0) {
    currentLane--;
    player.x = lanes[currentLane];
  }
}

function moveRight() {
  if (currentLane < 2) {
    currentLane++;
    player.x = lanes[currentLane];
  }
}

// Har 1 sekundda yangi coin yoki to'siq tushadi
setInterval(() => {
  if (gameOver) return;
  const lane = Math.floor(Math.random() * 3);
  if (Math.random() < 0.5) {
    coins.push({ x: lanes[lane], y: -20, radius: 12, collected: false });
  } else {
    obstacles.push({
      x: lanes[lane],
      y: -40,
      width: 40,
      height: 40,
      color: "#fff",
    });
  }
}, 1000);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player chizish
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - player.width / 2,
    player.y,
    player.width,
    player.height
  );

  // Tangalarni chizish
  for (let coin of coins) {
    if (!coin.collected) {
      coin.y += speed;
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
      ctx.fillStyle = "gold";
      ctx.fill();

      // Tanga olinganmi tekshirish
      if (
        coin.y + coin.radius > player.y &&
        coin.y - coin.radius < player.y + player.height &&
        coin.x === player.x
      ) {
        clickSound.play();

        coin.collected = true;
        score++;
        player.color = getRandomColor(); // faqat tanga olganda rang o‘zgaradi
        document.getElementById("score").textContent = score;
        // ctx.fillStyle = obs.color = color = getRandomColor();

        if (score % 5 === 0) speed += 0.5;
      }
    }
  }

  // To'siqlarni chizish
  for (let obs of obstacles) {
    obs.y += speed;
    ctx.fillStyle = obs.color;

    ctx.fillRect(obs.x - obs.width / 2, obs.y, obs.width, obs.height);

    if (
      obs.y + obs.height > player.y &&
      obs.y < player.y + player.height &&
      obs.x === player.x
    ) {
      gameOver = true;
      document.getElementById("alert").style.display = "block";
      document.getElementById(
        "alert"
      ).innerHTML = `Game Over!<br/>Coins: ${score}`;
    }
  }

  if (!gameOver) requestAnimationFrame(draw);
}

draw(); // boshlash
