import db from './db';

export type Settings = {
    id? : number;
    reminderOnDay : number;
    reminderDaysBefore : number;
    reminderHour : number;
    reminderMinutes : number;
};

export function getSettings(): Settings {
    return db.getFirstSync('SELECT * FROM settings WHERE id = 1') as Settings;
}

export function updateSettings(settings: Settings){
    db.runSync('UPDATE settings SET reminderOnDay = ?, reminderDaysBefore = ?, reminderHour = ?, reminderMinutes = ? WHERE id = 1',
        settings.reminderOnDay, settings.reminderDaysBefore, settings.reminderHour, settings.reminderMinutes);
}
