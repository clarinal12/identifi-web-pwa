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
  console.log("creating indexed db");
  const request = indexedDB.open("identifi-web-db", 1);
  const data = [
    { id: "checkin-1", question: "Who are you?", answer: "I am who I am" },
    { id: "checkin-2", name: "Where are you?", answer: "I am everywhere" },
  ];

  request.onupgradeneeded = function (event) {
    // Do something with request.result!
    const db = event.target.result;
    var objectStore = db.createObjectStore("checkins", { keyPath: "id" });

    objectStore.transaction.oncomplete = function (event) {
      // Store values in the newly created objectStore.
      const checkinObjectStore = db
        .transaction("checkins", "readwrite")
        .objectStore("checkins");
      data.forEach(function (checkin) {
        checkinObjectStore.add(checkin);
      });
    };
  };
}

function handleActivate(event) {
  console.log("activating");
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
