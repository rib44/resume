import config from "../config/config.js";

// Handles the URL call
class ApiClient {
    async post(url) {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json"}
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return  await response.json();
    }
}


const apiClient = new ApiClient();
