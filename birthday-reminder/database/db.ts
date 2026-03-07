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
        )  
    `);
}

export default db;