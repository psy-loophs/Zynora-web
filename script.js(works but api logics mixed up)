const config = window.ZYNORA_CONFIG || {};

const API_BASE_URL = (
    config.API_BASE_URL || ""
).replace(/\/+$/, "");

const startButton = document.getElementById("start-button");
const guessForm = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const gameStatus = document.getElementById("game-status");
const connectionStatus = document.getElementById("connection-status");

let gameId = null;
let busy = false;
let finished = false;

document.getElementById("year").textContent = new Date().getFullYear();

function setMessage(text, type = "") {
    message.textContent = text;
    message.className = "message";

    if (type) {
        message.classList.add(type);
    }
}

function setBusy(value) {
    busy = value;
    startButton.disabled = value;
    guessButton.disabled = value || !gameId || finished;
    guessInput.disabled = value || !gameId || finished;
}

async function apiRequest(endpoint, body = null) {
    if (!API_BASE_URL) {
        throw new Error("The proxy URL has not been configured.");
    }

    const headers = {};

    if (body !== null) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: body === null ? "GET" : "POST",
        headers,
        body: body === null ? undefined : JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.detail || data.error || `Request failed (${response.status})`
        );
    }

    return data;
}

async function checkConnection() {
    try {
        await apiRequest("/api/health");

        connectionStatus.textContent = "Game server connected";
        connectionStatus.style.color = "#86efac";
        startButton.disabled = false;
    } catch (error) {
        connectionStatus.textContent = `Server connection failed: ${error.message}`;
        connectionStatus.style.color = "#fca5a5";
        startButton.disabled = false;
    }
}

async function startGame() {
    if (busy) return;

    setBusy(true);
    setMessage("Starting a new game...");
    gameStatus.textContent = "Starting";

    try {
        const data = await apiRequest("/api/start", {});

        gameId = data.game_id;
        finished = false;
        attemptsDisplay.textContent = "0";

        guessInput.value = "";
        guessInput.disabled = false;
        guessButton.disabled = false;

        gameStatus.textContent = "Game in progress";
        setMessage("Your game has started! Enter a number between 1 and 100.");
        guessInput.focus();
    } catch (error) {
        gameId = null;
        gameStatus.textContent = "Connection error";
        setMessage(error.message, "error");
    } finally {
        setBusy(false);
    }
}

async function submitGuess(event) {
    event.preventDefault();

    if (busy || !gameId || finished) return;

    const guess = Number(guessInput.value);

    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
        setMessage("Please enter a whole number between 1 and 100.", "error");
        return;
    }

    setBusy(true);

    try {
        const data = await apiRequest("/api/guess", {
            game_id: gameId,
            guess
        });

        attemptsDisplay.textContent = String(data.attempts);
        setMessage(data.message, data.finished ? "success" : "");

        if (data.finished) {
            finished = true;
            gameStatus.textContent = "You won!";
            guessInput.disabled = true;
            guessButton.disabled = true;
            startButton.textContent = "Play Again";
        } else {
            guessInput.value = "";
            guessInput.focus();
        }
    } catch (error) {
        setMessage(error.message, "error");

        if (error.message.toLowerCase().includes("start a new game")) {
            gameId = null;
            finished = true;
            gameStatus.textContent = "Game ended";
        }
    } finally {
        setBusy(false);
    }
}

startButton.addEventListener("click", startGame);
guessForm.addEventListener("submit", submitGuess);

checkConnection();
