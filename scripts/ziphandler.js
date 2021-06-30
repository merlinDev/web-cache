const zipURL = `${_zipdir}data.zip`;

storeZip(zipURL);
readFile('data.css');

function storeZip(url) {
  caches.open("cache-files").then((cache) => {
    cache
      .add(url)
      .then(() => console.log("zip added to the cache"))
      .catch((error) => {
        console.log(error);
      });
  });
}

function readFile(filename) {
  console.log(`reading file ${filename}...`);
  
  const type = filename.split(".").pop();
  const loader = new ZipLoader(zipURL);
  loader.load().then(() => {
    const url = loader.extractAsBlobUrl(filename, mimeTypes[type]);
    loadFile(url, type);
  });
}

function loadFile(url, type) {
  console.log('reading file...');
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
        main.appendChild(html.body);
      });

    // for xmls
  } else if (fileTypes.xmls.includes(type)) {
    fetch(url)
      .then((response) => response.text())
      .then((raw) => {
        const xml = parser.parseFromString(raw, mimeTypes[type]);
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
  }
}
