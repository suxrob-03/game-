let boxes = document.querySelectorAll(".boxes");
let turnX = true;

let turn1 = document.querySelector(".turn1");
let turn2 = document.querySelector(".turn2");
let msg = document.querySelector(".msg");

let span = document.getElementById("result");

let reset = document.getElementById("reset");
let n_game = document.getElementById("n_game");
let clickSound = new Audio("click_sound.wav");
let clickSound2 = new Audio("click_sound2.mp3");
let winnerSound = new Audio("win.mp3");
// winner Condition

let winnerCondition = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

reset.addEventListener("click", () => {
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
    box.classList.add("hover");
    msg.classList.add("hide");
  });
});

n_game.addEventListener("click", () => {
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
    box.classList.add("hover");
    msg.classList.add("hide");
  });
});

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnX) {
      clickSound.play();
      box.innerText = "😀";
      box.style.color = "yellow";
      turn2.classList.add("b_click");
      turn1.classList.remove("b_click");
      box.classList.remove("hover");
      box.disabled = true;
      turnX = false;
    } else {
      clickSound2.play();
      box.innerText = "🙄";
      box.style.color = "red";
      turn1.classList.add("b_click");
      turn2.classList.remove("b_click");
      box.classList.remove("hover");
      box.disabled = true;
      turnX = true;
    }
    checkWinner();
  });
});

function checkWinner() {
  for (const condition of winnerCondition) {
    let box1 = boxes[condition[0]].innerText;
    let box2 = boxes[condition[1]].innerText;
    let box3 = boxes[condition[2]].innerText;

    if (box1 !== "" && box2 === box3) {
      if (box1 === box2 && box2 === box3) {
        showResult(box1);
        winnerSound.play();
      }
    }
  }
}

function showResult(result) {
  boxes.forEach((box) => {
    box.disabled = true;
    box.classList.remove("hover");
  });

  msg.classList.remove("hide");
  span.innerText = result;

  if (result === "X") {
    span.style.color = "yellow";
  } else {
    span.style.color = "red";
  }
}
