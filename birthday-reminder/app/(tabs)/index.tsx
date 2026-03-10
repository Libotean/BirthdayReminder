import React, { useState, useCallback, useMemo } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet, Image, SectionList, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { Birthday, getAll, remove, getInitials, getDaysUntilNextBirthday, groupByMonth } from '@/database/birthdays';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Star = { x: number; y: number; size: number; color: string; opacity: number };

const STAR_COLORS = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

function useStars(count: number, areaWidth: number, areaHeight: number): Star[] {
  return useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * areaWidth,
      y: Math.random() * areaHeight,
      size: Math.random() < 0.5 ? 3 : 5,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, [count, areaWidth, areaHeight]);
}

function PixelStars({ areaHeight }: { areaHeight: number }) {
  const stars = useStars(35, SCREEN_WIDTH, areaHeight);

  return (
    <View style={[StyleSheet.absoluteFillObject, { pointerEvents: 'none' }]}>
      <Svg width={SCREEN_WIDTH} height={areaHeight}>
        {stars.map((s, i) => (
          <Rect
            key={i}
            x={s.x}
            y={s.y}
            width={s.size}
            height={s.size}
            fill={s.color}
            opacity={s.opacity}
          />
        ))}
      </Svg>
    </View>
  );
}

export default function TabOneScreen() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const router = useRouter();

  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  useFocusEffect(
    useCallback(() => {
      setBirthdays(getAll());
    }, [])
  );

  if (!fontsLoaded) return null;

  const sections = groupByMonth(birthdays);
  const PIXEL = 'PressStart2P_400Regular';

  return (
    <View style={styles.container}>
      <PixelStars areaHeight={200} />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerLabel, { fontFamily: PIXEL }]}>zile de</Text>
          <Text style={[styles.title, { fontFamily: PIXEL }]}>nastere</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add_birthday')}>
          <Text style={[styles.addButtonText, { fontFamily: PIXEL }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Count pill */}
      {birthdays.length > 0 && (
        <View style={styles.countPill}>
          <Text style={[styles.countText, { fontFamily: PIXEL }]}>
            {birthdays.length} persoane
          </Text>
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🎂</Text>
              <Text style={[styles.emptyTitle, { fontFamily: PIXEL }]}>gol aici</Text>
              <Text style={[styles.emptySubtitle, { fontFamily: PIXEL }]}>
                apasa + pentru a{'\n'}adauga prima zi
              </Text>
            </View>
          </View>
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeader, { fontFamily: PIXEL }]}>
              {title.toLowerCase()}
            </Text>
            <View style={styles.sectionLine} />
          </View>
        )}
        renderItem={({ item }) => {
          const isToday = getDaysUntilNextBirthday(item.birthdate) === 'Azi!';

          const cardInner = (
            <TouchableOpacity
              onPress={() => router.push(`/info?id=${item.id}`)}
              activeOpacity={0.8}
            >
              <View style={[styles.card, isToday && styles.cardToday]}>
                {item.photo ? (
                  <Image source={{ uri: item.photo }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatarPlaceholder, isToday && styles.avatarToday]}>
                    <Text style={[styles.initials, { fontFamily: PIXEL }, isToday && styles.initialsToday]}>
                      {getInitials(item.name)}
                    </Text>
                  </View>
                )}
                <View style={styles.cardContent}>
                  <Text
                    style={[styles.itemName, { fontFamily: PIXEL }, isToday && styles.itemNameToday]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                  {isToday && (
                    <Text style={[styles.todayLabel, { fontFamily: PIXEL }]}>La multi ani!</Text>
                  )}
                </View>
                <View style={[styles.daysBadge, isToday && styles.daysBadgeToday]}>
                  <Text style={[styles.daysText, { fontFamily: PIXEL }, isToday && styles.daysTextToday]}>
                    {getDaysUntilNextBirthday(item.birthdate)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );

          return (
            <ReanimatedSwipeable
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    remove(item.id!);
                    setBirthdays(getAll());
                  }}
                >
                  <IconSymbol size={18} name="trash" color={'#fff'} />
                </TouchableOpacity>
              )}
            >
              {isToday ? (
                <LinearGradient
                  colors={['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBorder}
                >
                  {cardInner}
                </LinearGradient>
              ) : cardInner}
            </ReanimatedSwipeable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '14%',
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F5',
  },

  // ── Header ──────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#111',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 22,
    alignSelf: 'center',
  },

  // ── Count pill ──────────────────────────
  countPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBEBEB',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 20,
  },
  countText: {
    fontSize: 7,
    color: '#888',
    letterSpacing: 1,
  },

  // ── Section Header ──────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
    gap: 10,
  },
  sectionHeader: {
    fontSize: 8,
    color: '#AAAAAA',
    letterSpacing: 2,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },

  // ── Card ────────────────────────────────
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardToday: {
    backgroundColor: '#111111',
    marginBottom: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 3,
    marginBottom: 8,
  },

  // ── Avatar ──────────────────────────────
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarToday: {
    backgroundColor: '#2A2A2A',
  },
  initials: {
    fontSize: 10,
    color: '#555555',
  },
  initialsToday: {
    color: '#FFFFFF',
  },

  // ── Card content ────────────────────────
  cardContent: {
    flex: 1,
    marginLeft: 14,
    gap: 4,
  },
  itemName: {
    fontSize: 9,
    color: '#111111',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  itemNameToday: {
    color: '#FFFFFF',
  },
  todayLabel: {
    fontSize: 6.5,
    color: '#AAAAAA',
    letterSpacing: 1,
  },

  // ── Days Badge ──────────────────────────
  daysBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  daysBadgeToday: {
    backgroundColor: '#2A2A2A',
  },
  daysText: {
    fontSize: 6.5,
    color: '#555555',
    letterSpacing: 0.5,
  },
  daysTextToday: {
    color: '#FFFFFF',
  },

  // ── Delete ──────────────────────────────
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    borderRadius: 18,
    marginBottom: 8,
    marginLeft: 8,
  },

  // ── Empty State ─────────────────────────
  emptyContainer: {
    alignItems: 'center',
    marginTop: '35%',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    width: '85%',
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 14,
    color: '#111111',
    letterSpacing: 1,
    marginBottom: 14,
  },
  emptySubtitle: {
    fontSize: 7,
    color: '#AAAAAA',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 18,
  },
});