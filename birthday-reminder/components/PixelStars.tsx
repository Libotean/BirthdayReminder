import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

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

export default function PixelStars({ count, areaHeight }: { count: number, areaHeight: number }) {
    const stars = useStars(count, SCREEN_WIDTH, areaHeight);
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