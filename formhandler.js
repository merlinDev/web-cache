window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

window.onload = () => {
  checkFormDataPool();
};

if (!window.indexedDB) {
  console.log("this browser doesn't support IncecDB");
}

function checkFormDataPool() {
  console.log("checking for pending form requests...");
  const dbrequest = window.indexedDB.open("formRequests");
  dbrequest.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore("formData", {
      autoIncrement: true,
    });
  };

  dbrequest.onsuccess = (e) => {
    if (dbrequest.readyState == "done") {
      const db = e.target.result;
      const transaction = db.transaction(["formData"], "readwrite");
      const objectStore = transaction.objectStore("formData");

      //get
      const request = objectStore.getAll();
      request.onerror = (e) => {
        console.error("no such record");
      };

      request.onsuccess = (e) => {
        if (request.result) {
          const dataArray = request.result;
          console.log(`found ${dataArray.length} pending form requests...`);

          dataArray.forEach((formData) => {
            console.log("submitting form");
            submitForm(formData);
          });
          objectStore.clear();
        }
      };
    }
  };
}

// first attempt
// function processForm() {
//   const username = document.querySelector("#name").value;
//   const formData = {
//     username: username,
//     timestamp: new Date().getTime(),
//   };

//   const isOnline = window.navigator.onLine;
//   if (isOnline) {
//     // send the form data directly to the server
//     submitForm(formData);
//   } else {
//     // store form data in the IndexedDB and send them to the server,
//     // after connected to internet
//     const dbrequest = window.indexedDB.open("formRequests");
//     dbrequest.onupgradeneeded = (e) => {
//       const db = e.target.result;
//       db.createObjectStore("formData", {
//         autoIncrement: true,
//       });
//     };

//     dbrequest.onsuccess = (e) => {
//       console.log("success");
//       if (dbrequest.readyState == "done") {
//         const db = e.target.result;
//         const transaction = db.transaction("formData", "readwrite");
//         const store = transaction.objectStore("formData");
//         store.put(formData);
//         db.close();
//         awaitConnection();
//       }
//     };

//     dbrequest.onerror = (e) => {
//       console.error(`browser database error: ${e.target.errorCode}`);
//       console.log("this website need access to IndexedDB");
//     };
//   }
// }

function processForm(formID) {
  const form = document.getElementById(formID);
  const formDataObject = new FormData(form);
  const entries = Object.fromEntries(formDataObject.entries());

  const formData = {
    data: entries,
  };

  const isOnline = window.navigator.onLine;
  console.log("client is online: ", isOnline);
  if (isOnline) {
    // send the form data directly to the server
    submitForm(formData);
  } else {
    // store form data in the IndexedDB and send them to the server,
    // after connected to internet
    const dbrequest = window.indexedDB.open("formRequests");
    dbrequest.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore("formData", {
        autoIncrement: true,
      });
    };

    dbrequest.onsuccess = (e) => {
      console.log("success");
      if (dbrequest.readyState == "done") {
        const db = e.target.result;
        const transaction = db.transaction("formData", "readwrite");
        const store = transaction.objectStore("formData");
        store.put(formData);
        db.close();
        awaitConnection();
      }
    };

    dbrequest.onerror = (e) => {
      console.error(`browser database error: ${e.target.errorCode}`);
      console.log("this website need access to IndexedDB");
    };
  }
}

function submitForm(formData) {
  // submit the formdata
  const url = "https://60d347d2858b410017b2f60c.mockapi.io/users";
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
}

function awaitConnection() {
  const connectionListener = setInterval(() => {
    const isOnline = window.navigator.onLine;
    if (isOnline) {
      console.log("connected to internet...");
      // submit form data on IndexedDB
      checkFormDataPool();
      clearInterval(connectionListener);
    }
  }, 500);
}
