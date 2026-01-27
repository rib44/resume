# Storage Account for Static Website Hosting
resource "azurerm_storage_account" "storage_acc" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.resume-rg.name
  location                 = azurerm_resource_group.resume-rg.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"
}