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
  Dimensions,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
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
import { useMemo } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const STAR_COLORS = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff"];

function useStars(count: number, areaWidth: number, areaHeight: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * areaWidth,
        y: Math.random() * areaHeight,
        size: Math.random() < 0.5 ? 3 : 5,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        opacity: 0.25 + Math.random() * 0.35,
      })),
    [count, areaWidth, areaHeight],
  );
}

function PixelStars({ areaHeight }: { areaHeight: number }) {
  const stars = useStars(25, SCREEN_WIDTH, areaHeight);
  return (
    <View style={[StyleSheet.absoluteFillObject, { pointerEvents: "none" }]}>
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

export default function SettingsScreen() {
  const [reminderOnDay, setReminderOnDay] = useState(1);
  const [reminderDaysBeforeEnable, setReminderDaysBeforeEnable] = useState(0);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(3);
  const [reminderHour, setReminderHour] = useState(9);
  const [reminderMinutes, setReminderMinutes] = useState(0);
  const [hourError, setHourError] = useState("");
  const [minutesError, setMinutesError] = useState("");

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
    }, []),
  );

  const saveSettings = () => {
    const hErr = validateHour(String(reminderHour));
    const mErr = validateMinutes(String(reminderMinutes));
    if (hErr || mErr) return;

    updateSettings({
      reminderOnDay,
      reminderDaysBefore:
        reminderDaysBeforeEnable === 1 ? reminderDaysBefore : 0,
      reminderHour,
      reminderMinutes,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F7F7F5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: "16%" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PixelStars areaHeight={250} />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.btnLeft}
            onPress={() => router.push("/")}
          >
            <IconSymbol size={16} name="chevron.left" color={"#fff"} />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={[styles.title, { fontFamily: PIXEL }]}>Setari</Text>
        </View>

        <View>
          <Text style={[styles.headerLabel, { fontFamily: PIXEL }]}>
            Notificari
          </Text>

          <View style={styles.formCard}>
            <View style={styles.settingRow}>
              <Text style={[styles.label, { fontFamily: PIXEL }]}>
                reminder azi
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
                cu cat timp inainte
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
                  numar zile
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
                ora reminder
              </Text>
              <View style={styles.timeGroup}>
                <TextInput
                  value={String(reminderHour)}
                  onChangeText={(v) => {
                    setReminderHour(Number(v));
                    setHourError(validateHour(v));
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
                    setMinutesError(validateMinutes(v));
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
            style={styles.saveButton}
            onPress={() => {
              saveSettings();
              scheduleAllNotifications();
            }}
          >
            <Text style={[styles.saveButtonText, { fontFamily: PIXEL }]}>
              salveaza
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
});