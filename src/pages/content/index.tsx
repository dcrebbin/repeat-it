async function init() {
  console.log("init");
}

const video = document.querySelector("video");
video?.addEventListener("loadeddata", () => {
  console.log("video loaded");
  init();
});

init();

try {
  console.log("content script loaded");
} catch (e) {
  console.error(e);
}
