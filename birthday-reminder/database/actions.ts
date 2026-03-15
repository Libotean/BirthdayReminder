import { Linking, Alert } from 'react-native';

export function callPerson(phone: string | undefined) {
    if (!phone) return Alert.alert('Eroare', 'Nu exista numar de telefon salvat.');
    Linking.openURL(`tel:${phone}`);
}

export function whatsappPerson(phone: string | undefined) {
    if (!phone) return Alert.alert('Eroare', 'Nu exista numar de telefon salvat.');
    const formatted = phone.replace(/\s+/g, '').replace(/^0/, '40');
    Linking.openURL(`https://wa.me/${formatted}`).catch(() =>
        Alert.alert('Eroare', 'WhatsApp nu este instalat.')
    );
}

export function messagePerson(phone: string | undefined) {
    if (!phone) return Alert.alert('Eroare', 'Nu exista numar de telefon salvat.');
    Linking.openURL(`sms:${phone}`);
}
 