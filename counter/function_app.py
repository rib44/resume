import os
import json
import logging
import time
import azure.functions as func
from azure.data.tables import TableClient, UpdateMode
from azure.core.exceptions import (
    ResourceModifiedError,
    ResourceNotFoundError,
    ResourceExistsError
)
from typing import cast

# Constants
TABLE_NAME = "visitorCount"
PARTITION_KEY = "P1"
ROW_KEY = "R1"
UPDATE_RETRY = 5

CONNECTION_STRING = cast(str, os.getenv("CONNECTION_STRING"))

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


def get_table_client() -> TableClient:
    """
    Creates the TableClient instance
    """
    table_client = TableClient.from_connection_string(
        conn_str=CONNECTION_STRING,
        table_name=TABLE_NAME
    )
    logging.info("Table client created")
    return table_client


def ensure_counter_exists(table_client: TableClient) -> None:
    """
    Ensures that the visitor counter entity exists in the table.
    If it does not exist, it creates one with an initial count of 0.
    """
    try:
        table_client.get_entity(PARTITION_KEY, ROW_KEY)
        logging.info("Visitor counter entity exists")
    except ResourceNotFoundError:
        try:
            table_client.create_entity({
                "PartitionKey": PARTITION_KEY,
                "RowKey": ROW_KEY,
                "visitors": 0
            })
            logging.info("Visitor counter entity created")
        except ResourceExistsError:
            # Entity was created by another request in the meantime
            logging.info("Visitor counter entity already exists")
            pass
    except Exception as e:
        logging.exception(e)


def increment_visitor_count(table_client: TableClient) -> int:
    """
    Atomicallhy increments the visitor count using optimistic concurrency.

    :param table_client: TableClient instance
    :type table_client: TableClient
    :return: Updated visitor count
    :rtype: int
    """
    for _ in range(UPDATE_RETRY):
        try:
            entity = table_client.get_entity(
                partition_key=PARTITION_KEY,
                row_key=ROW_KEY
            )

            # update visitor count
            entity["visitors"] = entity.get("visitors", 0) + 1

            etag = entity.get("etag") or entity.get("odata.etag")

            table_client.update_entity(
                entity=entity,
                mode=UpdateMode.REPLACE,
                etag=etag
            )
            logging.info(f"Visitor count updated to {entity["visitors"]}")
            return entity["visitors"]

        except ResourceModifiedError:
            # another request updated the entity first, retry
            logging.warning("Concurrency conflict detected, retrying...")
            time.sleep(2 ** UPDATE_RETRY)  # Exponential backoff
            continue

    raise RuntimeError("Failed to update visitor count: concurrency updates.")


@app.route(route="visitor", methods=["POST"])
def visitor(req: func.HttpRequest) -> func.HttpResponse:
    """
    HTTP trigger function to increment the visitor count.
    Returns the updated visitor count as JSON.
    """
    try:
        table_client = get_table_client()
        ensure_counter_exists(table_client)
        count = increment_visitor_count(table_client)
        logging.info(f"Visitor count is now {count}")

        return func.HttpResponse(
            json.dumps({"visitors": count}),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        logging.exception(f"Visitor counter failed: {e}")
        return func.HttpResponse(
            json.dumps({"error": "Internal server error"}),
            status_code=500
        )
