import db from './db';
import { useLang } from '@/i18n/LangContext';
const { tr } = useLang();

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

export function validateHour(value: string): string {
    const num = Number(value);
    if (isNaN(num)) return tr.settings.doarNumere;
    if (num < 0 || num > 23) return tr.settings.oraInvalida;
    return '';
}

export function validateMinutes(value: string): string {
    const num = Number(value);
    if (isNaN(num)) return tr.settings.doarNumere;
    if (num < 0 || num > 59) return tr.settings.minuteInvalide;
    return '';
}