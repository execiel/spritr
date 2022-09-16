//////////////////////////////////
//  Handles saving and loading  //
//////////////////////////////////

// TODO: add proper loading and saving of the name

function createSaveOverlay() {
  const html =
    "<div><h3>Choose a name for your artwork!</h3><input type='text' id='save-in' placeholder='1st Masterpiece'></input><button onclick='save()'>Save!</button></div>";
  createOverlay(html);
}

// Save to local storage
function save() {
  // Remove the save overlay
  const prevSaves = localStorage.getItem("Saves");

  // Grab the name if given, else name it unnamed
  let name = document.getElementById("save-in").value;
  if (name == "") name = "unnamed";

  // The object to add to the save array
  const currentSave = { name: name, id: image_id, scale: scale, cells: cells };

  // Remove overlay
  if (overlay) overlay.remove();

  if (prevSaves) {
    const saves = JSON.parse(prevSaves);

    // See if save of current image already exists
    for (let i in saves) {
      s = saves[i];

      // If it exists change it
      if (s.id == image_id) {
        saves[i] = currentSave;
        localStorage.setItem("Saves", JSON.stringify(saves));
        return;
      }
    }

    // If it doesn't exist
    saves.push(currentSave);
    localStorage.setItem("Saves", JSON.stringify(saves));
  } else {
    // Create new save array if none exists
    const saves = [];
    saves.push(currentSave);
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
      s = saves[i];
      html += `<button onclick="loadImage(${i})">${s.name}</button>`;
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
