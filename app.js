
async function askQuestion() {
  const question = document.getElementById("question").value;
  const answerDiv = document.getElementById("answer");
  answerDiv.innerHTML = "Thinking...";

  try {
    const res = await fetch("https://learn-ai-groq-backend.onrender.com/api/tutor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    answerDiv.innerHTML = data.answer || "No response received.";
  } catch (err) {
    answerDiv.innerHTML = "Error: " + err.message;
  }
}
