import * as Notifications from 'expo-notifications';
import { getAll } from './birthdays';
import { getSettings } from './settings';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import { Platform } from 'react-native';
import { t, Lang } from '@/i18n';
// read language from settings: hooks can't run outside components (background task, startup)
const getTr = () => t((getSettings().lang as Lang) ?? 'ro');

const TASK_NAME = 'reschedule-notifications';

TaskManager.defineTask(TASK_NAME, async () => {
    await scheduleAllNotifications();
    return BackgroundTask.BackgroundTaskResult.Success;
});

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerBackgroundTask() {
    try {
        await BackgroundTask.registerTaskAsync(TASK_NAME, {
            minimumInterval: 60 * 60 * 24,
        });
    } catch (e) {
        console.log('Background task not available:', e);
    }
}

export async function requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

// Android caps alarms per app (~500) and iOS keeps only 64, so schedule just the nearest ones;
// the list is rebuilt on app start, on every change and by the daily background task.
const MAX_SCHEDULED = 60;

export async function scheduleAllNotifications() {
    await cancelAllNotifications();

    const settings = getSettings();
    const tr = getTr();
    const today = new Date();
    const pending: { date: Date; title: string; body: string }[] = [];

    for (const birthday of getAll()) {
        const bday = new Date(birthday.birthdate);

        for (const yearsAhead of [0, 1]) {
            const day = new Date(
                today.getFullYear() + yearsAhead,
                bday.getMonth(),
                bday.getDate(),
                settings.reminderHour,
                settings.reminderMinutes,
                0
            );
            if (settings.reminderOnDay === 1) {
                pending.push({
                    date: day,
                    title: tr.notifications.laMultiAni,
                    body: `${tr.notifications.aziEZiua} ${birthday.name}!`,
                });
            }
            if (settings.reminderDaysBefore > 0) {
                const before = new Date(day);
                before.setDate(before.getDate() - settings.reminderDaysBefore);
                pending.push({
                    date: before,
                    title: tr.notifications.reminder,
                    body: `In ${settings.reminderDaysBefore} ${tr.notifications.inZile} ${birthday.name}!`,
                });
            }
        }
    }

    const upcoming = pending
        .filter(n => n.date > today)
        .sort((x, y) => x.date.getTime() - y.date.getTime())
        .slice(0, MAX_SCHEDULED);

    for (const n of upcoming) {
        await Notifications.scheduleNotificationAsync({
            content: { title: n.title, body: n.body, priority: 'max' },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: n.date,
                channelId: 'birthdays',
            },
        });
    }
}

export async function setupNotificationChannel() {
    const tr = getTr();
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('birthdays', {
            name: tr.notifications.zileNastere,
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });
    }
}