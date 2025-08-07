# My Express App

This project is a simple Node.js application using Express and SQLite for a localhost-only environment. It provides a RESTful API for managing customer data.

## Advantages of SQLite

- **Lightweight**: SQLite is a serverless database that is easy to set up and requires minimal configuration.
- **Self-contained**: The entire database is stored in a single file, making it easy to manage and distribute.
- **Fast**: SQLite is optimized for speed and can handle a large number of transactions efficiently.
- **Cross-platform**: Works on various operating systems without requiring installation of a separate database server.

## One-time Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd my-express-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Create the database file and schema**:
   - Navigate to the `src/db` directory and run the SQL commands in `schema.sql` to create the necessary tables.

## Creating the Database File and Schema

- The database file will be created automatically when the application runs for the first time.
- The schema for the database is defined in `src/db/schema.sql`. This file includes the SQL commands to create the `customers` table.

## Building a REST API

- The API is built using Express and is defined in `src/routes/index.js`.
- The controllers for handling the API logic are located in `src/controllers/index.js`.

## Handling CORS

- CORS is enabled in the application to allow requests from different origins. This is configured in `src/app.js`.

## Validation and Error Management

- Input validation can be implemented using middleware in the routes.
- Error handling is managed in the controllers to ensure that appropriate responses are sent back to the client.

## Front-end Modifications

- The front-end can interact with the API using fetch or Axios to perform CRUD operations on customer data.
- Ensure that the front-end is set up to handle CORS if it is hosted on a different origin.

## Running and Testing the Application

1. **Start the server**:
   ```
   npm run dev
   ```

2. **Test the API**:
   - Use tools like Postman or curl to test the API endpoints.

## Optional Enhancements

- **Migrations**: Consider using a migration tool like `knex` to manage database schema changes.
- **GUI Tools**: Use SQLite GUI tools like DB Browser for SQLite to visualize and manage the database easily.

## License

This project is licensed under the MIT License.