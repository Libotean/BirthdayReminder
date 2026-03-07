import React, { useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAll, Birthday, getInitials, getAge, getDaysUntilNextBirthday } from '@/database/birthdays';

export default function BirthdayInfoScreen() {
    const { id } = useLocalSearchParams();
    const [ person, setPerson ] = useState<Birthday | null>(null);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const found = getAll().find(b => b.id === parseInt(id as string));
            if (found) setPerson(found);
        }, [])
    );

    if (!person) return <Text>"Se incarca..."</Text>;

    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonLeft} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}><IconSymbol size={16} name="chevron.left" color={'#ffff'}/></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={() => router.push(`/update_birthday?id=${person.id}`)}>
                <Text style={styles.buttonText}><IconSymbol size={16} name="pencil" color={'#ffff'}/></Text>
            </TouchableOpacity>
            {person?.photo ? <Image source={{ uri: person?.photo }} style={styles.avatar} /> : 
                <View style={styles.avatarPlaceHolder}>
                    <Text style={styles.initials}>{getInitials(person?.name || '')}</Text>
                </View>}
            <Text style={styles.title}>{person?.name}</Text>
            <Text style={styles.dateText}>{new Date(person?.birthdate || '').toLocaleDateString()}</Text>
            <Text style={styles.divider}></Text>
            <Text style={styles.ageText}>{getAge(person?.birthdate || '')} de ani in</Text>
            <Text style={styles.remained}>{getDaysUntilNextBirthday(person?.birthdate || '')}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, paddingTop: '25%', paddingHorizontal: 20, backgroundColor: '#ffff', },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 0, color: '#000', paddingBottom: 10, alignSelf: 'center' },
    avatar: {borderRadius: 50, width: 100, height: 100, alignSelf: 'center', marginBottom: 20, marginTop: '15%'},
    avatarPlaceHolder: {borderRadius: 50, width: 100, height: 100, backgroundColor: '#ccc', justifyContent: 'center', alignSelf: 'center'},
    initials: {color: '#555', fontSize: 40, fontWeight: 'bold', alignSelf: 'center'},
    elements: { fontSize:14, marginTop: -10, alignSelf: 'center', marginBottom: 10 },
    buttonRight: {
        display: 'flex',
        position: 'absolute', right: 10, top: '10%',
        alignSelf: 'flex-end',
        backgroundColor: '#1A1A1A',
        width: 40, height: 40, borderRadius: 28,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
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
    buttonText: { color: '#FFF', fontSize: 20, fontWeight: '300', lineHeight: 15 },
    remained: {fontSize: 22, backgroundColor: '#E0E0E0', borderRadius: 40, padding: 13, alignSelf: 'center', fontWeight: 'bold'},
    divider: { width: '80%', height: 1, backgroundColor: '#E0E0E0', alignSelf: 'center', marginVertical: 20 },
    dateText: { fontSize: 16, color: '#999', alignSelf: 'center', marginBottom: 6 },
    ageText: { fontSize: 16, color: '#555', fontWeight: 'bold', letterSpacing: 1, alignSelf: 'center', marginBottom: 15 },
    daysContainer: { alignSelf: 'center', alignItems: 'center', marginTop: 10 },
});