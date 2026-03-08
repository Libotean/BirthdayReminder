import React, { use, useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { insert } from '@/database/birthdays';
import { IconSymbol } from '@/components/ui/icon-symbol';

const NAME_REGEX = /^[a-zA-ZăâîșțĂÂÎȘȚ\s\-]+$/;
const PHONE_REGEX = /^07\d{2}\s?\d{3}\s?\d{3}$/;

export default function AddBirthdayScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [data, setData] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [poza, setPoza] = useState<string | null>(null);
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [dateError, setDateError] = useState('');
    const router = useRouter();

    const validateName = (value: string) => {
        if (!value.trim()) {
            setNameError('Numele este obligatoriu.');
        }
        else if (!NAME_REGEX.test(value.trim())) {
            setNameError('Numele poate contine doar litere, spatii si cratime.');
        }
        else {
            setNameError('');
        }
    };

    const validatePhone = (value: string) => {
        if (!PHONE_REGEX.test(value.trim())) {
            setPhoneError('Format invalid. Ex: 07xx xxx xxx');
        }
        else {
            setPhoneError('');
        }
    };

    const saveBirthday = () => {
        validateName(name);
        validatePhone(phone);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (data >= today) {
            setDateError('Data nasterii nu poate fi in viitor.');
            return;
        }
        else {
            setDateError('');
        }

        if (!NAME_REGEX.test(name.trim()) || !name.trim()) return;
        if (!PHONE_REGEX.test(phone.trim()) || !phone.trim()) return;

        insert({
            name,
            phone,
            photo: poza || '',
            birthdate: data.toISOString()
        });
        router.back();
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setPoza(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
             <TouchableOpacity style={styles.buttonLeft} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}><IconSymbol size={16} name="chevron.left" color={'#ffff'}/></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center' }}>
                {poza ? <Image source={{ uri: poza }} style={styles.avatar} /> : 
                    <View style={styles.avatarPlaceHolder}>
                        <Text style={styles.icon}><IconSymbol size={30} name="camera" color={'#ffff'}/></Text>
                    </View>}
            </TouchableOpacity>

            <Text style={styles.elements}>Nume</Text>
            <TextInput
                placeholder="Pop Ion"
                value={name}
                onChangeText={(v) => { setName(v); validateName(v); }}
                style={[styles.data, nameError ? styles.inputError : null]}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            <Text style={styles.elements}>
                Telefon
            </Text>
            <TextInput
                placeholder="07xx xxx xxx"
                value={phone}
                onChangeText={(v) => { setPhone(v); validatePhone(v); }}
                keyboardType="phone-pad"
                style={[styles.data, phoneError ? styles.inputError : null]}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            <Text style={styles.elements}>
                Data nasterii
            </Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <Text style={[styles.data, dateError ? styles.inputError : null]}>{data.toLocaleDateString('ro-RO')}</Text>
            </TouchableOpacity>
            {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
            {showPicker && (
                <DateTimePicker
                    value={data}
                    mode="date"
                    maximumDate={new Date()}
                    onChange={(_, dataAleasa) => {
                    setShowPicker(false);
                    if (dataAleasa) {setData(dataAleasa); setDateError('');}
                    }}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={saveBirthday}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1, paddingTop: '30%', paddingHorizontal: 20, backgroundColor: '#fff'},
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
    elements: { fontSize:18, fontWeight: 'bold', marginTop: 10 },
    data: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginTop: 5 },
    inputError: { borderWidth: 1, borderColor: '#e53935' },
    errorText: { color: '#e53935', fontSize: 12, marginTop: 3 },
    avatar: {borderRadius: 50, width: 100, height: 100, marginTop: 30, alignSelf: 'center'},
    avatarPlaceHolder: {borderRadius: 50, width: 100, height: 100, backgroundColor: '#ccc', justifyContent: 'center', alignSelf: 'center'},
    icon: {alignSelf: 'center'},
    button: {
        marginTop: 30,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        width: '35%'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    buttonLeft: {
        display: 'flex',
        position: 'absolute', left: 10, top: '10%',
        alignSelf: 'flex-start',
        backgroundColor: '#1A1A1A',
        width: 40, height: 40, borderRadius: 28,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
    },

});