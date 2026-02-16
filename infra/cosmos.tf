# # Cosmos DB Account Table API, serverless capacity mode
# resource "azurerm_cosmosdb_account" "resume-db" {
#   name                = "${var.cosmosdb_account_name}-${random_integer.ri.result}"
#   resource_group_name = azurerm_resource_group.resume-rg.name
#   location            = azurerm_resource_group.resume-rg.location
#   offer_type          = "Standard"
#   kind                = "GlobalDocumentDB"

#   capabilities {
#     name = "EnableTable"
#   }

#   capabilities {
#     name = "EnableServerless"
#   }

#   consistency_policy {
#     consistency_level = "Session"
#   }

#   geo_location {
#     location          = azurerm_resource_group.resume-rg.location
#     failover_priority = 0
#     zone_redundant    = false
#   }

#   backup {
#     interval_in_minutes = 240
#     retention_in_hours  = 8
#     storage_redundancy  = "Geo"
#     type                = "Periodic"
#   }

#   tags = {
#     defaultExperience    = "Azure Table"
#     hidden-workload-type = "Learning"
#   }
# }