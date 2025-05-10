# TP2: RESTful API with Express.js and SQLite

This project is an implementation of a RESTful API using Node.js, Express.js, and SQLite3, as per the "TP2: Création d'une API Restful avec Express JS" practical work. It manages a collection of "personnes" (people) with basic CRUD (Create, Read, Update, Delete) operations.
The project also includes an optional integration with Keycloak for OAuth 2.0 authentication and authorization.

## Features

*   CRUD operations for "personnes" (name, address).
*   Data persistence using SQLite3.
*   RESTful API design principles.
*   (Optional) Secure endpoints using Keycloak (OAuth 2.0).

## Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) installed (v14.x or higher recommended).
*   (Optional) A running [Keycloak](https://www.keycloak.org/) instance if you want to test the secured endpoints.
*   (Optional) [Postman](https://www.postman.com/) or a similar API testing tool.

## Installation

1.  **Clone the repository (or create the project from scratch):**
    ```bash
    # If you have it in a git repo:
    # git clone <your-repository-url>
    # cd <project-directory>

    # If starting from scratch, ensure you have the project files.
    ```

2.  **Install dependencies:**
    Navigate to the project's root directory in your terminal and run:
    ```bash
    npm install
    ```
    This will install Express, SQLite3, and optionally `express-session` and `keycloak-connect` if you plan to use Keycloak.

3.  **(Optional) Keycloak Configuration:**
    If you want to use Keycloak integration:
    *   Create a file named `keycloak-config.json` in the root of your project.
    *   Populate it with your Keycloak client configuration. Example:
        ```json
        {
          "realm": "your-api-realm",
          "auth-server-url": "http://localhost:8080/auth",
          "ssl-required": "external",
          "resource": "your-api-client-id",
          "credentials": {
            "secret": "your-client-secret"
          },
          "confidential-port": 0
        }
        ```
        **Note:** Replace placeholder values (`your-api-realm`, `your-api-client-id`, `your-client-secret`, and potentially `auth-server-url`) with your actual Keycloak setup details. Ensure your Keycloak server is running and the client is configured correctly (e.g., Access Type: confidential).

## Running the Application

1.  **Start the server:**
    ```bash
    node index.js
    ```
2.  The server will start, typically on `http://localhost:3000`. You should see console messages indicating:
    *   Connection to the SQLite database.
    *   The server running on the specified port.

The SQLite database file (`maBaseDeDonnees.sqlite`) will be created in the project root if it doesn't exist. If you modify the table structure in `database.js` (e.g., add a new column), you might need to delete this file and restart the server to apply the changes.

## API Endpoints

The API provides the following endpoints:

---

### `GET /`

*   **Description:** Welcome message for the API.
*   **Response (200 OK):**
    ```json
    "Registre de personnes! Choisissez le bon routage!"
    ```

---

### `GET /personnes`

*   **Description:** Retrieves a list of all "personnes".
*   **Protected:** Yes (if Keycloak is enabled and configured on this route).
*   **Response (200 OK):**
    ```json
    {
        "message": "success",
        "data": [
            {
                "id": 1,
                "nom": "Bob",
                "adresse": "1 rue de Paris"
            },
            {
                "id": 2,
                "nom": "Alice",
                "adresse": "2 rue Exemple"
            }
        ]
    }
    ```

---

### `POST /personnes`

*   **Description:** Creates a new "personne".
*   **Protected:** Yes (if Keycloak is enabled and configured on this route).
*   **Request Body (application/json):**
    ```json
    {
        "nom": "David",
        "adresse": "123 Main St"
    }
    ```
*   **Response (200 OK - ideally 201 Created):**
    ```json
    {
        "message": "success",
        "data": {
            "id": 3,
            "nom": "David",
            "adresse": "123 Main St"
        }
    }
    ```
*   **Error Response (400 Bad Request - e.g., if `nom` is missing):**
    ```json
    {
        "error": "Le nom est requis"
    }
    ```

---

### `GET /personnes/:id`

*   **Description:** Retrieves a specific "personne" by their ID.
*   **Protected:** Yes (if Keycloak is enabled and configured on this route).
*   **URL Parameter:** `id` (integer) - The ID of the "personne".
*   **Response (200 OK):**
    ```json
    {
        "message": "success",
        "data": {
            "id": 1,
            "nom": "Bob",
            "adresse": "1 rue de Paris"
        }
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
        "error": "Personne non trouvée"
    }
    ```

---

### `PUT /personnes/:id`

*   **Description:** Updates an existing "personne" by their ID.
*   **Protected:** Yes (if Keycloak is enabled and configured on this route).
*   **URL Parameter:** `id` (integer) - The ID of the "personne" to update.
*   **Request Body (application/json):**
    ```json
    {
        "nom": "Robert (Bob)",
        "adresse": "456 Oak Ave, Updated"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
        "message": "success",
        "data": {
            "id": "1", 
            "nom": "Robert (Bob)",
            "adresse": "456 Oak Ave, Updated"
        }
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
        "error": "Personne non trouvée pour la mise à jour"
    }
    ```

---

### `DELETE /personnes/:id`

*   **Description:** Deletes a "personne" by their ID.
*   **Protected:** Yes (if Keycloak is enabled and configured on this route).
*   **URL Parameter:** `id` (integer) - The ID of the "personne" to delete.
*   **Response (200 OK):**
    ```json
    {
        "message": "success"
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
        "error": "Personne non trouvée pour la suppression"
    }
    ```

---

### `GET /secure` (Example Keycloak-protected route)

*   **Description:** An example route to test Keycloak authentication.
*   **Protected:** Yes (requires Keycloak authentication).
*   **Response (200 OK if authenticated):**
    ```json
    {
        "message": "Vous êtes authentifié !",
        "user": "username_from_keycloak"
    }
    ```
*   **Response (401 Unauthorized or redirect if not authenticated).**

---

## Testing Secured Endpoints (with Keycloak)

If Keycloak is enabled:

1.  Ensure your Keycloak server is running and your client (`resource` in `keycloak-config.json`) is correctly configured.
2.  In Postman (or your API client):
    *   For protected routes, go to the "Authorization" tab.
    *   Select Type: "OAuth 2.0".
    *   Click "Get New Access Token".
    *   Configure the token request:
        *   **Grant Type:** `Password Credentials` (for testing) or `Authorization Code`.
        *   **Access Token URL:** `YOUR_KEYCLOAK_HOST/auth/realms/YOUR_REALM/protocol/openid-connect/token` (e.g., `http://localhost:8080/auth/realms/api-realm/protocol/openid-connect/token`)
        *   **Client ID:** Your client ID from `keycloak-config.json`.
        *   **Client Secret:** Your client secret from `keycloak-config.json`.
        *   **Username:** A valid user in your Keycloak realm.
        *   **Password:** The user's password.
        *   **Scope:** `openid` (or as needed).
    *   Request and use the obtained token. Postman will usually add it as a `Bearer` token in the `Authorization` header.



