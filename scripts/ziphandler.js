// const zipURL = `${_zipdir}data.zip`;
const dataURL = "../data/";

// old code
// storeZip(zipURL);
// readFile("data.css");

// function readFile(filename) {
//   console.log(`reading file ${filename}...`);

//   const type = filename.split(".").pop();
//   const loader = new ZipLoader(zipURL);
//   loader
//     .load()
//     .then(() => {
//       const url = loader.extractAsBlobUrl(filename, mimeTypes[type]);
//       loadFile(url, type);
//     })
//     .catch((error) => {
//       alert("requested file is not in the file or this file does not support!");
//       console.log("error: ", error);
//     });
// }

function loadFile(url, type) {
  console.log("reading file...");
  const parser = new DOMParser();
  const main = document.querySelector("#playground");

  // for images
  if (fileTypes.images.includes(type)) {
    const img = document.createElement("img");
    img.src = url;
    main.appendChild(img);

    // for htmls
  } else if (fileTypes.htmls.includes(type)) {
    fetch(url)
      .then((response) => response.text())
      .then((raw) => {
        const html = parser.parseFromString(raw, mimeTypes[type]);
        const textArea = document.createElement("textarea");
        textArea.innerHTML = html.body.innerHTML;
        main.appendChild(textArea);
        main.appendChild(html.body);
      });

    // for xmls
  } else if (fileTypes.xmls.includes(type)) {
    fetch(url)
      .then((response) => response.text())
      .then((raw) => {
        const xml = parser.parseFromString(raw, mimeTypes[type]);
        const textArea = document.createElement("textarea");
        textArea.innerHTML = xml.getElementsByTagName("catalog")[0].innerHTML;
        main.appendChild(textArea);
      });

    // for audios
  } else if (fileTypes.audios.includes(type)) {
    const audio = document.createElement("audio");
    audio.src = url;
    audio.type = mimeTypes[type];
    audio.autoplay = true;
    // audio.controls = true;
    main.appendChild(audio);

    // for videos
  } else if (fileTypes.videos.includes(type)) {
    const video = document.createElement("video");
    video.src = url;
    video.type = mimeTypes[type];
    // video.controls = true;
    video.autoplay = true;
    main.appendChild(video);

    // for styles
  } else if (fileTypes.styles.includes(type)) {
    const head = document.getElementsByTagName("head")[0];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    head.appendChild(link);

    // for json
  } else if (fileTypes.jsons.includes(type)) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const textArea = document.createElement("textArea");
        textArea.innerHTML = JSON.stringify(data);
        main.appendChild(textArea);
        console.log(data);
      });

    // for js
  } else if (fileTypes.js.includes(type)) {
    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
  } else {
    return false;
  }
}

// jszip part
createZip();
// readFile('data.css');
async function createZip() {
  const fileLinks = [
    "new.css",
    "data.css",
    "data.html",
    "data.mp3",
    "data.mp4",
    "data.png",
    "data.svg",
    "data.xml",
    "data.json",
    "data.js",
  ];

  const zip = new JSZip();
  let filesAdded = false;
  fileLinks.forEach((filename, index) => {
    const link = dataURL + filename;
    fetch(link)
      .then((response) => response.blob())
      .then((file) => {
        zip.file(filename, file);
        if (index === fileLinks.length - 1) {
          filesAdded = true;
        }
      });
  });

  const awaitFiles = setInterval(() => {
    if (filesAdded) {
      zip
        .generateAsync({ type: "base64" })
        .then((data) => {
          const url = generateURL("zip", data);
          storeZip(url);
        })
        .catch((err) => {
          console.log(err);
        });
      clearInterval(awaitFiles);
    }
  }, 300);
}

function storeZip(url) {
  if (typeof Storage !== "undefined") {
    if (!localStorage.getItem("data")) {
      console.log("storing zip file...");
      localStorage.setItem("data", url);
    }

    readFile("data.css");
  }

  // old code
  // caches.open("cache-files").then((cache) => {
  //   cache
  //     .add(url)
  //     .then(() => console.log("zip added to the cache"))
  //     .catch((error) => {
  //       console.log("error: ", error);
  //     });
  // });
}

function readFile(filename) {
  const type = filename.split(".").pop();
  const zipURL = localStorage.getItem("data");
  fetch(zipURL)
    .then((response) => response.blob())
    .then((blob) => {
      JSZip.loadAsync(blob).then((zip) => {
        zip
          .file(filename)
          .async("base64")
          .then((data) => {
            const url = generateURL(type, data);
            loadFile(url, type);
          });
      });
    });
}

function generateURL(type, base64) {
  const mime = mimeTypes[type];
  return `data:${mime};base64,${base64}`;
}
