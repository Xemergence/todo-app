import { SQLDatabase } from "encore.dev/storage/sqldb";

export const todoDB = new SQLDatabase("todo", {
  migrations: "./migrations",
});
