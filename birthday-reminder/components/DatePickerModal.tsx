import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
    value: Date;
    onChange: (date: Date) => void;
    onClose: () => void;
};

export default function DatePickerModal({ value, onChange, onClose }: Props) {
    const [tempDate, setTempDate] = useState(value);

    if (Platform.OS === 'android') {
        return (
            <DateTimePicker
                value={value}
                mode="date"
                maximumDate={new Date()}
                onChange={(_, selected) => {
                    onClose();
                    if (selected) onChange(selected);
                }}
            />
        );
    }

    // iOS — modal cu confirmare
    return (
        <Modal transparent animationType="slide" visible>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.sheetHeader}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancel}>Anuleaza</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { onChange(tempDate); onClose(); }}>
                            <Text style={styles.confirm}>Confirma</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.pickerContainer}>
                        <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display="spinner"
                            maximumDate={new Date()}
                            onChange={(_, selected) => { if (selected) setTempDate(selected); }}
                            style={styles.picker}
                            locale="ro-RO"
                            textColor="#000000"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    sheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 34,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    cancel: { fontSize: 18, color: '#999' },
    confirm: { fontSize: 18, color: '#2196F3', fontWeight: '600' },
    pickerContainer: {
        backgroundColor: '#ffffff',
        width: '100%',
    },
    picker: {
        height: 200,
        width: '100%',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignSelf: 'center',
    },
});