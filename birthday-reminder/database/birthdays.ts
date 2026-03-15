import db from './db';

export type Birthday = {
    id? : number;
    name : string;
    phone : string;
    photo : string;
    birthdate : string;
}; 

export function getAll(): Birthday[] {
    const result = db.getAllSync('SELECT * FROM birthdays') as Birthday[];
    return result.sort((a, b) => {
        const daysA = parseInt(getDaysUntilNextBirthday(a.birthdate)) || 0;
        const daysB = parseInt(getDaysUntilNextBirthday(b.birthdate)) || 0;
        return daysA - daysB;
    });
};

export function insert(birthday: Birthday) {
    db.runSync(`INSERT INTO birthdays (name, phone, photo, birthdate) VALUES (?, ?, ?, ?)`,
        birthday.name, birthday.phone, birthday.photo, birthday.birthdate);
};

export function remove(id: number) {
    db.runSync(`DELETE FROM birthdays WHERE id = ?`, id);
};

export function update(id: number, birthday: Birthday) {
    db.runSync(`UPDATE birthdays SET name = ?, phone = ?, photo = ?, birthdate = ? WHERE id = ?`,
        birthday.name, birthday.phone, birthday.photo, birthday.birthdate, id);
};

export function getInitials(name: string) {
    const names = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return names;
};

export function getDaysUntilNextBirthday(birthdate: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bday = new Date(birthdate);
    const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    if (next < today) next.setFullYear(today.getFullYear() + 1);
    const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) {
        return 'Azi!';
    }
    else if (diff === 1) {
        return `${diff} zi`;
    }
    else {
        return `${diff} zile`;
    }
};

export function getAge(birthdate: string) {
    const year = new Date(birthdate).getFullYear();
    const today = new Date();
    const age = today.getFullYear() - year;
    return age;
};

export function groupByMonth(birthdays: Birthday[]) {
    const months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    const grouped: { [key: string]: Birthday[] } = {};

    birthdays.forEach(b => {
        const month = months[new Date(b.birthdate).getMonth()];
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(b);
    });

    return Object.keys(grouped).map(month => ({ 
        title: month,
        data: grouped[month]
    }));
};

export function validateName(value: string): string {
    const NAME_REGEX = /^[a-zA-ZăâîșțĂÂÎȘȚ\s\-]+$/;
    if (!value.trim()) return 'Numele este obligatoriu.';
    if (!NAME_REGEX.test(value.trim())) return 'Doar litere, spatii si cratime.';
    return '';
};

export function validatePhone(value: string): string {
    if (!value.trim()) return '';
    const PHONE_REGEX = /^07\d{2}\s?\d{3}\s?\d{3}$/;
    if (!PHONE_REGEX.test(value.trim())) return 'Format invalid. Ex: 07xx xxx xxx';
    return '';
};

export function formatPhone(phone: string): string {
    let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleaned.startsWith('+40')) {
        cleaned = '0' + cleaned.slice(3);
    }
    return cleaned;
}
