// Game setup
let score = 0;
let timeLeft = 300; // 5 minutes in seconds
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const gameArea = document.getElementById("game-area");

// Ticket data (from HelpDeskHavocTickets.txt)
const ticketCategories = {
  "Blame the Intern": [
    "Someone renamed all the desktop icons to emojis.",
    "The coffee machine now requires a login.",
    "My mouse is taped to the ceiling.",
    "The help desk phone rings once, then plays elevator music.",
    "The intern just asked if Excel can run Doom.",
    "My monitor brightness is at 200% and locked.",
    "The shared drive is now called ‘DO NOT OPEN.’",
    "My keyboard types in reverse.",
    "The intern said they ‘optimized’ my PC and now it won’t boot.",
    "There’s a sticky note on my webcam that says ‘Trust No One.’",
    "My desktop background is now a meme of me.",
    "The intern said they fixed the printer. It’s smoking."
  ],
  "Send a Strongly Worded Email": [
    "Facilities still hasn’t fixed the flickering lights.",
    "I’ve asked for access to the budget folder five times.",
    "The vendor keeps sending invoices in .bmp format.",
    "My manager keeps forwarding me spam ‘just in case.’",
    "The team lead muted me in every meeting.",
    "I got removed from the project Slack channel again.",
    "The new hire keeps replying-all to every email.",
    "I was assigned a task due yesterday.",
    "The client keeps calling me ‘Tech Support’.",
    "Someone keeps deleting my calendar events.",
    "I got CC’d on a 200-email thread about lunch.",
    "My request for a second monitor was denied with a meme."
  ],
  // Add other categories here...
};

// All possible answers
const allAnswers = Object.keys(ticketCategories);

// Start the game timer
function startTimer() {
  const interval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      endGame();
    }
  }, 1000);
}

// Spawn a ticket
function spawnTicket() {
  const category = getRandomKey(ticketCategories);
  const message = getRandomItem(ticketCategories[category]);

  const ticket = document.createElement("div");
  ticket.className = "ticket";
  ticket.style.top = `${Math.random() * 70 + 10}%`;
  ticket.style.left = `${Math.random() * 70 + 10}%`;

  ticket.innerHTML = `
    <div class="avatar"></div>
    <div class="message">${message}</div>
    <div class="options">
      ${generateOptions(category).map(option => `
        <button class="option ${option === "Mark Malicious" ? "hurdle" : ""}" data-answer="${option}">
          ${option}
        </button>
      `).join("")}
    </div>
  `;

  // Add click logic
  ticket.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", () => {
      const selected = button.getAttribute("data-answer");
      if (selected === category) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
      }
      ticket.remove();
    });
  });

  gameArea.appendChild(ticket);
}

// Utility functions
function getRandomKey(obj) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOptions(correctAnswer) {
  const incorrect = allAnswers.filter(a => a !== correctAnswer);
  const shuffled = incorrect.sort(() => 0.5 - Math.random()).slice(0, 5);
  const options = [...shuffled, correctAnswer];
  options.push("Mark Malicious");
  return options.sort(() => 0.5 - Math.random());
}

// End game
function endGame() {
  alert(`Game over! Final score: ${score}`);
  gameArea.innerHTML = "";
}

// Start game
startTimer();
setInterval(spawnTicket, 3000); // Spawn a ticket every 3 seconds
