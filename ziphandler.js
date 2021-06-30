const zip = new JSZip();
zip.file("test.txt", "test text file");

zip.generateAsync({ type: "blob" }).then((blob) => {
  const url = URL.createObjectURL(blob);
  console.log(url);
  getZip(url);
});

function getZip(url) {
  caches.open("cache-files").then((cache) => {
    console.log(cache);
    cache
      .add(url)
      .then(() => console.log("zip added to the cache"))
      .catch((error) => {
        console.log(error);
      });
  });
}

function readZip() {
  caches.match("/data.zip").then((result) => {
    if (result) {
      const zipURL = result.url;
      const loader = new ZipLoader(zipURL);
      loader.load().then(() => {
        console.log(loader.files["data/"]);
      });
    }
  });
}

function wrapper(file) {
  const type = file.split(".")[file.lastIndexOf(".")];
}
