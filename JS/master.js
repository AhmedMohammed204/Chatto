let apiKey = "YOURE_API_KEY_HERE";
let textArea = document.querySelector(".prompt-to-send");
let contentDiv = document.querySelector(".content");

function scrollToBottom() {
    contentDiv.scrollTop = contentDiv.scrollHeight;
}

async function SendToGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const body = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    } catch (error) {
        console.error("Error:", error);
        return "Sorry, an error occurred.";
    }
}

function addMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);

    const htmlContent = marked.parse(text);

    messageDiv.innerHTML = `<div class="message-text">${htmlContent}</div>`;

    contentDiv.appendChild(messageDiv);
    scrollToBottom();
}


async function Send() {
    let prompt = textArea.value.trim();
    if (prompt === "") return;

    addMessage(prompt, "prompt");
    textArea.value = "";

    let response = await SendToGemini(prompt);
    if (!response) return alert("Sorry, something went wrong. Please try again later.");

    addMessage(response, "response");
}

textArea.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        Send();
    }
});
