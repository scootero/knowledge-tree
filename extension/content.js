/* content.js */
const menuButton = document.createElement("button");
menuButton.id = "overlay-menu-button";
menuButton.innerHTML = "<div class='bar'></div><div class='bar'></div><div class='bar'></div>";
document.body.appendChild(menuButton);

// Create plus button
const saveButton = document.createElement("button");
saveButton.id = "overlay-save-button";
saveButton.innerText = "+";
document.body.appendChild(saveButton);

// Create side panel
const sidePanel = document.createElement("div");
sidePanel.id = "side-panel";
document.body.appendChild(sidePanel);

// Create list container
const urlList = document.createElement("ol");
urlList.id = "url-list";
sidePanel.appendChild(urlList);

let panelVisible = false;

/* Load panel state */
chrome.storage.local.get("panelState", (data) => {
  panelVisible = data.panelState ?? false;
  if (panelVisible) {
    sidePanel.style.right = "0px";
  }
});

/* Add event listener to toggle side panel */
menuButton.addEventListener("click", () => {
  panelVisible = !panelVisible;
  chrome.storage.local.set({ panelState: panelVisible });
  if (panelVisible) {
    sidePanel.style.right = "0px";
    updateUrlList(); // Ensure the list is updated when panel opens
  } else {
    sidePanel.style.right = "-200px";
  }
});

// Function to save URL and metadata
saveButton.addEventListener("click", () => {
  const url = window.location.href;
  const title = document.title;
  chrome.storage.local.get("savedUrls", (data) => {
    let storedData = data.savedUrls || [];
    const newItem = {
      id: storedData.length + 1,
      url: url,
      title: title,
    };
    storedData.push(newItem);
    chrome.storage.local.set({ savedUrls: storedData }, () => {
      updateUrlList();
    });
  });
});

// Function to update list display
function updateUrlList() {
  chrome.storage.local.get("savedUrls", (data) => {
    let storedData = data.savedUrls || [];
    urlList.innerHTML = "";
    storedData.forEach(item => {
      const listItem = document.createElement("li");
      listItem.innerText = `${item.id}. ${item.title}`;
      urlList.appendChild(listItem);
    });
  });
}

// Ensure data and panel state persist across tabs and page loads
window.addEventListener("load", () => {
  chrome.storage.local.get("panelState", (data) => {
    panelVisible = data.panelState ?? false;
    if (panelVisible) {
      sidePanel.style.right = "0px";
    }
  });
  updateUrlList();
});
