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

export function validateHour(value: string): string {
    const num = Number(value);
    if (isNaN(num)) return 'doar numere';
    if (num < 0 || num > 23) return 'ora: 0-23';
    return '';
}

export function validateMinutes(value: string): string {
    const num = Number(value);
    if (isNaN(num)) return 'doar numere';
    if (num < 0 || num > 59) return '0-59';
    return '';
}