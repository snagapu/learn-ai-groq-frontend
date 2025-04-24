const chatContainer = document.getElementById("chat-container");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("send-btn");

const chatHistory = [];

const addMessage = (text, sender) => {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.innerHTML = `<div class="${sender}">${text}</div>`;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
};

sendBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  addMessage(prompt, "user");
  chatHistory.push({ role: "user", content: prompt });
  promptInput.value = "";

  try {
    const response = await fetch("https://your-backend-url.onrender.com/api/tutor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: chatHistory }),
    });

    const data = await response.json();
    const reply = data.answer || "No answer received.";
    chatHistory.push({ role: "assistant", content: reply });
    addMessage(reply, "bot");
  } catch (error) {
    addMessage("⚠️ Something went wrong. Please try again.", "bot");
    console.error(error);
  }
});
