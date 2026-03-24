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

export function getDaysUntilNextBirthday(birthdate: string, azi: string = 'Azi!', zi: string = 'zi', zile: string = 'zile') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bday = new Date(birthdate);
    const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    if (next < today) next.setFullYear(today.getFullYear() + 1);
    const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return azi;
    else if (diff === 1) return `${diff} ${zi}`;
    else return `${diff} ${zile}`;
}

export function getAge(birthdate: string) {
    const year = new Date(birthdate).getFullYear();
    const today = new Date();
    const age = today.getFullYear() - year;
    return age;
};

export function groupByMonth(birthdays: Birthday[], luni: string[]) {
    const grouped: { [key: string]: Birthday[] } = {};

    birthdays.forEach(b => {
        const month = luni[new Date(b.birthdate).getMonth()];
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(b);
    });

    return Object.keys(grouped).map(month => ({
        title: month,
        data: grouped[month]
    }));
}

export function validateName(value: string, errObligatoriu: string = 'Numele este obligatoriu.'): string {
    if (!value.trim()) return errObligatoriu;
    return '';
};

export function validatePhone(value: string, errInvalid: string = 'Format invalid. Ex: 07xx xxx xxx'): string {
    if (!value.trim()) return '';
    const PHONE_REGEX = /^07\d{2}\s?\d{3}\s?\d{3}$/;
    if (!PHONE_REGEX.test(value.trim())) return errInvalid;
    return '';
};

export function formatPhone(phone: string): string {
    let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleaned.startsWith('+40')) {
        cleaned = '0' + cleaned.slice(3);
    }
    return cleaned;
}

export function exists(name: string, birthdate: string, phone: string): boolean {
    if (phone) {
        const result = db.getFirstSync(
            'SELECT id FROM birthdays WHERE phone = ?',
            phone
        ) as any;
        return result !== null;
    } else {
        const result = db.getFirstSync(
            'SELECT id FROM birthdays WHERE name = ? AND birthdate = ?',
            name, birthdate
        ) as any;
        return result !== null;
    }
}