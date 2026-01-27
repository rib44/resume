# Static Website Configuration for Storage Account
resource "azurerm_storage_account_static_website" "front-page" {
  storage_account_id = azurerm_storage_account.storage.id
  index_document     = "index.html"
  error_404_document = "404.html"
}
