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
      if (text === correct) {
        ticket.classList.add("blink-green");
        score++;
        scoreDisplay.textContent = score;
      } else {
        ticket.classList.add("blink-red");
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
    // Optional: End game logic here
  }
}

function spawnTicketsGradually() {
  createTicket();

  // Ramp up every 10 seconds
  if (elapsedTime % 10000 === 0 && spawnDelay > minDelay) {
    spawnDelay -= rampUpRate;
  }

  elapsedTime += spawnDelay;

  setTimeout(spawnTicketsGradually, spawnDelay);
}

window.onload = () => {
  timerInterval = setInterval(updateTimer, 1000);
  spawnTicketsGradually();
};
