import { toastConfig } from '@/components/ToastConfig';
import { TabBarVisibilityProvider } from '@/contexts/TabBarVisibilityContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router/stack';
import { Suspense, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { ActivityIndicator } from 'react-native';
import { migrateDbIfNeeded } from '@/utils/migrateDb';
import { useUserStore } from '@/stores/UserStore';

// Define the MigrationStep type
type MigrationStep = {
  version: number;
  migrate: (db: SQLiteDatabase) => Promise<void>;
};

// Define the migrations array
const migrations: MigrationStep[] = [
  {
    version: 1,
    migrate: async (db: SQLiteDatabase) => {
      await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        
        CREATE TABLE IF NOT EXISTS preferences (
          key TEXT PRIMARY KEY,
          value TEXT
        );

        CREATE TABLE IF NOT EXISTS workouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workout_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS sets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          exercise_id INTEGER NOT NULL,
          weight REAL NOT NULL,
          reps INTEGER NOT NULL,
          FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
        );
      `);
    }
  },
  // Add more migrations as needed
];

const initDatabase = async (db: SQLiteDatabase) => {
  await migrateDbIfNeeded(db, migrations, 1);
};

const LayoutContent = () => {
  const db = useSQLiteContext();
  const { loadPreferences } = useUserStore();

  useEffect(() => {
    loadPreferences(db);
  }, [db, loadPreferences]);

  return (
    <ThemeProvider>
      <TabBarVisibilityProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Toast config={toastConfig} />
      </TabBarVisibilityProvider>
    </ThemeProvider>
  );
};

export default function Layout() {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <SQLiteProvider
        databaseName="workouts.db"
        onInit={initDatabase}
        useSuspense>
        <LayoutContent />
      </SQLiteProvider>
    </Suspense>
  );
}
