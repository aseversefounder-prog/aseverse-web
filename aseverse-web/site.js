const googleWaitlistUrl = "https://docs.google.com/forms/d/172WeHy_DbYiCX9bZmbY7edn6MZ6c-Yw5JpYYcpvZVoI/edit?pli=1";
const form = document.querySelector("#publicWaitlistForm");
const status = document.querySelector("#formStatus");
const demoUrl = document.querySelector('meta[name="aseverse-demo-url"]')?.content;

if (demoUrl) {
  document.querySelectorAll("[data-demo-link]").forEach((link) => {
    const hash = link.getAttribute("href")?.split("#")[1];
    link.href = hash && !demoUrl.includes("#") ? `${demoUrl}#${hash}` : demoUrl;
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent = "Opening the official AseVerse Google Form...";
  window.open(googleWaitlistUrl, "_blank", "noopener,noreferrer");
});
