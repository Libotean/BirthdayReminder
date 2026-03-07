import React, { use, useEffect, useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Birthday, getAll } from '@/database/birthdays';

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
      <Text style={styles.title}>Zile de nastere</Text>
      <FlatList
        renderItem = {({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, }}>
            {item.photo ? <Image source={{ uri: item.photo }} style={styles.avatar} /> : null}
            <Text style={styles.item}>{item.name}</Text>
          </View>
        )}
        data={birthdays}
      />
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/add_birthday')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#ffff'},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000'},
  item: { fontSize: 18, paddingVertical: 5, marginLeft: 15 },
  button: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 30 },
  avatar: {borderRadius: 50, width: 50, height: 50,},

});