import json
import pytest
from unittest.mock import MagicMock, patch

from azure.core.exceptions import (
    ResourceModifiedError,
    ResourceNotFoundError,
    ResourceExistsError
)

# Import the azure functions module to mock the request spec
import azure.functions as func

# Import the module containing the function
import function_app


# ----------------------------------------------------------------------
# Fixtures
# ----------------------------------------------------------------------

@pytest.fixture
def mock_request():
    """Creates a mock HTTP Request object."""
    req = MagicMock(spec=func.HttpRequest)
    req.method = "POST"
    req.route_params = {}
    req.get_json.return_value = {}
    return req


@pytest.fixture
def mock_table_client():
    """Creates a mock TableClient instance."""
    return MagicMock(spec=function_app.TableClient)


# ----------------------------------------------------------------------
# Tests
# ----------------------------------------------------------------------

class TestVisitorFunction:

    @patch('function_app.TableClient.from_connection_string')
    @patch('function_app.time.sleep')  # Mock sleep to avoid waiting during retries
    def test_happy_path_increment(
        self,
        mock_sleep,
        mock_table_client_factory,
        mock_request,
        mock_table_client
    ):
        """
        Test the standard flow where the counter exists and increments
        successfully.
        """
        # Setup mock factory to return our mock client
        mock_table_client_factory.return_value = mock_table_client

        # Simulate fetching an existing entity with count 10
        mock_table_client.get_entity.return_value = {
            "PartitionKey": "P1",
            "RowKey": "R1",
            "visitors": 10,
            "etag": "W/\"datetime'2023'\""
        }

        # Execute
        response = function_app.visitor(mock_request)

        # Assertions
        assert response.status_code == 200
        response_body = json.loads(response.get_body())
        assert response_body["visitors"] == 11

        # Verify update was called with optimistic concurrency
        # (REPLACE mode + etag)
        mock_table_client.update_entity.assert_called_once()
        call_kwargs = mock_table_client.update_entity.call_args.kwargs
        assert call_kwargs['mode'] == function_app.UpdateMode.REPLACE
        assert call_kwargs['etag'] == "W/\"datetime'2023'\""

    @patch('function_app.TableClient.from_connection_string')
    @patch('function_app.time.sleep')
    def test_creates_counter_if_missing(
        self,
        mock_sleep,
        mock_table_client_factory,
        mock_request,
        mock_table_client
    ):
        """
        Test when the counter does not exist: it should be created and then incremented.
        """
        mock_table_client_factory.return_value = mock_table_client

        # Side effect list for get_entity:
        # 1. Called by ensure_counter_exists -> raises NotFound
        # 2. Called by increment_visitor_count -> returns the new entity
        mock_table_client.get_entity.side_effect = [
            ResourceNotFoundError("Not found"),
            {
                "PartitionKey": "P1",
                "RowKey": "R1",
                "visitors": 0,
                "etag": "W/\"'0'\""
            }
        ]

        response = function_app.visitor(mock_request)

        assert response.status_code == 200
        response_body = json.loads(response.get_body())
        assert response_body["visitors"] == 1

        # Verify create was called
        mock_table_client.create_entity.assert_called_once_with({
            "PartitionKey": "P1",
            "RowKey": "R1",
            "visitors": 0
        })

    @patch('function_app.TableClient.from_connection_string')
    @patch('function_app.time.sleep')
    def test_concurrency_conflict_and_retry(
        self, mock_sleep,
        mock_table_client_factory,
        mock_request,
        mock_table_client
    ):
        """
        Test Optimistic Concurrency:
        1. First update attempt fails (ResourceModifiedError).
        2. Function retries.
        3. Second update succeeds.
        """
        mock_table_client_factory.return_value = mock_table_client

        # Always return the same entity when fetching
        mock_entity = {
            "PartitionKey": "P1",
            "RowKey": "R1",
            "visitors": 5,
            "etag": "W/\"'5'\""
        }
        mock_table_client.get_entity.return_value = mock_entity

        # First update fails, second succeeds
        mock_table_client.update_entity.side_effect = [
            ResourceModifiedError("Conflict"),
            None  # Success
        ]

        response = function_app.visitor(mock_request)

        assert response.status_code == 200
        response_body = json.loads(response.get_body())
        assert response_body["visitors"] == 6

        # Verify update was called twice (initial fail + retry)
        assert mock_table_client.update_entity.call_count == 2
        # Verify sleep was called (backoff logic)
        mock_sleep.assert_called_once()

    @patch('function_app.TableClient.from_connection_string')
    @patch('function_app.time.sleep')
    def test_max_retries_exceeded(
        self,
        mock_sleep,
        mock_table_client_factory,
        mock_request,
        mock_table_client
    ):
        """
        Test that the function returns 500 if all retries are exhausted.
        """
        mock_table_client_factory.return_value = mock_table_client

        mock_table_client.get_entity.return_value = {
            "PartitionKey": "P1",
            "RowKey": "R1",
            "visitors": 1,
            "etag": "W/\"'1'\""
        }

        # Always fail with conflict (UPDATE_RETRY is 5, so we mock 5 failures)
        mock_table_client.update_entity.side_effect = (
            ResourceModifiedError("Conflict")
        )

        response = function_app.visitor(mock_request)

        assert response.status_code == 500
        response_body = json.loads(response.get_body())
        assert "error" in response_body

        # Verify we tried exactly 5 times
        assert mock_table_client.update_entity.call_count == 5

    @patch('function_app.TableClient.from_connection_string')
    @patch('function_app.time.sleep')
    def test_race_condition_on_create(
        self,
        mock_sleep,
        mock_table_client_factory,
        mock_request,
        mock_table_client
    ):
        """
        Test scenario where two requests try to create the entity
        simultaneously.
        Ensure logic handles ResourceExistsError during creation gracefully.
        """
        mock_table_client_factory.return_value = mock_table_client

        # 1. get_entity (ensure) -> NotFound
        # 2. get_entity (increment) -> Returns data
        mock_table_client.get_entity.side_effect = [
            ResourceNotFoundError("Not found"),
            {"PartitionKey": "P1",
             "RowKey": "R1",
             "visitors": 0,
             "etag": "W/\"'0'\""}
        ]

        # create_entity raises ResourceExistsError (another request created it)
        mock_table_client.create_entity.side_effect = (
            ResourceExistsError("Already exists")
        )

        response = function_app.visitor(mock_request)

        assert response.status_code == 200
        response_body = json.loads(response.get_body())
        assert response_body["visitors"] == 1

    @patch('function_app.TableClient.from_connection_string')
    @patch('function_app.time.sleep')
    def test_general_exception_handling(
        self,
        mock_sleep,
        mock_table_client_factory,
        mock_request,
        mock_table_client
    ):
        """
        Test that unexpected exceptions result
        in a 500 Internal Server Error.
        """
        mock_table_client_factory.return_value = mock_table_client

        # Simulate a generic connection failure
        mock_table_client.get_entity.side_effect = (
            Exception("Database connection died")
        )

        response = function_app.visitor(mock_request)

        assert response.status_code == 500
        response_body = json.loads(response.get_body())
        assert "error" in response_body
