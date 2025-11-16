// Get current tab domain
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = new URL(tabs[0].url);
  const domain = url.hostname;

  const toggle = document.getElementById("toggle");

  // Load saved state
  chrome.storage.sync.get(["enabledSites"], (data) => {
    const enabledSites = data.enabledSites || {};
    toggle.checked = enabledSites[domain] === true;
  });

  // Save state when changed
  toggle.addEventListener("change", () => {
    chrome.storage.sync.get(["enabledSites"], (data) => {
      const enabledSites = data.enabledSites || {};

      if (toggle.checked) {
        enabledSites[domain] = true;
      } else {
        enabledSites[domain] = false;
      }

      chrome.storage.sync.set({ enabledSites });
    });
  });
});
