const GAME_DURATION = 300000;
const MIN_SPAWN = 500;
const MAX_SPAWN = 5000;
const ESCALATE_TIME = 15000;
const SCORE_VALUE = 10;

const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const area = document.getElementById("gameArea");

let timeLeft = GAME_DURATION;
let score = 0;
let gameOver = false;

const categories = [
  {
    name: "Blame the Intern",
    messages: [
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
    ]
  },
  {
    name: "Send a Strongly Worded Email",
    messages: [
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
    ]
  },
  {
    name: "Turn It Off and Back On",
    messages: [
      "My webcam froze mid-meeting and won’t come back.",
      "The app crashes every time I open it.",
      "My keyboard stopped working after I spilled coffee.",
      "My screen is stuck in grayscale.",
      "The sound randomly cuts out during calls.",
      "My mouse pointer is lagging like it’s underwater.",
      "The VPN disconnects every 3 minutes.",
      "My laptop won’t wake up unless I close the lid first.",
      "The projector shows everything upside down.",
      "My phone won’t stop vibrating, even when off.",
      "The printer prints blank pages unless I whisper to it.",
      "My monitor flickers when I scroll too fast."
    ]
  },
  {
    name: "Offer Free Stickers",
    messages: [
      "My desk got moved next to the bathroom.",
      "I didn’t get the team hoodie everyone else got.",
      "My name is misspelled on my ID badge.",
      "The break room fridge smells like betrayal.",
      "I wasn’t invited to the team lunch.",
      "My Slack emoji privileges were revoked.",
      "The vending machine ate my dollar again.",
      "My chair slowly sinks during meetings.",
      "I got assigned a cubicle with no power outlets.",
      "My monitor is smaller than everyone else’s.",
      "I asked for a whiteboard and got a sticky note.",
      "My desk plant was replaced with a rock."
    ]
  },
  {
    name: "Forward to Legal",
    messages: [
      "I was asked to sign something in Latin.",
      "Someone emailed me a contract with no context.",
      "I got a cease-and-desist from a competitor.",
      "My coworker threatened to ‘sue the cloud.’",
      "I received a spreadsheet labeled ‘Confidential $$$’.",
      "The client wants us to ‘bend the rules’ a little.",
      "Someone sent me a file named ‘evidence.zip’.",
      "I was CC’d on a legal dispute between two departments.",
      "A vendor asked for my personal bank info.",
      "I found a folder called ‘Lawsuit Prep’ on the shared drive.",
      "My email signature was changed to ‘Chief Liability Officer.’",
      "Someone keeps sending contracts in Comic Sans."
    ]
  },
  {
    name: "Clear Browser History",
    messages: [
      "My browser homepage is now a dating site.",
      "I clicked a link and now everything is in Spanish.",
      "My bookmarks are all conspiracy theories.",
      "The autofill keeps suggesting ‘Buy Crypto Fast.’",
      "My browser opens 12 tabs on startup — all ads.",
      "I searched for ‘printer drivers’ and got malware.",
      "My browser history includes sites I’ve never visited.",
      "I keep getting pop-ups about ‘winning a free iPad.’",
      "My browser toolbar has 8 toolbars stacked.",
      "My browser keeps redirecting to a cat video blog.",
      "I typed ‘help desk’ and got a pizza coupon.",
      "My browser says ‘You’ve been hacked!’ in Comic Sans."
    ]
  },
  {
    name: "Revoke Admin Rights",
    messages: [
      "I gave myself admin and now I can’t log in.",
      "I renamed the Wi-Fi to ‘Free Virus’ and now no one can connect.",
      "I deleted the HR folder thinking it was a duplicate.",
      "I installed a theme that turned everything neon green.",
      "I tried to ‘optimize’ the network and now it’s gone.",
      "I changed my permissions and now I’m locked out of Slack.",
      "I gave everyone access to the payroll spreadsheet by accident.",
      "I disabled antivirus to speed things up.",
      "I made myself ‘Super Admin’ and now the system won’t boot.",
      "I removed the firewall because it was ‘too restrictive.’",
      "I tried to merge two accounts and deleted both.",
      "I edited the group policy and now printers are banned."
    ]
  },
  {
    name: "Blame the Cloud",
    messages: [
      "My synced folders are empty again.",
      "Google Drive says I’m offline but I’m clearly not.",
      "My files disappeared after I clicked ‘Sync Now.’",
      "The cloud backup restored the wrong version.",
      "My calendar events are duplicated across three time zones.",
      "The shared doc keeps reverting to last week’s version.",
      "My OneDrive says ‘Sync Complete’ but nothing’s there.",
      "I uploaded a file and it turned into a .dat.",
      "The cloud says I’m out of space, but I only have one file.",
      "My cloud folder is now named ‘Untitled (1)’ and empty.",
      "The cloud keeps asking me to sign in every 5 minutes.",
      "My files are syncing to someone else’s account."
    ]
  },
  {
    name: "Run Diagnostics and Hope",
    messages: [
      "My laptop sounds like it’s grinding coffee.",
      "The screen flickers when I open Excel.",
      "My mouse moves on its own sometimes.",
      "My speakers make a popping sound every few minutes.",
      "My fan runs at full speed even when idle.",
      "My webcam turns on randomly.",
      "My battery dropped from 80% to 2% in 10 seconds.",
      "My monitor flashes green when I scroll.",
      "My keyboard types double letters.",
      "My PC freezes when I open more than two tabs.",
      "My cursor disappears when I open Outlook.",
      "My laptop smells like burnt toast."
    ]
  },
  {
    name: "Unplug Everything",
    messages: [
      "The projector won’t turn off and keeps flashing blue.",
      "My docking station made a popping sound.",
      "The lights flicker when I plug in my charger.",
      "My monitor buzzes when I touch the mouse.",
      "My keyboard shocks me occasionally.",
      "The printer won’t stop printing blank pages.",
      "My speakers hum when the fridge turns on.",
      "My laptop only charges if I hold the cable just right.",
      "The power strip smells like ozone.",
      "My monitor turns off when I plug in my phone.",
      "My desk lamp resets my router when turned on.",
      "My mouse only works when the fan is off."
    ]
  }
];
function updateTimer() {
  timeLeft -= 1000;
  if (timeLeft < 0) {
    timeLeft = 0;
    gameOver = true;
  }
  const m = Math.floor(timeLeft / 60000).toString().padStart(2, "0");
  const s = Math.floor((timeLeft % 60000) / 1000).toString().padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
}

