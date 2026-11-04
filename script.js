// Рендер ссылок, почт и фраз из data.js.
const linksList = document.getElementById("links-list");
const emailsList = document.getElementById("emails-list");
const phrasesList = document.getElementById("phrases-list");
const toast = document.getElementById("toast");

function showToast(message = "Copied to clipboard") {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast("Copied: " + value);
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    showToast(ok ? "Copied to clipboard" : "Copy failed");
  }
}

SITE_DATA.links.forEach(item => {
  const a = document.createElement("a");
  a.className = "link-card";
  a.href = item.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.innerHTML = `
    <span class="card-main">
      <span class="card-icon">${item.icon || "↗"}</span>
      <span class="card-title"></span>
    </span>
    <span class="card-arrow">↗</span>`;
  a.querySelector(".card-title").textContent = item.title;
  linksList.appendChild(a);
});

SITE_DATA.emails.forEach(email => {
  const button = document.createElement("button");
  button.className = "copy-card";
  button.type = "button";
  button.innerHTML = `
    <span class="card-main">
      <span class="card-icon">@</span>
      <span class="card-title"></span>
    </span>
    <span class="copy-icon">▢</span>`;
  button.querySelector(".card-title").textContent = email;
  button.addEventListener("click", () => copyText(email));
  emailsList.appendChild(button);
});

SITE_DATA.phrases.forEach(phrase => {
  const button = document.createElement("button");
  button.className = "phrase-card";
  button.type = "button";
  const text = document.createElement("span");
  text.textContent = phrase;
  button.appendChild(text);
  button.addEventListener("click", () => copyText(phrase));
  phrasesList.appendChild(button);
});

// Если поменяешь адрес сайта в data.js, ссылка внизу обновится автоматически.
const websiteLink = document.querySelector(".website-link");
if (SITE_DATA.website) {
  websiteLink.href = SITE_DATA.website.url;
  websiteLink.querySelector("span:nth-child(2)").textContent = SITE_DATA.website.title;
}
