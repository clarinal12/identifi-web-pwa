/* eslint-disable no-restricted-globals */

function openPushNotification(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

function sendRequests() {
  const dbRequest = indexedDB.open("identifi-web-db", 1);
  const URL =
    "https://identifi-web-pwa.vercel.app/checkins/d3385b0f-2aa8-4e7e-8b7f-0ee5be0523c7?memberId=a004d644-13fc-4842-96c6-11766df7bec0&responseId=2bd683e0-811c-4d76-86cc-927528c91587";
  const options = {
    requireInteraction: true,
    data: URL,
    icon: "https://identifi-web-pwa.vercel.app/favicon.ico",
    badge: "https://identifi-web-pwa.vercel.app/favicon.ico",
    body: "Click to view your check-in",
    actions: [
      {
        action: "Detail",
        title: "View",
      },
    ],
  };

  dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;

    const transaction = db.transaction(["checkins"], "readwrite");
    const objectStore = transaction.objectStore("checkins");
    const getRequest = objectStore.getAll();

    getRequest.onerror = (event) => {
      console.log("Error retrieving db records", { event });
    };

    getRequest.onsuccess = (event) => {
      const checkinData = event.target.result[0];
      const { id, operationName, query, variables, token } = checkinData;
      fetch("https://api.identifi.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operationName, query, variables }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("update success", { res });
          self.registration.showNotification(
            "Your check-in has been updated",
            options
          );

          const deleteRequest = objectStore.delete(id);

          deleteRequest.onsuccess = (event) => {
            console.log("Delete db record success", { event });
          };
        });
    };

    // db.transaction("checkins").objectStore("checkins").getAll().onsuccess = (
    //   event
    // ) => {
    //   const requestData = event.target.result[0];
    //   const { operationName, query, variables, token } = requestData;
    //   fetch("https://api.identifi.com/graphql", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({ operationName, query, variables }),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       console.log("update success", { res });
    //       self.registration.showNotification(
    //         "Your check-in has been updated",
    //         options
    //       );
    //     });
    // };
  };
}

function handleSync(event) {
  if (event.tag === "update-checkin-sync") {
    event.waitUntil(sendRequests());
  }
}

function createDB() {
  const request = indexedDB.open("identifi-web-db", 1);
  const data = [];

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    var objectStore = db.createObjectStore("checkins", { keyPath: "id" });

    objectStore.transaction.oncomplete = function (event) {
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
  event.waitUntil(createDB());
}

// function handleFetch(event) {
//   console.log('[Service Worker] Fetch Received.', event);
//   const requestUrl = event.request.url;
//   const requestHeader = event.request.headers;
//   const requestBody = event.request.body;
//   event.request.json().then((result) => {
//     console.log(result);
//   });
//   if (requestUrl.hostname === 'programming-quotes-api.herokuapp.com') {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         if (response) {
//           console.log('Return response from cache');
//           return response;
//         }
//         console.log('Return response from network');
//         return fetch(event.request);
//       })
//     );
//   }
// }

self.addEventListener("notificationclick", openPushNotification);
self.addEventListener("sync", handleSync);
// self.addEventListener("fetch", handleFetch);
self.addEventListener("activate", handleActivate);
