/* eslint-disable no-restricted-globals */

// function openPushNotification(event) {
//   event.notification.close();
//   event.waitUntil(clients.openWindow(event.notification.data));
// }

// function handleSync(event) {
//   // console.log('[Service Worker] Sync Received.', event);
//   const URL = "https://programming-quotes-api.herokuapp.com/quotes/random";
//   const options = {
//     requireInteraction: true,
//     data: "https://pwa-client.netlify.app",
//     icon: "https://via.placeholder.com/128/ff0000",
//     badge: "https://via.placeholder.com/128/ff0000",
//     body: "Click to view the quote",
//     actions: [
//       {
//         action: "Detail",
//         title: "View",
//       },
//     ],
//   };

//   if (event.tag === "quote-sync") {
//     fetch(URL).then((response) => {
//       caches.open("v1").then((cache) => {
//         cache.put(URL, response.clone());
//       });
//     });

//     event.waitUntil(
//       self.registration.showNotification("Quote is now available!", options)
//     );
//   }
// }

function createDB() {
  idb.open("products", 1, function (upgradeDB) {
    var store = upgradeDB.createObjectStore("beverages", {
      keyPath: "id",
    });
    store.put({ id: 123, name: "coke", price: 10.99, quantity: 200 });
    store.put({ id: 321, name: "pepsi", price: 8.99, quantity: 100 });
    store.put({ id: 222, name: "water", price: 11.99, quantity: 300 });
  });
}

function handleActivate() {
  event.waitUntil(createDB());
}

function handleFetch(event) {
  console.log(event);
  // console.log('[Service Worker] Fetch Received.', event);
  // const requestUrl = event.request.url;
  // const requestHeader = event.request.headers;
  // const requestBody = event.request.body;
  // event.request.json().then((result) => {
  //   console.log(result);
  // });
  // if (requestUrl.hostname === 'programming-quotes-api.herokuapp.com') {
  //   event.respondWith(
  //     caches.match(event.request).then((response) => {
  //       if (response) {
  //         console.log('Return response from cache');
  //         return response;
  //       }
  //       console.log('Return response from network');
  //       return fetch(event.request);
  //     })
  //   );
  // }
}

// self.addEventListener('notificationclick', openPushNotification);
// self.addEventListener('sync', handleSync);
self.addEventListener("fetch", handleFetch);
self.addEventListener("activate", handleActivate);
