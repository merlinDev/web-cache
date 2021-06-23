// const loader = new ZipLoader("test_file.zip");

caches.match("/test_file.zip").then((response) => {
  console.log("looging for the file...");
  if (response) {
    console.log('response: ', response);
    const zipURL = response.url;
    console.log("url: ", zipURL);
    const loader = new ZipLoader(zipURL);
    loader.load().then(() => {
      const files = loader.files;
      console.log("files: ", files);
      console.log("file: ", files["test_file.txt"]);
    });
  }
});
