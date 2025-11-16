const siteList = document.getElementById("siteList");
const newDomainInput = document.getElementById("newDomain");
const addBtn = document.getElementById("addBtn");

// Load and render list
function refreshList() {
  chrome.storage.sync.get(["enabledSites"], (data) => {
    const sites = data.enabledSites || {};
    siteList.innerHTML = "";

    Object.keys(sites).forEach((domain) => {
      const row = document.createElement("div");
      row.className = "site-row";

      const label = document.createElement("span");
      label.textContent = domain;

      const actions = document.createElement("div");
      actions.className = "actions";

      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.checked = sites[domain] === true;

      toggle.addEventListener("change", () => {
        sites[domain] = toggle.checked;
        chrome.storage.sync.set({ enabledSites: sites });
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.onclick = () => {
        delete sites[domain];
        chrome.storage.sync.set({ enabledSites: sites }, refreshList);
      };

      actions.appendChild(toggle);
      actions.appendChild(removeBtn);

      row.appendChild(label);
      row.appendChild(actions);

      siteList.appendChild(row);
    });
  });
}

// Add new domain manually
addBtn.addEventListener("click", () => {
  const domain = newDomainInput.value.trim().toLowerCase();
  if (!domain) return;

  chrome.storage.sync.get(["enabledSites"], (data) => {
    const sites = data.enabledSites || {};
    sites[domain] = true;
    chrome.storage.sync.set({ enabledSites: sites }, () => {
      newDomainInput.value = "";
      refreshList();
    });
  });
});

// Initial render
refreshList();
