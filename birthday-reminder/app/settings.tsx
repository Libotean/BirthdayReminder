import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { getSettings, updateSettings } from '@/database/settings';
import { Switch } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMemo } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STAR_COLORS = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];
const NAME_REGEX = /^[a-zA-ZăâîșțĂÂÎȘȚ\s\-]+$/;
const PHONE_REGEX = /^07\d{2}\s?\d{3}\s?\d{3}$/;

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
    const stars = useStars(25, SCREEN_WIDTH, areaHeight);
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

export default function SettingsScreen() {
    const router = useRouter();
    const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
    if (!fontsLoaded) return null;
    const PIXEL = 'PressStart2P_400Regular';

    return (
        <View style={styles.container}>
            <PixelStars areaHeight={250} />
            
            <TouchableOpacity style={styles.btnLeft} onPress={() => router.push('/')}>
                <IconSymbol size={16} name="chevron.left" color={'#fff'} />
            </TouchableOpacity>
            
            <View style={styles.header}>
                <Text style={[styles.title, { fontFamily: PIXEL }]}>Setari</Text>
            </View>
            {/* card cu setarile */}
            <View style={styles.formCard}>
                
                <View style={styles.settingRow}>
                    <Text style={[styles.label, { fontFamily: PIXEL }]}>reminder azi</Text>
                    <Switch
                        value={false}
                        onValueChange={() => {}}
                        trackColor={{ false: '#E5E5E5', true: '#111' }}
                        thumbColor={'#fff'}
                    />
                </View>

            </View>
            {/* buton salveaza */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F5',
        paddingHorizontal: 20,
        paddingTop: '28%',
    },

    // ── Nav ──
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

    // ── Header ──
    header: {
        marginBottom: 22,
        marginTop: 10,
    },
    title: {
        fontSize: 22,
        color: '#111111',
        letterSpacing: 1,
        lineHeight: 28,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 10,
    },
    label: {
        fontSize: 7,
        color: '#AAAAAA',
        letterSpacing: 2,
        marginBottom: 8,
        marginTop: 9,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
});