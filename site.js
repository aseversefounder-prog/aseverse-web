const form = document.querySelector("#publicWaitlistForm");
const status = document.querySelector("#formStatus");
const storageKey = "aseverse-public-waitlist";
const demoUrl = document.querySelector('meta[name="aseverse-demo-url"]')?.content;

if (demoUrl) {
  document.querySelectorAll("[data-demo-link]").forEach((link) => {
    const hash = link.getAttribute("href")?.split("#")[1];
    link.href = hash && !demoUrl.includes("#") ? `${demoUrl}#${hash}` : demoUrl;
  });
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.style.color = isError ? "#ffe7a0" : "rgba(255, 249, 239, 0.72)";
}

function storeLocally(entry) {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  saved.push({ ...entry, createdAt: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(saved));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  setStatus("Submitting your early access request...");

  try {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Waitlist API is not connected yet.");
    }

    form.reset();
    setStatus("You're on the list. Welcome to the AseVerse early circle.");
  } catch {
    storeLocally(data);
    form.reset();
    setStatus("Saved locally for this demo. Connect Formspree, Supabase, Firebase, Airtable, or Google Forms before launch.");
  }
});
