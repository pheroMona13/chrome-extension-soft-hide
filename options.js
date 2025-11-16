const siteList = document.getElementById("siteList");
const newDomainInput = document.getElementById("newDomain");
const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");

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

  chrome.storage.sync.get(["generalSettings"], (data) => {
    const generalSettings = data.generalSettings || {
      blurLabel: "Window not focused",
      blurAmount: 10,
    };

    document.getElementsByName("global-blur-label")[0].value =
      generalSettings.blurLabel;
    document.getElementsByName("global-blur-amount")[0].value = parseInt(
      generalSettings.blurAmount
    );
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
saveBtn.addEventListener("click", () => {
  const generalSettings = {
    blurLabel: document.getElementsByName("global-blur-label")[0].value,
    blurAmount: parseInt(
      document.getElementsByName("global-blur-amount")[0].value
    ),
  };
  chrome.storage.sync.set({ generalSettings });
});

let SELECTED_TAB = 1;

function handleTabClick(event) {
  document.querySelector(".tab.active").classList.remove("active");
  document.querySelector(".tab-content.visible").classList.remove("visible");

  event.target.classList.add("active");
  document
    .querySelector(`.tab-content[aria-label="${event.target.ariaLabel}"]`)
    .classList.add("visible");

  SELECTED_TAB = event.target.ariaLabel;
}

document
  .querySelectorAll(".tab")
  .forEach((t) => t.addEventListener("click", handleTabClick));

// Initial render
refreshList();
