"use strict";
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API

function NotifyMe() {
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function NotifyMeCallback(reg) {
            reg.showNotification('Hello world!');
        });
    }
}
