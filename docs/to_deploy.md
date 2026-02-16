# Steps to deploy all the resources.

### Deploy: Storage Account
# TODO

1. Create the storage account via Terraform.
2. To upload files to the `$web` blob container.
    ```bash
    # Run from the root folder
    az storage blob sync \
        --container '$web' \
        --account-name $(terraform output -raw storage_account_name) \
        --source ./app_frontend/ \
        --exclude-pattern ".git*;*.tfstate" \
        --delete-destination true # BEWARE: deletes blobs in destination
    ```

### Deploy: Storage Container
# TODO


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
6. Set the `CORS` policy for the app to allow the below two URLs.
```
http://resume.mistiquer.work.gd
https://resume.mistiquer.work.gd
```

