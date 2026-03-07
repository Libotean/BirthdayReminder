import db from './db';

export type Birthday = {
    id? : number;
    name : string;
    phone : string;
    photo : string;
    birthdate : string;
}; 

export function getAll(): Birthday[] {
    const result = db.getAllSync('SELECT * FROM birthdays');
    return result as Birthday[];
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
}