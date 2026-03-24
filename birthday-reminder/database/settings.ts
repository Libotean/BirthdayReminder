import db from './db';
export type Settings = {
    id? : number;
    reminderOnDay : number;
    reminderDaysBefore : number;
    reminderHour : number;
    reminderMinutes : number;
    lang : string;
};

export function getSettings(): Settings {
    return db.getFirstSync('SELECT * FROM settings WHERE id = 1') as Settings;
}

export function updateSettings(settings: Settings){
    db.runSync('UPDATE settings SET reminderOnDay = ?, reminderDaysBefore = ?, reminderHour = ?, reminderMinutes = ?, lang = ? WHERE id = 1',
        settings.reminderOnDay, settings.reminderDaysBefore, settings.reminderHour, settings.reminderMinutes, settings.lang);
}

export function validateHour(value: string, errNaN: string, errRange: string): string {
    const num = Number(value);
    if (isNaN(num)) return errNaN;
    if (num < 0 || num > 23) return errRange;
    return '';
}

export function validateMinutes(value: string, errNaN: string, errRange: string): string {
    const num = Number(value);
    if (isNaN(num)) return errNaN;
    if (num < 0 || num > 59) return errRange;
    return '';
}