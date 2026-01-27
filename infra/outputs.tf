output "static_website_url" {
    value = azurerm_storage_account_static_website.front-page.primary_web_endpoint
}

output "storage_account_name" {
    value = azurerm_storage_account.storage_acc.name
}