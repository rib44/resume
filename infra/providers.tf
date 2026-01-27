terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.58.0"
    }
  }

  required_version = "= 1.14.3"
}

provider "azurerm" {
  features {}
  subscription_id = "674e50c9-9a71-4e5b-9eeb-da6fc298edea"
}