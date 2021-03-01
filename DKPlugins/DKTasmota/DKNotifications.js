"use strict";
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API

function notifyMe() {
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
            reg.showNotification('Hello world!');
        });
    }
}
