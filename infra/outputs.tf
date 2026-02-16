output "static_website_url" {
  value = azurerm_storage_account.storage_acc.primary_web_endpoint
}

output "storage_account_name" {
  value = azurerm_storage_account.storage_acc.name
}

# output "cosmosdb_account_name" {
#   value = azurerm_cosmosdb_account.resume-db.name
# }