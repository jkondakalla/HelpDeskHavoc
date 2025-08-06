
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.querySelector(".score");
const timerDisplay = document.getElementById("timer");

let score = 0;
let timeLeft = 300;
let timerInterval;
let gameFrozen = false;

const securityQuestions = [
  {
    question: "What device only works after you whisper “You’re doing great” and restart it twice?",
    options: ["The coffee machine", "The badge scanner", "The projector"],
    answer: "The projector"
  },
  {
    question: "What glows softly, hums gently, and silently judges your browser history?",
    options: ["The desk lamp", "The webcam", "The office fridge"],
    answer: "The webcam"
  },
  {
    question: "What has 47 buttons, none labeled, and one that launches a PowerPoint from 2013?",
    options: ["The help desk phone", "The vending machine", "The projector remote"],
    answer: "The projector remote"
  },
  {
    question: "What only connects to Wi-Fi when you stop caring and walk away?",
    options: ["The smart mug", "The intern’s hotspot", "The tablet"],
    answer: "The smart mug"
  },
  {
    question: "What prints blank pages and then smugly says “Job Complete”?",
    options: ["The printer", "The fax machine", "The HR portal"],
    answer: "The fax machine"
  },
  {
    question: "What folder is labeled “DO NOT OPEN” and contains everyone’s secrets and one cursed spreadsheet?",
    options: ["Shared drive", "Budget.xlsx", "HR policies"],
    answer: "Budget.xlsx"
  },
  {
    question: "What vibrates randomly and might be possessed by a ghost from IT?",
    options: ["Your phone", "The office chair", "The help desk"],
    answer: "The office chair"
  },
  {
    question: "What asks for a login before letting you microwave your sadness?",
    options: ["The coffee machine", "The smart microwave", "The fridge"],
    answer: "The fridge"
  },
  {
    question: "What resets itself every time you make eye contact with it?",
    options: ["The router", "The intern", "The projector"],
    answer: "The intern"
  },
  {
    question: "What has a blinking light that means “I gave up hours ago”?",
    options: ["The VPN", "The badge reader", "The coffee machine"],
    answer: "The VPN"
  },
  {
    question: "What sends 12 reminders, then cancels the meeting without telling you?",
    options: ["The calendar app", "The messaging tool", "The intern"],
    answer: "The messaging tool"
  },
  {
    question: "What was renamed “Definitely Not Malware” and now runs the network?",
    options: ["The Wi-Fi", "The intern’s hotspot", "The cloud"],
    answer: "The cloud"
  }
];

function getOptions(correct) {
  const allOptions = categories.map(c => c.name).filter(name => name !== correct);
  const shuffled = allOptions.sort(() => 0.5 - Math.random()).slice(0, 4);
  shuffled.push(correct);
  return shuffled.sort(() => 0.5 - Math.random());
}

function showSecurityQuestion() {
  gameFrozen = true;
  const modal = document.getElementById("securityModal");
  const questionEl = document.getElementById("securityQuestion");
  const optionsEl = document.getElementById("securityOptions");

  const question = securityQuestions[Math.floor(Math.random() * securityQuestions.length)];
  questionEl.textContent = question.question;
  optionsEl.innerHTML = "";

  question.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      if (option === question.answer) {
        modal.style.display = "none";
        gameFrozen = false;
        scheduleNextSecurityQuestion();
      } else {
        showSecurityQuestion();
      }
    };
    optionsEl.appendChild(btn);
  });

  modal.style.display = "flex";
}

function scheduleNextSecurityQuestion() {
  const delay = Math.random() * (120000 - 30000) + 30000;
  setTimeout(showSecurityQuestion, delay);
}
