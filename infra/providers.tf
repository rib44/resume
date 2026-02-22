terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.58.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.8.1"
    }
  }

  required_version = "~> 1.14.3"
}

provider "azurerm" {
  features {}
  subscription_id = var.subsciption
}

provider "random" {}