# NatureDefenders API Documentation

Welcome to the NatureDefenders API documentation. This guide provides details about the available API endpoints, their request and response formats, and other relevant information.

## Base URL

The base URL for all endpoints is: `https://nature-defenders.onrender.com/`

## User Registration

### `POST /users/register`

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "countryOfResidence": "USA",
}
```

**Response:**

- Status: 201 Created
- Body:
 
  ```json
  {
    "_id": "user-id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "countryOfResidence": "USA",
    "role": "admin",
  }
  ```
