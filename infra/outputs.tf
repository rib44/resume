output "static_website_url" {
    value = azurerm_storage_account_static_website.front-page.primary_web_endpoint
}