import React, { use, useEffect, useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Image, SectionList } from 'react-native';
import { Birthday, getAll, remove, getInitials, getDaysUntilNextBirthday, groupByMonth } from '@/database/birthdays';
import  ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function TabOneScreen() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setBirthdays(getAll());
    }, [])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/add_birthday')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Zile de nastere</Text>
      <SectionList
        sections = {groupByMonth(birthdays)}
        keyExtractor={(item, index) => index.toString()}
        renderItem = {({ item }) => (
          <ReanimatedSwipeable
            renderRightActions={() => (
              <TouchableOpacity style={styles.deleteButton} onPress={() => {
                remove(item.id!);
                setBirthdays(getAll());
              }}>
                <Text style={{color:'white'}}>Sterge</Text>
              </TouchableOpacity>
            )}
          >
            <TouchableOpacity onPress={() => router.push(`/info?id=${item.id}`)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, minWidth: 70 }}>
                {item.photo ? <Image source={{ uri: item.photo }} style={styles.avatar} /> : 
                  <View style={styles.avatarPlaceHolder}>
                    <Text style={styles.initials}>{getInitials(item.name)}</Text>
                  </View>}
                <Text style={[styles.item, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <View>
                  <Text style={styles.daysUntil}>{getDaysUntilNextBirthday(item.birthdate)}</Text>
                </View>
              </View>
            </TouchableOpacity>
            
          </ReanimatedSwipeable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: '16%', paddingHorizontal: 20, backgroundColor: '#ffff', },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#000', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 10 },
  item: { fontSize: 18, paddingVertical: 5, marginLeft: 15 },
  button: {
    position: 'relative', right: 0,
    alignSelf: 'flex-end',
    backgroundColor: '#1A1A1A',
    width: 30, height: 30, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  buttonText: { color: '#FFF', fontSize: 20, fontWeight: '300', lineHeight: 15 },
  deleteButton: {backgroundColor: 'red', justifyContent: 'flex-end', width: 100, height: 30, alignItems: 'center', alignSelf: 'center'},
  avatar: {borderRadius: 50, width: 50, height: 50,},
  avatarPlaceHolder: {borderRadius: 50, width: 50, height: 50, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'},
  initials: {color: '#555', fontSize: 20, fontWeight: 'bold'},
  daysUntil: {color: '#555', fontSize: 14, paddingHorizontal: 10,},
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#999', paddingVertical: 8},

});