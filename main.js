///////////////////
//  Main script  //
///////////////////


const canvas = document.querySelector("#drawing-canvas");
const context = canvas.getContext("2d");
const mouse = { x: 0, y: 0, down: false };

let image_id = null;
let cells = [];
let interval = null;
let scale = 0;
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
  mouse.x = Math.floor((evt.clientX - rect.left) / scale);
  mouse.y = Math.floor((evt.clientY - rect.top) / scale);
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
      if (mouse.down && mouse.x == c.x && mouse.y == c.y)
        c.color = currentColor;
      context.fillStyle = c.color;
      context.fillRect(c.x * scale, c.y * scale, scale, scale);
    }
  }, 1000 / 60);
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
