import React, { use, useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { update, getAll } from '@/database/birthdays';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EditBirthdayScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [data, setData] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [poza, setPoza] = useState<string | null>(null);
    const router = useRouter();

    const { id } = useLocalSearchParams();

    useEffect(() => {
        const found = getAll().find(b => b.id === parseInt(id as string));
        if (found) {
            setName(found.name);
            setPhone(found.phone);
            setPoza(found.photo);
            setData(new Date(found.birthdate));
        }
    }, []);

    const saveBirthday = () => {
        update(parseInt(id as string), {
            name,
            phone,
            photo: poza || '',
            birthdate: data.toISOString()
        });
        router.back();
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setPoza(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
             <TouchableOpacity style={styles.buttonLeft} onPress={() => router.back()}>
                <Text style={styles.buttonText}><IconSymbol size={16} name="chevron.left" color={'#ffff'}/></Text>
            </TouchableOpacity>
            <Text style={styles.title}>Modifica ziua de nastere</Text>

            <TouchableOpacity onPress={pickImage}>
                {poza ? <Image source={{ uri: poza }} style={styles.avatar} /> : <Image source={require('../assets/images/react-logo.png')} style={styles.avatar} />}
            </TouchableOpacity>

            <Text style={styles.elements}>Nume</Text>
            <TextInput
                placeholder="Pop Ion"
                value={name}
                onChangeText={setName}
                style={styles.data}
            />
            <Text style={styles.elements}>
                Telefon
            </Text>
            <TextInput
                placeholder="07xx xxx xxx"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.data}
            />
            <Text style={styles.elements}>
                Data nasterii
            </Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <Text style={styles.data}>{data.toLocaleDateString('ro-RO')}</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={data}
                    mode="date"
                    onChange={(_, dataAleasa) => {
                    setShowPicker(false);
                    if (dataAleasa) setData(dataAleasa);
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
    container: {flex: 1, paddingTop: '35%', paddingHorizontal: 20, backgroundColor: '#fff'},
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
    elements: { fontSize:18, fontWeight: 'bold', marginTop: 10 },
    data: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5, marginTop: 5 },
    avatar: {borderRadius: 50, width: 100, height: 100, marginTop: 30, alignSelf: 'center'},
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