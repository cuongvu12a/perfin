importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

self.addEventListener('notificationclick', function(event) {
  let url = self.location.origin;
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
      clients.matchAll({includeUncontrolled: true, type: 'window'}).then( windowClients => {
          if (windowClients.length > 0 ) {
            var client = windowClients[0]
            if ('focus' in client) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
              return clients.openWindow(url);
          }
      })
  );  
});


const firebaseConfig = {
  apiKey: "AIzaSyAws5hRDvI8TsPpbGJri8k32mYZFmnZv5M",
  authDomain: "drcloud-1ee63.firebaseapp.com",
  projectId: "drcloud-1ee63",
  storageBucket: "drcloud-1ee63.appspot.com",
  messagingSenderId: "739934592992",
  appId: "1:739934592992:web:9c93fbd752974546391585"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload)=> {
  console.log('Received background message ', payload);
});
