# Steps to deploy all the resources.

- [Steps to deploy all the resources.](#steps-to-deploy-all-the-resources)
    - [Deploy: Resource Group](#deploy-resource-group)
    - [Deploy: Storage Account](#deploy-storage-account)
    - [Deploy: Cosmos DB Table API (Serverless Capacity)](#deploy-cosmos-db-table-api-serverless-capacity)
- [TODO](#todo)
    - [Deploy: Function App](#deploy-function-app)

### Deploy: Resource Group
1. Use the terraform file.

### Deploy: Storage Account
1. Create the storage account via Terraform.
2. To upload files to the `$web` blob container. <br />
   `source`: [App Frontend](../app_frontend/) <br />
   `destination`: $web
    ```bash
    # Run from the infra folder
    az storage blob upload-batch \
        --destination '$web' \
        --account-name $(terraform output -raw storage_account_name) \
        --source ../app_frontend/ \
        --pattern "**/*.{html,css,js}" \
        --auth-mode login \
        --overwrite
    ```
    **DO_NOT_USE the below**
    ```bash
    # az CLI in development for the below method
    az storage blob sync \
        --container '$web' \
        --account-name $(terraform output -raw storage_account_name) \
        --source ./app_frontend/ \
        --exclude-pattern ".git*;*.tfstate;*.env" \
        --auth-mode login \
        --delete-destination true # BEWARE: deletes blobs in destination
    ```


### Deploy: Cosmos DB Table API (Serverless Capacity)
# TODO


### Deploy: Function App

1. Create the function app with `consumption` as the hosting option.
2. Use the previously created storage account.
3. Use the below command for deploying to function app via the terminal.
    ```bash
    # change path to function app folder, i.e., 'counter'
    cd app_backend/counter

    # will use az cli login
    func azure functionapp publish <YourFunctionAppName>
    ```

4. Set the API URL [conig.js](/app_frontend/config/config.js) (line 27) with the function app URL.
    > Note: Check the API URL before pasting that it does not contain the API endpoint itself. It should be ending with `azurewebsites.net/api`.

5. Set the environment variable in the function app for the below content.
    ```json
    {
        CONNECTION_STRING: "<cosmos_db_connection_string>"
    }
    ```
6. Set the CORS policy for the app to allow the below two URLs.
```
http://resume.mistiquer.work.gd
https://resume.mistiquer.work.gd
```

