import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getAll, insert, exists } from './birthdays';

export async function exportData() {
    const birthdays = getAll();
    
    const data = birthdays.map(b => ({
        name: b.name,
        phone: b.phone,
        photo: '',
        birthdate: b.birthdate,
    }));
    
    const json = JSON.stringify(data, null, 2);
    const path = FileSystem.documentDirectory + 'birthday_backup.json';
    
    await FileSystem.writeAsStringAsync(path, json);
    await Sharing.shareAsync(path);
}

export async function importData(uri: string) {
    const content = await FileSystem.readAsStringAsync(uri);
    const birthdays = JSON.parse(content);
    
    let importate = 0;
    let sarite = 0;

    for (const b of birthdays) {
        if (exists(b.name, b.birthdate, b.phone)) {
            sarite++;
        } else {
            insert({
                name: b.name,
                phone: b.phone,
                photo: b.photo,
                birthdate: b.birthdate,
            });
            importate++;
        }
    }

    return { importate, sarite };
}