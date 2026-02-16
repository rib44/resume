import config from "../config/config.js";

// website counter
async function updateCounter() {
    try {
        // Call POST endpoint to increment counter
        const response = await fetch(`${config.apiBaseUrl}/visitor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        document.getElementById("cnt").innerHTML = data.visitors;
    }
    catch (error) {
        console.error("Error updating visitor count:", error);
        document.getElementById("cnt").innerHTML = "Error";
    }
}

window.onload = updateCounter;