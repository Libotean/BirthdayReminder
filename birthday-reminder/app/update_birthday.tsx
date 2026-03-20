import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import * as ImagePicker from 'expo-image-picker';
import { update, getAll, validateName, validatePhone, formatPhone } from '@/database/birthdays';
import { IconSymbol } from '@/components/ui/icon-symbol';
import DatePickerModal from '@/components/DatePickerModal';
import { scheduleAllNotifications } from "@/database/notifications"
import * as Contacts from 'expo-contacts';
import PixelStars from '@/components/PixelStars';
import { useLang } from '@/i18n/LangContext';

export default function EditBirthdayScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [data, setData] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [poza, setPoza] = useState<string | null>(null);
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [dateError, setDateError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { tr } = useLang();
    const { id } = useLocalSearchParams();

    const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

    useEffect(() => {
        const found = getAll().find(b => b.id === parseInt(id as string));
        if (found) {
            setName(found.name);
            setPhone(found.phone);
            setPoza(found.photo || null);
            setData(new Date(found.birthdate));
        }
    }, []);

    if (!fontsLoaded) return null;
    const PIXEL = 'PressStart2P_400Regular';

    const pickContact = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') return;

        const result = await Contacts.presentContactPickerAsync();
        if (!result) return;
        
        const contact = result as any;
        if (contact.name) setName(contact.name);
        if (contact.phoneNumbers?.[0]?.number) {
            setPhone(formatPhone(contact.phoneNumbers[0].number));
        }
    };    

    const saveBirthday = useCallback(() => {
        const nErr = validateName(name);
        const pErr = validatePhone(phone);
        const today = new Date();
        if (data >= today) {
            setDateError(tr.updateBirthday.dataViitor);
            return;
        } else {
            setDateError('');
        }
        if (nErr || pErr) return;
        update(parseInt(id as string), {
            name,
            phone,
            photo: poza || '',
            birthdate: data.toISOString()
        });
        scheduleAllNotifications();
        router.back();
    }, [name, phone, data, poza, id]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!result.canceled) setPoza(result.assets[0].uri);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#F7F7F5' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}
        >
           <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: '28%' }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <PixelStars count={50} areaHeight={280} />

                <TouchableOpacity style={styles.btnLeft} onPress={() => router.back()}>
                    <IconSymbol size={16} name="chevron.left" color={'#fff'} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={[styles.headerLabel, { fontFamily: PIXEL }]}>{tr.updateBirthday.headerLabel}</Text>
                    <Text style={[styles.title, { fontFamily: PIXEL }]}>{tr.updateBirthday.title}</Text>
                </View>

                <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
                    {poza
                        ? <Image source={{ uri: poza }} style={styles.avatar} />
                        : <View style={styles.avatarPlaceholder}>
                            <IconSymbol size={28} name="camera" color={'#AAAAAA'} />
                            <Text style={[styles.avatarHint, { fontFamily: PIXEL }]}>{tr.updateBirthday.foto}</Text>
                        </View>
                    }
                </TouchableOpacity>

                <View style={styles.formCard}>

                    <Text style={[styles.label, { fontFamily: PIXEL }]}>{tr.updateBirthday.nume}</Text>
                    <TextInput
                        placeholder="Pop Ion"
                        placeholderTextColor="#BBBBBB"
                        value={name}
                        onChangeText={(v) => { setName(v); setNameError(validateName(v)); }}
                        style={[styles.input, nameError ? styles.inputError : null, { fontFamily: PIXEL }]}
                    />
                    {nameError ? <Text style={[styles.errorText, { fontFamily: PIXEL }]}>{nameError}</Text> : null}

                    <Text style={[styles.label, { fontFamily: PIXEL }]}>{tr.updateBirthday.telefon}</Text>
                    <View style={styles.phoneRow}>
                        <TextInput
                            placeholder="07xx xxx xxx"
                            placeholderTextColor="#BBBBBB"
                            value={phone}
                            onChangeText={(v) => { setPhone(v); setPhoneError(validatePhone(v)); }}
                            keyboardType="phone-pad"
                            style={[styles.phoneInput, phoneError ? styles.inputError : null, { fontFamily: PIXEL }]}
                        />
                        <TouchableOpacity style={styles.contactBtn} onPress={pickContact}>
                            <IconSymbol size={18} name="person" color={'#111'} />
                        </TouchableOpacity>
                    </View>
                    {phoneError ? <Text style={[styles.errorText, { fontFamily: PIXEL }]}>{phoneError}</Text> : null}

                    <Text style={[styles.label, { fontFamily: PIXEL }]}>{tr.updateBirthday.dataNasterii}</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <View style={[styles.input, styles.dateInput, dateError ? styles.inputError : null]}>
                            <Text style={[styles.dateText, { fontFamily: PIXEL }]}>
                                {data.toLocaleDateString('ro-RO')}
                            </Text>
                            <IconSymbol size={14} name="calendar" color={'#AAAAAA'} />
                        </View>
                    </TouchableOpacity>
                    {dateError ? <Text style={[styles.errorText, { fontFamily: PIXEL }]}>{dateError}</Text> : null}

                </View>

                {showPicker && (
                    <DatePickerModal
                        value={data}
                        onChange={(d) => setData(d)}
                        onClose={() => setShowPicker(false)}
                    />
                )}

                <TouchableOpacity style={[styles.saveButton, loading && { opacity: 0.6 }]} onPress={async () => {if (loading) return; saveBirthday(); setLoading(true);}}>
                    <Text style={[styles.saveButtonText, { fontFamily: PIXEL }]}>{loading ? tr.updateBirthday.seSalveaza : tr.updateBirthday.salveaza}</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F5',
    },

    btnLeft: {
        position: 'absolute',
        left: 20,
        top: '9%',
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },

    header: {
        marginBottom: 22,
        marginTop: 10,
    },
    headerLabel: {
        fontSize: 9,
        color: '#AAAAAA',
        letterSpacing: 1,
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        color: '#111111',
        letterSpacing: 1,
        lineHeight: 28,
    },

    avatarWrapper: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 26,
    },
    avatarPlaceholder: {
        width: 90,
        height: 90,
        borderRadius: 26,
        backgroundColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    avatarHint: {
        fontSize: 7,
        color: '#AAAAAA',
        letterSpacing: 2,
    },

    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 15,
    },
    label: {
        fontSize: 7,
        color: '#AAAAAA',
        letterSpacing: 2,
        marginBottom: 8,
        marginTop: 9,
    },
    input: {
        backgroundColor: '#F7F7F5',
        borderRadius: 12,
        padding: 12,
        fontSize: 12,
        color: '#111',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 10,
        color: '#111',
        letterSpacing: 1,
    },
    inputError: {
        borderWidth: 1.5,
        borderColor: '#FF3B30',
    },
    errorText: {
        fontSize: 6,
        color: '#FF3B30',
        marginTop: 5,
        letterSpacing: 1,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    phoneInput: {
        flex: 1,
        backgroundColor: '#F7F7F5',
        borderRadius: 12,
        padding: 12,
        fontSize: 12,
        color: '#111',
    },
    contactBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    saveButton: {
        backgroundColor: '#111111',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#111',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 11,
        letterSpacing: 2,
    },
});