import config from "../config/config.js";

// Handles the URL call
class ApiClient {
    async post(url) {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
}

// Handles browser storage
class SessionTracker {
    constructor(visitedKey = "resume_visited", countKey="resume_count") {
        this.visitedKey = visitedKey;
        this.countKey = countKey;
    }

    hasVisited() {
        return sessionStorage.getItem(this.visitedKey) !== null;
    }

    markAsVisited() {
        sessionStorage.setItem(this.visitedKey, "true");
    }

    saveCount(count) {
        sessionStorage.setItem(this.countKey, count.toString());
    }

    getSavedCount() {
        sessionStorage.getItem(this.countKey);
    }
}

// DOM manipulation for count
class CounterUI {
    constructor(elementID) {
        this.elementID = elementID;
    }

    updateCount(count) {
        const element = document.getElementById(this.elementID);
        if (element) element.innerHTML = count;
    }

    showError() {
        const element = document.getElementById(this.elementID);
        if (element) element.innerHTML = "Error";
    }
}

// Orchestration
class VisitorController {
    constructor(apiClient, sessionTracker, counterUI, apiUrl) {
        this.apiClient = apiClient;
        this.sessionTracker = sessionTracker;
        this.counterUI = counterUI;
        this.apiUrl = apiUrl;
    }

    async processVisit() {
        // prevents refresh spam
        if (this.sessionTracker.hasVisited()) {
            console.log("Same Visitor, using cached count");

            const cachedCount = this.sessionTracker.getSavedCount();
            if (cachedCount) {
                this.counterUI.updateCount(cachedCount);
            }
            return; // No API Call
        }

        // API call: first-time user
        try {
            const data = await this.apiClient.post(this.apiUrl);

            this.counterUI.updateCount(data.visitors);

            this.sessionTracker.markAsVisited();
            this.sessionTracker.saveCount(data.visitors);

        } catch (error) {
            console.error("Error updating visitor count: ", error);
            this.counterUI.showError();
        }
    }
}

// -------------------Application bootstap here-----------------
const apiClient = new ApiClient();
const sessionTracker = new SessionTracker("resume_visited");
const counterUI = new CounterUI("cnt")
const apiUrl = `${config.apiBaseUrl}/visitor`;

// inject services into the main orchestrator
const visitorCounter = new VisitorController(apiClient, sessionTracker, counterUI, apiUrl);

// call the API after 2s, prevents crawler-bot API call
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        visitorCounter.processVisit();
    }, 2000);
});