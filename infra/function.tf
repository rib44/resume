# Azure function App
#   Hosting Plan: Consumption

# App service plan
resource "azurerm_service_plan" "function-app" {
  name                         = "asp-app-service-plan-${random_integer.ri.result}"
  resource_group_name          = azurerm_resource_group.resume-rg.name
  location                     = azurerm_resource_group.resume-rg.location
  os_type                      = "Linux"
  sku_name                     = "Y1"
  maximum_elastic_worker_count = 1
}

# Function app
resource "azurerm_linux_function_app" "function_app" {
  name                = "${var.function_app_name}-${random_integer.ri.result}"
  resource_group_name = azurerm_resource_group.resume-rg.name
  location            = azurerm_resource_group.resume-rg.location
  service_plan_id     = azurerm_service_plan.function-app.id

  storage_account_name       = azurerm_storage_account.storage_acc.name
  storage_account_access_key = azurerm_storage_account.storage_acc.primary_access_key

  site_config {
    always_on       = false
    ftps_state      = "FtpsOnly"
    app_scale_limit = 10
    worker_count    = 1
    application_stack {
      python_version = "3.12"
    }
    cors {
      allowed_origins     = ["http://resume.mistiquer.work.gd", "https://portal.azure.com", "https://resume.mistiquer.work.gd"]
      support_credentials = false
    }
  }
}
