import * as Notifications from 'expo-notifications';
import { getAll } from './birthdays';
import { getSettings } from './settings';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleAllNotifications() {
    await cancelAllNotifications();

    const settings = getSettings();
    const birthdays = getAll();

    for (const birthday of birthdays) {
        const bday = new Date(birthday.birthdate);
        const today = new Date();

        for (const yearsAhead of [0, 1]) {

            if (settings.reminderOnDay === 1) {
                const trigger = new Date(
                    today.getFullYear() + yearsAhead,
                    bday.getMonth(),
                    bday.getDate(),
                    settings.reminderHour,
                    settings.reminderMinutes,
                    0
                );
                if (trigger > today) {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: '🎂 La multi ani!',
                            body: `Azi e ziua lui ${birthday.name}!`,
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.DATE,
                            date: trigger,
                        },
                    });
                }
            }

            if (settings.reminderDaysBefore > 0) {
                const trigger = new Date(
                    today.getFullYear() + yearsAhead,
                    bday.getMonth(),
                    bday.getDate(),
                    settings.reminderHour,
                    settings.reminderMinutes,
                    0
                );
                trigger.setDate(trigger.getDate() - settings.reminderDaysBefore);
                if (trigger > today) {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: '🎂 Reminder!',
                            body: `In ${settings.reminderDaysBefore} zile e ziua lui ${birthday.name}!`,
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.DATE,
                            date: trigger,
                        },
                    });
                }
            }
        }
    }
}