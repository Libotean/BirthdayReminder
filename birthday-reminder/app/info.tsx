import React, { useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAll, Birthday, getInitials, getAge, getDaysUntilNextBirthday } from '@/database/birthdays';
import { whatsappPerson, callPerson, messagePerson } from '@/database/actions';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STAR_COLORS = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

function useStars(count: number, areaWidth: number, areaHeight: number) {
    return useMemo(() => Array.from({ length: count }, () => ({
        x: Math.random() * areaWidth,
        y: Math.random() * areaHeight,
        size: Math.random() < 0.5 ? 3 : 5,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        opacity: 0.25 + Math.random() * 0.35,
    })), [count, areaWidth, areaHeight]);
}

function PixelStars({ areaHeight }: { areaHeight: number }) {
    const stars = useStars(30, SCREEN_WIDTH, areaHeight);
    return (
        <View style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}>
            <Svg width={SCREEN_WIDTH} height={areaHeight}>
                {stars.map((s, i) => (
                    <Rect key={i} x={s.x} y={s.y} width={s.size} height={s.size} fill={s.color} opacity={s.opacity} />
                ))}
            </Svg>
        </View>
    );
}

export default function BirthdayInfoScreen() {
    const { id } = useLocalSearchParams();
    const [person, setPerson] = useState<Birthday | null>(null);
    const router = useRouter();
    const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

    useFocusEffect(
        useCallback(() => {
            const found = getAll().find(b => b.id === parseInt(id as string));
            if (found) setPerson(found);
        }, [])
    );

    if (!fontsLoaded || !person) return null;

    const PIXEL = 'PressStart2P_400Regular';
    const isToday = getDaysUntilNextBirthday(person.birthdate) === 'Azi!';
    const daysText = getDaysUntilNextBirthday(person.birthdate);

    return (
        <SafeAreaView style={styles.container}>

            <PixelStars areaHeight={320} />

            <TouchableOpacity style={styles.btnLeft} onPress={() => router.push('/')}>
                <IconSymbol size={16} name="chevron.left" color={'#fff'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnRight} onPress={() => router.push(`/update_birthday?id=${person.id}`)}>
                <IconSymbol size={16} name="pencil" color={'#fff'} />
            </TouchableOpacity>

            <View style={styles.avatarWrapper}>
                {isToday ? (
                    <LinearGradient
                        colors={['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.avatarGradientRing}
                    >
                        {person.photo
                            ? <Image source={{ uri: person.photo }} style={styles.avatar} />
                            : <View style={[styles.avatarPlaceholder, { backgroundColor: '#2A2A2A' }]}>
                                <Text style={[styles.initials, { fontFamily: PIXEL, color: '#fff' }]}>
                                    {getInitials(person.name)}
                                </Text>
                              </View>
                        }
                    </LinearGradient>
                ) : (
                    person.photo
                        ? <Image source={{ uri: person.photo }} style={[styles.avatar, styles.avatarBorder]} />
                        : <View style={styles.avatarPlaceholder}>
                            <Text style={[styles.initials, { fontFamily: PIXEL }]}>
                                {getInitials(person.name)}
                            </Text>
                          </View>
                )}
            </View>

            <Text style={[styles.name, { fontFamily: PIXEL }]}>{person.name}</Text>

            <Text style={[styles.dateText, { fontFamily: PIXEL }]}>
                {new Date(person.birthdate).toLocaleDateString('ro-RO')}
            </Text>

            <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => callPerson(person?.phone)}>
                    <Image source={require('../assets/images/phone.png')} style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => messagePerson(person?.phone)}>
                    <Image source={require('../assets/images/message.png')} style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => whatsappPerson(person?.phone)}>
                    <Image source={require('../assets/images/whatsapp_logo.png')} style={styles.whatsappButton} />
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={[styles.statValue, { fontFamily: PIXEL }]}>
                        {getAge(person.birthdate)}
                    </Text>
                    <Text style={[styles.statLabel, { fontFamily: PIXEL }]}>ani</Text>
                </View>
                {isToday ? (
                    <LinearGradient
                        colors={['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.statCardGradientWrap}
                    >
                        <View style={[styles.statCard, styles.statCardTodayInner]}>
                            <Text style={[styles.statValue, { fontFamily: PIXEL, color: '#fff' }]}>
                                Azi!
                            </Text>
                        </View>
                    </LinearGradient>
                ) : (
                    <View style={[styles.statCard, styles.statCardDark]}>
                        <Text style={[styles.statValue, { fontFamily: PIXEL, color: '#fff' }]}>
                            {daysText}
                        </Text>
                        <Text style={[styles.statLabel, { fontFamily: PIXEL, color: '#888' }]}>
                            ramase
                        </Text>
                    </View>
                )}

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F5',
        paddingHorizontal: 24,
        paddingTop: '14%',
    },
    btnLeft: {
        position: 'absolute',
        left: 20,
        top: '7%',
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
    btnRight: {
        position: 'absolute',
        right: 20,
        top: '7%',
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
    avatarWrapper: {
        alignSelf: 'center',
        marginTop: '18%',
        marginBottom: 20,
    },
    avatarGradientRing: {
        borderRadius: 30,
        padding: 3,
        overflow: 'hidden',
    },
    avatarBorder: {
        borderWidth: 3,
        borderColor: '#E5E5E5',
        borderRadius: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 28,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 28,
        backgroundColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 22,
        color: '#555',
    },
    name: {
        fontSize: 16,
        color: '#111',
        alignSelf: 'center',
        letterSpacing: 1,
        marginBottom: 10,
        lineHeight: 24,
    },
    dateText: {
        fontSize: 8,
        color: '#AAAAAA',
        alignSelf: 'center',
        letterSpacing: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginVertical: 28,
        marginHorizontal: 10,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 22,
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    statCardDark: {
        backgroundColor: '#111111',
    },
    statCardGradientWrap: {
        flex: 1,
        borderRadius: 22,
        padding: 3,
        overflow: 'hidden',
    },
    statCardTodayInner: {
        backgroundColor: '#111',
        borderRadius: 18,
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statValue: {
        fontSize: 10,
        color: '#111',
        letterSpacing: 1,
    },
    statLabel: {
        fontSize: 7,
        color: '#AAAAAA',
        letterSpacing: 2,
    },
    todayBanner: {
        marginTop: 20,
        backgroundColor: '#111',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    todayBannerText: {
        fontSize: 10,
        color: '#fff',
        letterSpacing: 1,
        lineHeight: 18,
    },

    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 16,
        marginBottom: 8,
    },
    actionButton: {
        width: 50, height: 50,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    whatsappButton: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    actionIcon: {
        width: 20, height: 18,
        resizeMode: 'contain',
    },
});