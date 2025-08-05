// Help Desk Havoc - Clean Script
const GAME_DURATION = 300000;
const MIN_SPAWN = 500;
const MAX_SPAWN = 5000;
const ESCALATE_TIME = 15000;
const SCORE_VALUE = 10;

let timeLeft = GAME_DURATION;
let score = 0;
let gameOver = false;

const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const area = document.getElementById("gameArea");

function updateTimer() {
    timeLeft -= 1000;
    if (timeLeft <= 0) {
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

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
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

function escalateTickets() {
    const now = Date.now();
    document.querySelectorAll(".ticket").forEach(ticket => {
        const age = now - Number(ticket.dataset.start);
        const p = Math.min(age / ESCALATE_TIME, 1);
        ticket.style.transform = `scale(${1 + p * 0.5})`;
        ticket.style.opacity = 0.4 + 0.6 * p;
        ticket.style.zIndex = 10 + Math.floor(p * 100);
    });
}

function createTicket() {
    if (gameOver) return;

    const category = rand(categories);
    const message = rand(category.messages);

    const ticket = document.createElement("div");
    ticket.className = "ticket";
    ticket.style.position = "absolute";
    ticket.style.left = Math.random() * 70 + 10 + "%";
    ticket.style.top = Math.random() * 60 + 10 + "%";
    ticket.dataset.correct = category.name;
    ticket.dataset.start = Date.now();
    ticket.style.zIndex = 10;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.style.background = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    ticket.appendChild(avatar);

    const msgEl = document.createElement("div");
    msgEl.className = "message";
    msgEl.textContent = message;
    ticket.appendChild(msgEl);

    const options = document.createElement("div");
    options.className = "options";

    const names = [category.name];
    while (names.length < 5) {
        const n = rand(categories).name;
        if (!names.includes(n)) names.push(n);
    }
    shuffle(names);

    names.forEach(name => {
        const btn = document.createElement("button");
        btn.className = "option";
        btn.textContent = name;
        btn.onclick = (e) => {
            e.stopPropagation();
            const isCorrect = name === ticket.dataset.correct;
            ticket.classList.add(isCorrect ? "blink-green" : "blink-red");
            if (isCorrect) {
                score += SCORE_VALUE;
                updateScore();
            }
            setTimeout(() => {
                ticket.style.opacity = "0";
                ticket.style.pointerEvents = "none";
                setTimeout(() => {
                    if (ticket.parentNode) ticket.parentNode.removeChild(ticket);
                }, 300);
            }, 300);
        };
        options.appendChild(btn);
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

function spawnLoop() {
    if (gameOver) return;
    createTicket();
    const ratio = timeLeft / GAME_DURATION;
    const delay = MIN_SPAWN + (MAX_SPAWN - MIN_SPAWN) * ratio * Math.random();
    setTimeout(spawnLoop, delay);
}

function gameLoop() {
    if (!gameOver) {
        escalateTickets();
        requestAnimationFrame(gameLoop);
    }
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
gameLoop();
