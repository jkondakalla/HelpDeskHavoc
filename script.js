
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.querySelector(".score");
const timerDisplay = document.getElementById("timer");

let score = 0;
let timeLeft = 300; // 5 minutes in seconds
let timerInterval;
let spawnDelay = 3000; // Start at 3 seconds
let minDelay = 500;    // Minimum delay between spawns
let rampUpRate = 100;  // Reduce delay every 10 seconds
let elapsedTime = 0;
let interactionDisabled = false;

function getRandomMessage() {
  const isMalicious = Math.random() < 0.1;
  const pool = isMalicious
    ? categories.filter(c => c.name === "Malicious")
    : categories.filter(c => c.name !== "Malicious");

  const category = pool[Math.floor(Math.random() * pool.length)];
  const message = category.messages[Math.floor(Math.random() * category.messages.length)];

  return { message, correct: category.name, isMalicious };
}

function getOptions(correct) {
  const allOptions = categories.map(c => c.name).filter(name => name !== correct);
  const shuffled = allOptions.sort(() => 0.5 - Math.random()).slice(0, 4);
  shuffled.push(correct);
  shuffled.push("Mark Malicious");
  return shuffled.sort(() => 0.5 - Math.random());
}

function showMaliciousPenalty() {
  interactionDisabled = true;

  const overlay = document.createElement("div");
  overlay.className = "penalty-popup";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.color = "#fff";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";
  overlay.innerHTML = `
    <h2>Security Breach!</h2>
    <p>You let a malicious ticket through. The system is rebooting...</p>
    <p>Fun Fact: Octopuses have three hearts and blue blood!</p>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    document.body.removeChild(overlay);
    interactionDisabled = false;
  }, 10000);
}

function createTicket() {
  const { message, correct, isMalicious } = getRandomMessage();
  const ticket = document.createElement("div");
  ticket.className = "ticket";

ticket.onmousedown = function (e) {
  // Raise z-index to bring ticket to front
  ticket.style.zIndex = 1000;

  let shiftX = e.clientX - ticket.getBoundingClientRect().left;
  let shiftY = e.clientY - ticket.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    ticket.style.left = pageX - shiftX + 'px';
    ticket.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(e) {
    moveAt(e.pageX, e.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);

  ticket.onmouseup = function () {
    document.removeEventListener('mousemove', onMouseMove);
    ticket.onmouseup = null;

    // Optionally reset z-index after drag
    ticket.style.zIndex = '';
  };
};


  ticket.ondragstart = function () {
    return false;
  };

  ticket.style.top = `${Math.random() * 80 + 10}%`;
  ticket.style.left = `${Math.random() * 70 + 10}%`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.style.backgroundImage = "url('https://via.placeholder.com/40')";
  ticket.appendChild(avatar);

  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = message;
  ticket.appendChild(msg);

  const options = document.createElement("div");
  options.className = "options";
  const buttons = getOptions(correct);

  buttons.forEach(text => {
    const btn = document.createElement("button");
    btn.className = text === "Mark Malicious" ? "hurdle" : "option";
    btn.textContent = text;
    btn.onclick = () => {
      if (interactionDisabled) return;

      if (text === "Mark Malicious") {
        if (isMalicious) {
          ticket.classList.add("blink-green");
          score++;
        } else {
          ticket.classList.add("blink-red");
          score = Math.max(0, score - 1);
        }
        scoreDisplay.textContent = score;
      } else {
        if (isMalicious) {
          showMaliciousPenalty();
        }
        if (text === correct) {
          ticket.classList.add("blink-green");
          score++;
          scoreDisplay.textContent = score;
        } else {
          ticket.classList.add("blink-red");
        }
      }
      setTimeout(() => ticket.remove(), 300);
    };
    options.appendChild(btn);
  });

  ticket.appendChild(options);
  gameArea.appendChild(ticket);
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  if (timeLeft > 0) {
    timeLeft--;
  } else {
    clearInterval(timerInterval);
  }
}

function spawnTicketsGradually() {
  createTicket();

  const progress = 1 - timeLeft / 300;
  const maxDelay = 3000;
  const minDelay = 100;
  const currentMax = maxDelay - progress * (maxDelay - minDelay);
  const delay = Math.random() * currentMax;

  setTimeout(spawnTicketsGradually, delay);
}

window.onload = () => {
  timerInterval = setInterval(updateTimer, 1000);
  spawnTicketsGradually();
};
