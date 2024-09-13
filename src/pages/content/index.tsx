async function init() {
  console.log("init");
  if(document.getElementById("repeat-container")) return;
  //wait until ytd-player is loaded
  while(!document.getElementById("ytd-player")){
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log("waiting for ytd-player");
  }
  const ytdPlayer = document.getElementById("ytd-player");

  console.log("ytd-player loaded", ytdPlayer);
  const repeatContainer = createRepeatContainer();
  const leftRepeatButton = createRepeatButton(true);
  const rightRepeatButton = createRepeatButton(false);
  repeatContainer.appendChild(leftRepeatButton);
  repeatContainer.appendChild(rightRepeatButton);
  ytdPlayer?.appendChild(repeatContainer);
  console.log("repeatContainer appended");
  setupDraggableButtons(leftRepeatButton, rightRepeatButton);
}

function createRepeatButton(isLeft: boolean) {
  const repeatButton = document.createElement("button");
  repeatButton.id = `repeat-button-${isLeft ? "left" : "right"}`;
  repeatButton.style.backgroundColor = "black";
  repeatButton.style.padding = "10px";
  repeatButton.style.borderRadius = "5px";
  repeatButton.style.boxShadow = "0 0 10px 0 rgba(0, 0, 0, 0.1)";
  repeatButton.style.position = "absolute";
  repeatButton.style.top = "50%";
  repeatButton.style.transform = `translateX(${isLeft ? "-100%" : "100%"})`;
  repeatButton.style.cursor = "move";

  return repeatButton;
}

function createRepeatContainer() {
  const repeatContainer = document.createElement("div");
  repeatContainer.id = "repeat-container";
  repeatContainer.style.position = "relative";
  repeatContainer.style.bottom = "0";
  repeatContainer.style.width = "100%";
  repeatContainer.style.display = "flex";
  repeatContainer.style.backgroundColor = "white";
  repeatContainer.style.padding = "10px";
  repeatContainer.style.boxShadow = "0 0 10px 0 rgba(0, 0, 0, 0.1)";
  return repeatContainer;
}

function setupDraggableButtons(leftButton: HTMLButtonElement, rightButton: HTMLButtonElement) {
  let isDragging = false;
  let currentButton: HTMLButtonElement | null = null;

  function onMouseDown(e: MouseEvent) {
    isDragging = true;
    currentButton = e.target as HTMLButtonElement;
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging || !currentButton) return;

    const containerRect = currentButton.parentElement?.getBoundingClientRect();
    const leftLimit = 0;
    const rightLimit = containerRect?.width || 0;

    let newX = e.clientX - (containerRect?.left || 0);
    newX = Math.max(leftLimit, Math.min(newX, rightLimit));

    if (currentButton === leftButton) {
      const rightButtonX = parseInt(rightButton.style.left || "0");
      newX = Math.min(newX, rightButtonX - 20); 
      const leftButtonX = parseInt(leftButton.style.left || "0");
      newX = Math.max(newX, leftButtonX + 20);
    }

    currentButton.style.left = `${newX}px`;
  }

  function onMouseUp() {
    isDragging = false;
    currentButton = null;
  }

  leftButton.addEventListener("mousedown", onMouseDown);
  rightButton.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

init();

const video = document.querySelector("video");

video?.addEventListener("loadeddata", () => {
  console.log("video loaded");
  init();
});

try {
  console.log("content script loaded");
} catch (e) {
  console.error(e);
}
