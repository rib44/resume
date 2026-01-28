# Resource Group
resource "azurerm_resource_group" "resume-rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "random_integer" "ri" {
  min = 10000
  max = 99999
}