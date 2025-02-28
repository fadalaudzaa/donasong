const notificationSound = new Audio('/notification.wav');

export const playPriorityNotification = () => {
  notificationSound.currentTime = 0; 
  notificationSound.play().catch(error => {
    console.error('Failed to play notification sound:', error);
  });
}; 