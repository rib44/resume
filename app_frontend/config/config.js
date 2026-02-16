// Configuration for Azure-hosted API endpoints
// Frontend: Azure Storage Static Website
// Backend: Azure Functions

const config = {
    apiBaseUrl: getApiBaseUrl()
};

function getApiBaseUrl() {
    const hostname = window.location.hostname; // Get current hostname

    // UI, Backend: Local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:7071'; // Azure Functions local port
    }

    // If UI: local and Backend: Production
    // Format: https://<function-app-name>.azurewebsites.net
    const azureFunctionUrl = localStorage.getItem('AZURE_FUNCTION_URL');
    if (azureFunctionUrl) {
        return azureFunctionUrl;
    }

    // Backend: Production
    // update below URL with actual Azure functions app URL
    // eg., return 'https://YOUR_FUNCTION_APP.azurewebsites.net';
    return 'https://YOUR_FUNCTION_APP.azurewebsites.net';
}

export default config;