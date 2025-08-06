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
let topZIndex = 1000;

function getRandomMessage() {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const message = category.messages[Math.floor(Math.random() * category.messages.length)];
  return { message, correct: category.name };
}

function getOptions(correct) {
  const allOptions = categories.map(c => c.name).filter(name => name !== correct);
  const shuffled = allOptions.sort(() => 0.5 - Math.random()).slice(0, 4);
  shuffled.push(correct);
  shuffled.push("Mark Malicious");
  return shuffled.sort(() => 0.5 - Math.random());
}

function createTicket() {
  const { message, correct } = getRandomMessage();
  const ticket = document.createElement("div");
  ticket.className = "ticket";

// Make the ticket draggable
ticket.onmousedown = function (e) {
  ticket.style.zIndex = ++topZIndex;
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
  // Pause escalation animations
  ticket.classList.remove("escalate1", "escalate2", "escalate3", "shake");

  // Apply feedback animation
  if (text === correct) {
    ticket.classList.add("blink-green");
    score++;
    scoreDisplay.textContent = score;
  } else {
    ticket.classList.add("blink-red");
  }

  // Wait for feedback animation to finish before removing
  setTimeout(() => {
    ticket.remove();
  }, 600); // Increased to 600ms for better visibility
};


  ticket.appendChild(options);
  gameArea.appendChild(ticket);
  // Escalate ticket over time
setTimeout(() => ticket.classList.add("escalate1"), 15000); // after 15s
setTimeout(() => ticket.classList.add("escalate2"), 30000); // after 30s
setTimeout(() => {
  ticket.classList.add("escalate3");
  ticket.classList.add("shake"); // optional: adds red border + shake
}, 60000); // after 60s

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  if (timeLeft > 0) {
    timeLeft--;
  } else {
    clearInterval(timerInterval);
    // Optional: End game logic here
  }
}


function spawnTicketsGradually() {
  createTicket();

  // Calculate a random delay that shrinks over time
  const progress = 1 - timeLeft / 300; // 0 at start, 1 at end
  const maxDelay = 4000; // max 4 seconds
  const minDelay = 500;  // min 0.5 seconds
  const currentMax = maxDelay - progress * (maxDelay - minDelay);
  const delay = Math.random() * currentMax;

  setTimeout(spawnTicketsGradually, delay);
}


window.onload = () => {
  timerInterval = setInterval(updateTimer, 1000);
  spawnTicketsGradually();
};
