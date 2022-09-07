const canvas = document.querySelector("#drawing-canvas");
const context = canvas.getContext("2d");
const mouse = { x: 0, y: 0, down: false };

let cells = [];
let interval = null;
let scaleX = 0;
let scaleY = 0;
let currentColor = "#ffffff";
let overlay = null;

init(16);

// Get mouse state and coords
canvas.addEventListener("mousedown", (evt) =>
  evt.button == 0 ? (mouse.down = true) : (mouse.down = false)
);
canvas.addEventListener("mouseup", () => (mouse.down = false));
canvas.addEventListener("mousemove", (evt) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = Math.floor((evt.clientX - rect.left) / scaleX);
  mouse.y = Math.floor((evt.clientY - rect.top) / scaleY);
});

function init(size) {
  if (overlay) overlay.remove();

  // Remove prevoius interval and cells
  if (interval) {
    clearInterval(interval);
    cells = [];
  }

  // create cells
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cells.push({
        x: x,
        y: y,
        color: currentColor,
      });
    }
  }

  // Get relative size for each pixel
  scaleX = canvas.width / size;
  scaleY = canvas.height / size;

  // start update loop
  interval = setInterval(() => {
    // loop through and draw each cell
    for (let i in cells) {
      const c = cells[i];
      if (mouse.down && mouse.x == c.x && mouse.y == c.y)
        c.color = currentColor;
      context.fillStyle = c.color;
      context.fillRect(c.x * scaleX, c.y * scaleY, scaleX, scaleY);
    }
  }, 1000 / 60);
}

// Button and input functions

function setColor(color) {
  currentColor = color;
}

function createNewImageOverlay() {
  overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.innerHTML =
    "<div><h3>Select size</h3><div><button onclick='init(64)'>64x64</button><button onclick='init(32)'>32x32</button><button onclick='init(16)'>16x16</button><button onclick='init(8)'>8x8</button></div></div>";
  document.body.append(overlay);
}

function save() {
  localStorage.setItem("SavedImage", JSON.stringify(cells));
}

function load() {
  const saved = localStorage.getItem("SavedImage");
  if (!saved) return;
  cells = JSON.parse(saved);
}

function setBackground() {
  for (let i in cells) {
    const c = cells[i];
    c.color = currentColor;
    console.log(c.color);
  }
}
