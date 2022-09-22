///////////////////
//  Main script  //
///////////////////

const canvas = document.querySelector("#drawing-canvas");
const context = canvas.getContext("2d");
const mouse = { x: 0, y: 0, down: false };

// Image properties
let image_id = null;
let cells = [];
let scale = 0;
let currentColor = "#ffffff";

// Loop and overlay objects
let overlay = null;
let interval = null;

// Keeps track of strokes for undo
let strokes = [];
let currentStroke = 0;

init(16);

// Get mouse state and coords
canvas.addEventListener("mousedown", (evt) => {
  if (evt.button == 0) {
    mouse.down = true;
    currentStroke++;
    strokes[currentStroke] = [];
  }
});
canvas.addEventListener("mouseup", () => (mouse.down = false));
canvas.addEventListener("mousemove", (evt) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = Math.floor((evt.clientX - rect.left) / scale);
  mouse.y = Math.floor((evt.clientY - rect.top) / scale);
});

document.addEventListener("keydown", (evt) => {
  // Ctrl + Z or Shift + Z for undo
  if (
    (evt.keyCode == 90 && evt.ctrlKey) ||
    (evt.keyCode == 90 && evt.shiftKey)
  ) {
    undo();
  }

  // Shift + O for saving
  if (evt.keyCode == 79 && evt.shiftKey) {
    load();
  }

  // Shift + S for saving
  if (evt.keyCode == 83 && evt.shiftKey) {
    createSaveOverlay();
  }

  // Shift + N for new image
  if (evt.keyCode == 78 && evt.shiftKey) {
    createNewImageOverlay();
  }
});

// Init function gets called every time new image is created
function init(size) {
  // Remove overlay
  if (overlay) overlay.remove();

  // Remove prevoius interval and cells
  if (interval) {
    clearInterval(interval);
    cells = [];
  }

  // Set new id
  image_id = Math.random();

  // create the cells
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cells.push({
        x: x,
        y: y,
        color: currentColor,
      });
    }
  }

  // Get the scale
  scale = canvas.width / size;

  // start update loop
  interval = setInterval(() => {
    // loop through and draw each cell
    for (let i in cells) {
      const c = cells[i];
      if (mouse.down && mouse.x == c.x && mouse.y == c.y) {
        // Store prevoius color of the pixel, for undo function
        if (c.color != currentColor)
          strokes[currentStroke].push({ index: i, color: c.color });

        c.color = currentColor;
      }
      context.fillStyle = c.color;
      context.fillRect(c.x * scale, c.y * scale, scale, scale);
    }
  }, 1000 / 60);
}

function undo() {
  // Grab current strokes affected cells and change them to their last color
  for (let i in strokes[currentStroke]) {
    const cell = strokes[currentStroke][i];
    cells[cell.index].color = cell.color;
  }
  currentStroke--;
}

// Button and input functions
function setColor(color) {
  currentColor = color;
}

function createOverlay(html) {
  overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.innerHTML = html;
  document.body.append(overlay);
}

function createNewImageOverlay() {
  createOverlay(
    "<div><h3>Select size</h3><div><button onclick='init(64)'>64x64</button><button onclick='init(32)'>32x32</button><button onclick='init(16)'>16x16</button><button onclick='init(8)'>8x8</button></div></div>"
  );
}

function setBackground() {
  for (let i in cells) {
    const c = cells[i];
    c.color = currentColor;
  }
}
