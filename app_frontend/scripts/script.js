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
    constructor(storagekey = "hasVisited") {
        this.storagekey = storagekey;
    }

    hasVisited() {
        return sessionStorage.getItem(this.storagekey) !== null;
    }

    markAsVisited() {
        sessionStorage.setItem(this.storagekey, "true");
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
            console.log("Same Visitor");
            return;
        }

        try {
            const data = await this.apiClient.post(this.apiUrl);
            this.counterUI.updateCount(data.visitors);
            this.sessionTracker.markAsVisited();
        } catch (error) {
            console.error("Error updating visitor count: ", error);
            this.counterUI.showError();
        }
    }
}

const apiClient = new ApiClient();
const sessionTracker = new SessionTracker("resume_visited");
const counterUI = new CounterUI("cnt")
const apiUrl = `${config.apiBaseUrl}/visitor`;

// inject services into the main orchestrator
const visitorCounter = new VisitorController(apiClient, sessionTracker, counterUI, apiUrl);

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        visitorCounter.processVisit();
    }, 2000);
});