function updateScore() {
  scoreEl.textContent = score;
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function createTicket() {
  if (gameOver) return;

  const cat = rand(categories);
  const msg = rand(cat.messages);

  const ticket = document.createElement("div");
  ticket.className = "ticket";
  ticket.style.position = "absolute";
  ticket.style.left = Math.random() * 70 + 10 + "%";
  ticket.style.top = Math.random() * 60 + 10 + "%";
  ticket.dataset.correct = cat.name;
  ticket.dataset.start = Date.now();
  ticket.style.zIndex = 10;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.style.background = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  ticket.appendChild(avatar);

  const message = document.createElement("div");
  message.className = "message";
  message.textContent = msg;
  ticket.appendChild(message);

  const options = document.createElement("div");
  options.className = "options";

  const names = [cat.name];
  while (names.length < 5) {
    const n = rand(categories).name;
    if (!names.includes(n)) names.push(n);
  }
  shuffle(names);

  names.forEach(n => {
    const o = document.createElement("button");
    o.className = "option";
    o.textContent = n;
    o.onclick = (e) => {
      e.stopPropagation();
      const isCorrect = n === ticket.dataset.correct;
      const blinkClass = isCorrect ? "blink-green" : "blink-red";
      ticket.classList.add(blinkClass);
      if (isCorrect) {
        score += SCORE_VALUE;
        updateScore();
      }
      setTimeout(() => {
        ticket.style.transition = "opacity 0.3s ease";
        ticket.style.opacity = "0";
        ticket.style.pointerEvents = "none";
        setTimeout(() => {
          if (ticket && ticket.parentNode) {
            ticket.parentNode.removeChild(ticket);
          }
        }, 300);
      }, 300);
    };
    options.appendChild(o);
  });

  const hurdle = document.createElement("button");
  hurdle.className = "hurdle";
  hurdle.textContent = "Mark Malicious";
  hurdle.style.background = "red";
  hurdle.onclick = (e) => {
    e.stopPropagation();
    ticket.remove();
  };
  options.appendChild(hurdle);

  ticket.appendChild(options);
  makeDraggable(ticket);
  area.appendChild(ticket);
}

function makeDraggable(el) {
  let offsetX = 0, offsetY = 0, isDown = false;

  el.addEventListener("pointerdown", e => {
    isDown = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener("pointermove", e => {
    if (!isDown) return;
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
  });

  el.addEventListener("pointerup", () => {
    isDown = false;
  });
}

function escalate() {
  const now = Date.now();
  document.querySelectorAll(".ticket").forEach(t => {
    const age = now - Number(t.dataset.start);
    const p = Math.min(age / ESCALATE_TIME, 1);
    t.style.transform = `scale(${1 + p * 0.5})`;
    t.style.opacity = 0.4 + 0.6 * p;
    t.style.zIndex = 10 + Math.floor(p * 100);
  });
}

function spawnLoop() {
  if (gameOver) return;
  createTicket();
  const ratio = timeLeft / GAME_DURATION;
  const delay = MIN_SPAWN + (MAX_SPAWN - MIN_SPAWN) * ratio * Math.random();
  setTimeout(spawnLoop, delay);
}

updateTimer();
updateScore();

const timerInt = setInterval(() => {
  if (gameOver) {
    clearInterval(timerInt);
    return;
  }
  updateTimer();
}, 1000);

spawnLoop();

function gameLoop() {
  if (!gameOver) {
    escalate();
    requestAnimationFrame(gameLoop);
  }
}

gameLoop();
