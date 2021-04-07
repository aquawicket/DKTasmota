"use strict";
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API

function DKNotifiations_NotifyMe() {
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function DKNotifiations_NotifyMeCallback(reg) {
            reg.showNotification('Hello world!');
        });
    }
}
