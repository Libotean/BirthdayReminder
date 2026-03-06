import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function TabOneScreen() {
  const [birthdays, setBirthdays] = useState<string[]>([]);
  const router = useRouter();
  const { name, poza } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zile de nastere</Text>
      <FlatList
        data={birthdays}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}  
      />
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/add_birthday')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.item}>{name}</Text>
      {poza ? <Image source={{ uri: poza as string}} style={styles.avatar} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#fff'},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  item: { fontSize: 18, paddingVertical: 5 },
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