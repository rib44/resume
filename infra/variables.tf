variable "subsciption" {
  description = "Azure Subsciption"
  type = string
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The Azure region to deploy resources in"
  type        = string
}

variable "storage_account_name" {
  description = "Storage account name"
  type        = string
}

variable "cosmosdb_account_name" {
  description = "Cosmos DB account name"
  type        = string
}

variable "function_app_name" {
  description = "Function app name"
  type        = string
}