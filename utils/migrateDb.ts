import { SQLiteDatabase } from 'expo-sqlite';

interface MigrationStep {
  version: number;
  migrate: (db: SQLiteDatabase) => Promise<void>;
}

export async function migrateDbIfNeeded(db: SQLiteDatabase, migrations: MigrationStep[], targetVersion: number) {
  let result = await db.getFirstAsync<{ user_version: number } | null>(
    'PRAGMA user_version'
  );
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= targetVersion) {
    return;
  }

  // Sort migrations to ensure they're applied in order
  migrations.sort((a, b) => a.version - b.version);

  for (const migration of migrations) {
    if (migration.version > currentDbVersion && migration.version <= targetVersion) {
      await migration.migrate(db);
      currentDbVersion = migration.version;
    }
  }

  await db.execAsync(`PRAGMA user_version = ${targetVersion}`);
}

// Example usage:
// const migrations: MigrationStep[] = [
//   {
//     version: 1,
//     migrate: async (db: SQLiteDatabase) => {
//       await db.execAsync(`
//         PRAGMA journal_mode = 'wal';
//         CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
//       `);
//       await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
//       await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
//     }
//   },
//   // Add more migrations as needed
// ];
// 
// await migrateDbIfNeeded(db, migrations, 1);