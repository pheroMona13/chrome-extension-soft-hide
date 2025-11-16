// Create overlay element
const overlay = document.createElement("div");
overlay.id = "focus-overlay";
overlay.style.display = "none";
overlay.textContent = "Window not focused";
document.body.appendChild(overlay);

// Save original title
let originalTitle = document.title;
let unfocusedTitle = "🔒 [SoftHided]";

function applyGeneralSettings() {
  chrome.storage.sync.get(["generalSettings"], (data) => {
    const generalSettings = data.generalSettings || {
      blurLabel: "Window not focused",
      blurAmount: 10,
    };

    overlay.textContent = generalSettings.blurLabel;
    overlay.style.backdropFilter = `blur(${generalSettings.blurAmount}px)`;
  });
}
function checkEnabledAndBind() {
  const domain = location.hostname;

  chrome.storage.sync.get(["enabledSites"], (data) => {
    const enabledSites = data.enabledSites || {};
    const enabled = enabledSites[domain] === true; // default

    if (enabled) {
      window.addEventListener("blur", showOverlay);
      window.addEventListener("focus", hideOverlay);
    } else {
      window.removeEventListener("blur", showOverlay);
      window.removeEventListener("focus", hideOverlay);
      hideOverlay();
    }
  });
}

function showOverlay() {
  overlay.style.display = "flex";

  // Change tab title
  originalTitle = document.title;
  document.title = unfocusedTitle;
}

function hideOverlay() {
  overlay.style.display = "none";

  // Restore original title
  if (originalTitle) {
    document.title = originalTitle;
  }
}

// Listen to changes from popup
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabledSites) checkEnabledAndBind();
  if (changes.generalSettings) applyGeneralSettings();
});

// Initial check
checkEnabledAndBind();
applyGeneralSettings();
