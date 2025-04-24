const chatContainer = document.getElementById("chat-container");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("send-btn");
const toggleBtn = document.getElementById("toggle-dark");

let messages = [];

function appendMessage(role, content) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<div class="${role}">${role === "user" ? "You" : "AI"}:</div>
                   <div class="bot">${content}</div>`;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const input = promptInput.value.trim();
  if (!input) return;

  const userMessage = { role: "user", content: input };
  messages.push(userMessage);
  appendMessage("user", input);
  promptInput.value = "";

  try {
    const res = await fetch("https://learn-ai-groq-backend.onrender.com/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    const botMessage = data.answer;
    messages.push({ role: "assistant", content: botMessage });
    appendMessage("assistant", botMessage);
    speak(botMessage);
  } catch (err) {
    console.error("Error:", err);
    appendMessage("assistant", "Sorry, something went wrong.");
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

sendBtn.addEventListener("click", sendMessage);
promptInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
