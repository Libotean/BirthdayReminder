import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getAll, insert, exists } from './birthdays';

export async function exportData(): Promise<string> {
    try {
        const birthdays = getAll();
        const data = birthdays.map(b => ({
            name: b.name,
            phone: b.phone,
            photo: '',
            birthdate: b.birthdate,
        }));
        const json = JSON.stringify(data, null, 2);
        const path = (FileSystem as any).documentDirectory + 'birthday_backup.json';
        await FileSystem.writeAsStringAsync(path, json);
        await Sharing.shareAsync(path);
        return 'ok';
    } catch (e) {
        return 'eroare la export';
    }
}

export async function importData(uri: string): Promise<{ importate: number; sarite: number; eroare?: string }> {
    try {
        const content = await FileSystem.readAsStringAsync(uri);
        const birthdays = JSON.parse(content);

        if (!Array.isArray(birthdays)) return { importate: 0, sarite: 0, eroare: 'fisier invalid' };

        let importate = 0;
        let sarite = 0;

        for (const b of birthdays) {
            if (!b.name || !b.birthdate) { sarite++; continue; }
            if (exists(b.name, b.birthdate, b.phone)) {
                sarite++;
            } else {
                insert({ name: b.name, phone: b.phone, photo: '', birthdate: b.birthdate });
                importate++;
            }
        }
        return { importate, sarite };
    } catch (e) {
        return { importate: 0, sarite: 0, eroare: 'fisier corupt sau invalid' };
    }
}