/* eslint-disable no-restricted-globals */

// function openPushNotification(event) {
//   event.notification.close();
//   event.waitUntil(clients.openWindow(event.notification.data));
// }

function sendRequests() {
  console.log("Retrieving data");
  const request = indexedDB.open("identifi-web-db", 1);
  let requestData = null;

  request.onsuccess = function (event) {
    const db = event.target.result;
    db
      .transaction("checkins")
      .objectStore("checkins")
      .getAll().onsuccess = function (event) {
      console.log("Requests", event.target.result);
      requestData = event.target.result[0];
    };
  };

  const { operationName, query, variables, token } = requestData;
  fetch("https://api.identifi.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ operationName, query, variables }),
  })
    .then((res) => res.json())
    .then((res) => console.log("response", res));
}

function handleSync(event) {
  // console.log('[Service Worker] Sync Received.', event);
  // const URL = "https://programming-quotes-api.herokuapp.com/quotes/random";
  // const options = {
  //   requireInteraction: true,
  //   data: "https://pwa-client.netlify.app",
  //   icon: "https://via.placeholder.com/128/ff0000",
  //   badge: "https://via.placeholder.com/128/ff0000",
  //   body: "Click to view the quote",
  //   actions: [
  //     {
  //       action: "Detail",
  //       title: "View",
  //     },
  //   ],
  // };

  if (event.tag === "update-checkin-sync") {
    // fetch(URL).then((response) => {
    //   caches.open("v1").then((cache) => {
    //     cache.put(URL, response.clone());
    //   });
    // });
    // event.waitUntil(
    //   self.registration.showNotification("Quote is now available!", options)
    // );
    event.waitUntil(sendRequests());
  }
}

function createDB() {
  console.log("creating indexed db");
  const request = indexedDB.open("identifi-web-db", 1);
  const data = [];

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
self.addEventListener("sync", handleSync);
self.addEventListener("fetch", handleFetch);
self.addEventListener("activate", handleActivate);
