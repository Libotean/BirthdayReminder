import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('birthdays.db');

export function initDB() {
    db.execSync(`CREATE TABLE IF NOT EXISTS birthdays (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        photo TEXT,
        birthdate TEXT NOT NULL    
    )`);

    db.execSync(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        reminderOnDay INTEGER NOT NULL DEFAULT 1,
        reminderDaysBefore INTEGER NOT NULL DEFAULT 3,
        reminderHour INTEGER NOT NULL DEFAULT 9,
        reminderMinutes INTEGER NOT NULL DEFAULT 0
    )`);

    try {
        db.execSync(`ALTER TABLE settings ADD COLUMN lang TEXT DEFAULT 'ro'`);
    } catch (_) {}

    db.execSync(`INSERT OR IGNORE INTO settings (id, reminderOnDay, reminderDaysBefore, reminderHour, reminderMinutes, lang)
        VALUES(1,1,3,9,0,'ro')`);
}

export default db;