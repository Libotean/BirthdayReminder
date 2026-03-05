import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function TabOneScreen() {
  const [birthdays, setBirthdays] = useState<string[]>([]);

  const addBirthday = () => {
    setBirthdays([...birthdays, `Nume #${birthdays.length + 1}`]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Birthday Reminder</Text>
      <FlatList
        data={birthdays}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}  
      />
      <TouchableOpacity style={styles.button} onPress={addBirthday}>
        <Text style={styles.buttonText} >+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#fff'},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  item: { fontSize: 18, paddingVertical: 5 },
  button: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 30 },
});