import React, { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useFonts } from "expo-font";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import {
  getSettings,
  updateSettings,
  validateHour,
  validateMinutes,
} from "@/database/settings";
import { scheduleAllNotifications } from "@/database/notifications"
import { Switch } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import PixelStars from '@/components/PixelStars';
import { exportData, importData } from '@/database/backup';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { useLang } from '@/i18n/LangContext';

export default function SettingsScreen() {
  const [reminderOnDay, setReminderOnDay] = useState(1);
  const [reminderDaysBeforeEnable, setReminderDaysBeforeEnable] = useState(0);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(3);
  const [reminderHour, setReminderHour] = useState(9);
  const [reminderMinutes, setReminderMinutes] = useState(0);
  const [hourError, setHourError] = useState("");
  const [minutesError, setMinutesError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { tr, setLang } = useLang();
  const [langValue, setLangValue] = useState<'ro' | 'en'>(
      () => (getSettings()?.lang as 'ro' | 'en') ?? 'ro'
  );
  const langItems = [
      {label: tr.settings.romana, value: 'ro' as 'ro' | 'en'},
      {label: tr.settings.engleza, value: 'en' as 'ro' | 'en'},
  ];
  const router = useRouter();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  if (!fontsLoaded) return null;
  const PIXEL = "PressStart2P_400Regular";

  useFocusEffect(
    useCallback(() => {
      const settings = getSettings();
      setReminderOnDay(settings.reminderOnDay);
      setReminderDaysBeforeEnable(settings.reminderDaysBefore > 0 ? 1 : 0);
      setReminderDaysBefore(settings.reminderDaysBefore || 3);
      setReminderHour(settings.reminderHour || 9);
      setReminderMinutes(settings.reminderMinutes);
      setLangValue((settings.lang as 'ro' | 'en') ?? 'ro');
    }, []),
  );

  const saveSettings = () => {
    const hErr = validateHour(String(reminderHour), tr.settings.doarNumere, tr.settings.oraInvalida);
    const mErr = validateMinutes(String(reminderMinutes), tr.settings.doarNumere, tr.settings.minuteInvalide);
    if (hErr || mErr) return;

    updateSettings({
      reminderOnDay,
      reminderDaysBefore:
        reminderDaysBeforeEnable === 1 ? reminderDaysBefore : 0,
      reminderHour,
      reminderMinutes,
      lang: getSettings().lang
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F5' }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#F7F7F5" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <PixelStars count={30} areaHeight={180} />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.btnLeft}
              onPress={() => router.push("/")}
            >
              <IconSymbol size={16} name="chevron.left" color={"#fff"} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: PIXEL }]}>{tr.settings.title}</Text>
          </View>

          <View>
            <Text style={[styles.headerLabel, { fontFamily: PIXEL }]}>
              {tr.settings.notificari}
            </Text>

            <View style={styles.formCard}>
              <View style={styles.settingRow}>
                <Text style={[styles.label, { fontFamily: PIXEL, fontSize: 6 }]}>
                  {tr.settings.reminderZiua}
                </Text>
                <Switch
                  value={reminderOnDay === 1}
                  onValueChange={(v) => {
                    setReminderOnDay(v ? 1 : 0);
                  }}
                  trackColor={{ false: "#E5E5E5", true: "#111" }}
                  thumbColor={"#fff"}
                />
              </View>
            </View>

            <View style={styles.formCard}>
              <View style={styles.settingRow}>
                <Text style={[styles.label, { fontFamily: PIXEL }]}>
                  {tr.settings.reminderAnticipat}
                </Text>
                <Switch
                  value={reminderDaysBeforeEnable === 1}
                  onValueChange={(v) => {
                    setReminderDaysBeforeEnable(v ? 1 : 0);
                  }}
                  trackColor={{ false: "#E5E5E5", true: "#111" }}
                  thumbColor={"#fff"}
                />
              </View>
              {reminderDaysBeforeEnable === 1 && (
                <View style={styles.inputRow}>
                  <Text style={[styles.label, { fontFamily: PIXEL }]}>
                    {tr.settings.cuCateZile}
                  </Text>
                  <TextInput
                    value={String(reminderDaysBefore)}
                    onChangeText={(v) => setReminderDaysBefore(Number(v))}
                    keyboardType="numeric"
                    style={[styles.settingInput, { fontFamily: PIXEL, fontSize: 10 }]}
                  />
                </View>
              )}
            </View>

            <View style={styles.formCard}>
              <View style={styles.settingRow}>
                <Text style={[styles.label, { fontFamily: PIXEL }]}>
                  {tr.settings.laOra}
                </Text>
                <View style={styles.timeGroup}>
                  <TextInput
                    value={String(reminderHour)}
                    onChangeText={(v) => {
                      setReminderHour(Number(v));
                      setHourError(validateHour(v, tr.settings.doarNumere, tr.settings.oraInvalida));
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                    style={[styles.settingInput, { fontFamily: PIXEL, fontSize: 10 }]}
                  />
                  <Text style={[styles.timeSeparator, { fontFamily: PIXEL }]}>
                    :
                  </Text>
                  <TextInput
                    value={String(reminderMinutes)}
                    onChangeText={(v) => {
                      setReminderMinutes(Number(v));
                      setMinutesError(validateMinutes(v, tr.settings.doarNumere, tr.settings.minuteInvalide));
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                    style={[styles.settingInput, { fontFamily: PIXEL, fontSize: 10 }]}
                  />
                </View>
              </View>
              {hourError ? (
                <Text style={[styles.errorText, { fontFamily: PIXEL }]}>
                  {hourError}
                </Text>
              ) : null}
              {minutesError ? (
                <Text style={[styles.errorText, { fontFamily: PIXEL }]}>
                  {minutesError}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
                style={[styles.saveButton, loading && { opacity: 0.6 }]}
                onPress={async () => {
                    if (loading) return;
                    saveSettings();
                    setLoading(true);
                    await scheduleAllNotifications();
                    setLoading(false);
                    router.back();
                }}
            >
                <Text style={[styles.saveButtonText, { fontFamily: PIXEL }]}>
                    {loading ? tr.settings.seSalveaza : tr.settings.salveaza}
                </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 35}}>
            <Text style={[styles.headerLabel, { fontFamily: PIXEL }]}>
              {tr.settings.importExport}
            </Text>
            <View style={styles.formCard}>
              <TouchableOpacity style={styles.settingRow} onPress={exportData}>
                  <Text style={[styles.label, { fontFamily: PIXEL }]}>{tr.settings.exporta}</Text>
                  <IconSymbol size={16} name="square.and.arrow.up" color={'#111'} />
              </TouchableOpacity>
            </View>
            <View style={styles.formCard}>
              <TouchableOpacity style={styles.settingRow} onPress={async () => {
                  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
                  if (!result.canceled) {
                      const { importate, sarite, eroare } = await importData(result.assets[0].uri);
                      if (eroare) {
                          Alert.alert(tr.settings.eroare, eroare);
                      } else {
                          Alert.alert(tr.settings.importComplet, `${importate} ${tr.settings.importate}, ${sarite} ${tr.settings.sarite}`);
                      }
                  }
                  router.back();
              }}>
                  <Text style={[styles.label, { fontFamily: PIXEL }]}>{tr.settings.importa}</Text>
                  <IconSymbol size={16} name="square.and.arrow.down" color={'#111'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginTop: 35}}>
            <Text style={[styles.headerLabel, { fontFamily: PIXEL }]}>
              {tr.settings.limba}
            </Text>
            <View style={[styles.formCard, { zIndex: 1000 }]}>
                <DropDownPicker
                    open={open}
                    value={langValue}
                    items={langItems}
                    setOpen={setOpen}
                    setValue={(callback) => {
                        const newLang = (typeof callback === 'function' 
                            ? callback(langValue) 
                            : callback) as 'ro' | 'en';
                        console.log('newLang:', newLang);
                        setLangValue(newLang);
                        setLang(newLang);
                        updateSettings({
                            ...getSettings(),
                            lang: newLang,
                        });
                    }}
                    placeholder={tr.settings.selecteazaLimba}
                    listMode="SCROLLVIEW"
                    style={styles.dropDown}
                    textStyle={{ fontFamily: PIXEL, fontSize: 10 }}
                />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F5",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  btnLeft: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    marginBottom: 22,
    marginTop: 10,
  },
  headerLabel: {
    fontSize: 9,
    color: "#AAAAAA",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    color: "#111111",
    letterSpacing: 1,
    lineHeight: 28,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  label: {
    fontSize: 7,
    color: "#AAAAAA",
    marginBottom: 8,
    marginTop: 9,
  },
  input: {
    backgroundColor: "#F7F7F5",
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    color: "#111",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  settingInput: {
    backgroundColor: "#F7F7F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12,
    color: "#111",
    width: 60,
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  timeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeSeparator: {
    fontSize: 10,
    color: "#111",
    marginBottom: 2,
  },
  saveButton: {
    backgroundColor: "#111111",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#111",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    letterSpacing: 2,
  },
  errorText: {
    fontSize: 6,
    color: "#FF3B30",
    marginTop: 4,
    marginBottom: 6,
    paddingHorizontal: 10,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 10,
  },
  dropDown: {
    borderColor: '#fff',
  }
});