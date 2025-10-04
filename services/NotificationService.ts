import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { FoodItem } from '../providers/FoodProvider';
import { daysUntil } from '../utils/date';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  async scheduleExpiryNotifications(items: FoodItem[]): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    for (const item of items) {
      const days = daysUntil(item.expiryISO);
      
      if (days === 1) {
        await this.scheduleNotification(
          `${item.name} expires tomorrow!`,
          `Don't forget to use your ${item.name} before it expires.`,
          1
        );
      } else if (days === 3) {
        await this.scheduleNotification(
          `${item.name} expires in 3 days`,
          `Plan to use your ${item.name} soon.`,
          1
        );
      } else if (days === 0) {
        await this.scheduleNotification(
          `${item.name} expires today!`,
          `Use your ${item.name} today to avoid waste.`,
          1
        );
      }
    }
  }

  async scheduleNotification(
    title: string,
    body: string,
    delaySeconds: number
  ): Promise<string | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null,
      });
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export const notificationService = new NotificationService();
