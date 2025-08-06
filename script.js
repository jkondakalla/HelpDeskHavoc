// script.js

const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.querySelector(".score");
let score = 0;

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

// Spawn tickets randomly
window.onload = () => {
  setInterval(createTicket, 3000);
};