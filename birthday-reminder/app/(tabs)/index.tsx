import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet, Image, SectionList, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { Birthday, getAll, remove, getInitials, getDaysUntilNextBirthday, groupByMonth } from '@/database/birthdays';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const stars = useStars(55, SCREEN_WIDTH, areaHeight);

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
  
  
  const frames = [
      require('@/assets/cat/F0.png'),
      require('@/assets/cat/F1.png'),
      require('@/assets/cat/F2.png'),
      require('@/assets/cat/F3.png'),
      require('@/assets/cat/F4.png'),
      require('@/assets/cat/F5.png'),
      require('@/assets/cat/F6.png'),
      require('@/assets/cat/F7.png'),
  ];

  const [currentFrame, setCurrentFrame] = useState(0);
  const [catX, setCatX] = useState(0);
  const [facingLeft, setFacingLeft] = useState(false);
  const catXRef = useRef(0);
  const facingLeftRef = useRef(false);
  const CAT_WIDTH = 72;
  const CAT_HEIGHT = 58;
  const LEFT_OFFSET = 5
  // const SPEED = SCREEN_WIDTH / 800;
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
      
      const frameInterval = setInterval(() => {
          setCurrentFrame(f => (f + 1) % frames.length);
      }, 100);

      // miscare
      const moveInterval = setInterval(() => {
          const now = Date.now();
          const delta = now - lastTimeRef.current;
          lastTimeRef.current = now;

          const maxX = SCREEN_WIDTH - CAT_WIDTH - 30;
          const pixelsPerMs = SCREEN_WIDTH / 9000; 
          let newX = catXRef.current + (facingLeftRef.current ? -1 : 1) * pixelsPerMs * delta;

          if (newX >= maxX) {
              newX = maxX;
              facingLeftRef.current = true;
              setFacingLeft(true);
          } else if (newX <= -LEFT_OFFSET) {
              newX = -LEFT_OFFSET;
              facingLeftRef.current = false;
              setFacingLeft(false);
          }

          catXRef.current = newX;
          setCatX(newX);
      }, 16);

      return () => {
          clearInterval(frameInterval);
          clearInterval(moveInterval);
      };
  }, []);

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
  <SafeAreaView style={styles.container}>
      <PixelStars areaHeight={250} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btnLeft} onPress={() => router.push('/settings')}>
          <IconSymbol size={20} name="gear" color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnRight} onPress={() => router.push('/add_birthday')}>
          <Text style={[styles.addButtonText, { fontFamily: PIXEL }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerLabel, { fontFamily: PIXEL }]}>zile de</Text>
          <Text style={[styles.title, { fontFamily: PIXEL }]}>nastere</Text>
        </View>
      </View>
      
      {/* Count pill */}
      {birthdays.length > 0 && (
        <View style={styles.countPill}>
          <Text style={[styles.countText, { fontFamily: PIXEL }]}>
            {birthdays.length} persoane
          </Text>
        </View>
      )}

      <View style={{ height: CAT_HEIGHT, marginBottom: 5}}>
          <Image
              source={frames[currentFrame]}
              style={{
                  position: 'absolute',
                  left: catX,
                  width: CAT_WIDTH,
                  height: CAT_HEIGHT,
                  transform: [{ scaleX: facingLeft ? -1 : 1 }],
              }}
          />
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F5',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
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
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  btnLeft: {
    top: '7%',
    width: 45,
    height: 45,
    borderRadius: 15,
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
    right: 0,
    top: '7%',
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 22,
    alignSelf: 'center',
  },

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

  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    borderRadius: 18,
    marginBottom: 8,
    marginLeft: 8,
  },

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