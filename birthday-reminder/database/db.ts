import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('birthdays.db');

export function initDB() {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS birthdays (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            photo TEXT,
            birthdate TEXT NOT NULL    
        ); 
        
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY,
            reminderOnDay INTEGER NOT NULL DEFAULT 1,
            reminderDaysBefore INTEGER NOT NULL DEFAULT 3,
            reminderHour INTEGER NOT NULL DEFAULT 9,
            reminderMinutes INTEGER NOT NULL DEFAULT 0
        );

        INSERT OR IGNORE INTO settings (id, reminderOnDay, reminderDaysBefore, reminderHour, reminderMinutes)
        VALUES(1,1,3,9,0);
    `);
}

export default db;