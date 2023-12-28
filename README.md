# Database Migration
1. Execute `npm run build`
2. Execute `npm run migration:generate --name=your_migration_name`
3. Run the application. The migration will be run on application execution.

# Start local database
We use docker compose for the database.
Run: `docker compose up -d` for the mmsql database to start.