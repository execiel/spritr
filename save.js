//////////////////////////////////
//  Handles saving and loading  //
//////////////////////////////////

// Save to local storage
function save() {
  const prevSaves = localStorage.getItem("Saves");

  if (prevSaves) {
    const saves = JSON.parse(prevSaves);

    // See if save of current image already exists
    for (let i in saves) {
      s = saves[i];

      // If it exists change it
      if (s.id == image_id) {
        saves[i] = { id: image_id, scale: scale, cells: cells };
        localStorage.setItem("Saves", JSON.stringify(saves));
        return;
      }
    }

    console.log("This shouldnt get called");
    saves.push({ id: image_id, scale: scale, cells: cells });
    localStorage.setItem("Saves", JSON.stringify(saves));
  } else {
    const saves = [];
    saves.push({ scale: scale, cells: cells });
    localStorage.setItem("Saves", JSON.stringify(saves));
  }
}

// Load from local storage and create overlay
function load() {
  const prevSaves = localStorage.getItem("Saves");

  // Create overlay for saves
  if (prevSaves) {
    let html = "<div><h3>Select previous save</h3><div>";
    const saves = JSON.parse(prevSaves);
    for (let i in saves) {
      html += `<button onclick="loadImage(${i})">Save ${i}</button>`;
    }
    html += "</div></div>";
    createOverlay(html);
  } else {
    alert("No saves found!");
  }
}

// Load the image to the canvas
function loadImage(index) {
  const save = JSON.parse(localStorage.getItem("Saves"));
  if (overlay) overlay.remove();
  scale = save[index].scale;
  cells = save[index].cells;
  image_id = save[index].id;
}
