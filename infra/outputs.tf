output "static_website_url" {
  value = azurerm_storage_account.storage_acc.primary_web_endpoint
}

output "storage_account_name" {
  value = azurerm_storage_account.storage_acc.name
}

output "cosmosdb_account_name" {
  value = azurerm_cosmosdb_account.resume-db.name
}

output "function_app_default_hostname" {
  value = "https://${azurerm_linux_function_app.function_app.default_hostname}/api"
}