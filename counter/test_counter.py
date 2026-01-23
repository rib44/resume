import pytest
import json
from unittest import mock
from azure.functions import HttpRequest
from azure.core.exceptions import ResourceNotFoundError, ResourceModifiedError
from function_app import (
    visitor,
    get_table_client,
    ensure_counter_exists,
    increment_visitor_count
)


# will be applied to all tests
@pytest.fixture(autouse=True)
def mock_environment():
    with mock.patch.dict(
            "os.environ", {"CONNECTION_STRING": "fake_connection_string"}):
        yield


# Mock TableClient for testing
@pytest.fixture
def mock_table_client():
    client = mock.Mock()
    yield client


# Test: Visitor function - success case
def test_visitor_success(mock_table_client):
    mock_table_client.get_entity.return_value = {
        "PartitionKey": "P1", "RowKey": "R1", "visitors": 0
    }
    mock_table_client.update_entity.return_value = None
    mock_table_client.create_entity.return_value = None

    with mock.patch(
        "function_app.get_table_client",
        return_value=mock_table_client
    ):
        req = mock.Mock(spec=HttpRequest)
        req.get_json.return_value = {}

        response = visitor(req)

    assert response.status_code == 200
    assert json.loads(response.get_body().decode()) == {"visitors": 1}
    mock_table_client.update_entity.assert_called_once()


# # Test: Visitor function - failure case
# def test_visitor_failure(mock_table_client):
#     mock_table_client.get_entity.side_effect = Exception("Database failure")

#     with mock.patch("function_app.get_table_client",
#                     return_value=mock_table_client
#                     ):
#         req = mock.Mock(HttpRequest)
#         req.get_json.return_value = {}

#         response = visitor(req)

#     assert response.status_code == 500
#     assert response.get_json() == {"error": "Internal server error"}


# # Test: Ensure Counter Exists - Entity not found, should create it
# def test_ensure_counter_exists_create(mock_table_client):
#     mock_table_client.get_entity.side_effect = ResourceNotFoundError
#     mock_table_client.create_entity.return_value = None

#     ensure_counter_exists(mock_table_client)
#     mock_table_client.create_entity.assert_called_once_with({
#         "PartitionKey": "P1",
#         "RowKey": "R1",
#         "visitors": 0
#     })


# # Test: Increment Visitor Count - No concurrency error
# def test_increment_visitor_count_success(mock_table_client):
#     mock_table_client.get_entity.return_value = {
#         "PartitionKey": "P1",
#         "RowKey": "R1",
#         "visitors": 1,
#         "etag": "etag_value"
#     }
#     mock_table_client.update_entity.return_value = None

#     result = increment_visitor_count(mock_table_client)
#     assert result == 2  # Expected count after increment


# # Test: Increment Visitor Count - ResourceModifiedError (retry case)
# def test_increment_visitor_count_retry(mock_table_client):
#     # Simulate a concurrency conflict error on the first attempt
#     mock_table_client.get_entity.side_effect = [
#         ResourceModifiedError("Conflict"),
#         {
#             "PartitionKey": "P1",
#             "RowKey": "R1",
#             "visitors": 1,
#             "etag": "etag_value"
#         }
#     ]
#     mock_table_client.update_entity.return_value = None

#     result = increment_visitor_count(mock_table_client)
#     assert result == 2  # Expected count after retry

#     # Ensure retry happens
#     assert mock_table_client.update_entity.call_count == 2


# # Test: Ensure Counter Exists - No action needed if it already exists
# def test_ensure_counter_exists_already_exists(mock_table_client):
#     mock_table_client.get_entity.return_value = {
#         "PartitionKey": "P1", "RowKey": "R1", "visitors": 10
#     }
#     ensure_counter_exists(mock_table_client)
#     mock_table_client.create_entity.assert_not_called()
