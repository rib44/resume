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

const apiClient = new ApiClient();
const sessionTracker = new SessionTracker("resume_visited");
const counterUI = new CounterUI("cnt")