import React, { use, useEffect, useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Birthday, getAll, remove, getInitials } from '@/database/birthdays';
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
      <Text style={styles.title}>Zile de nastere</Text>
      <FlatList
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, }}>
              {item.photo ? <Image source={{ uri: item.photo }} style={styles.avatar} /> : 
                <View style={styles.avatarPlaceHolder}>
                  <Text style={styles.initials}>{getInitials(item.name)}</Text>
                </View>}
              <Text style={styles.item}>{item.name}</Text>
            </View>
          </ReanimatedSwipeable>
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
  deleteButton: {backgroundColor: 'red', justifyContent: 'flex-end', width: 100, height: 30, alignItems: 'center', alignSelf: 'center'},
  avatar: {borderRadius: 50, width: 50, height: 50,},
  avatarPlaceHolder: {borderRadius: 50, width: 50, height: 50, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'},
  initials: {color: '#555', fontSize: 20, fontWeight: 'bold'}

});