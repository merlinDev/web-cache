const fileReader = new FileReader();
const loader = new ZipLoader("test_file.zip");

loader.load().then(() => {
  const files = loader.files;
  console.log(loader);
});
