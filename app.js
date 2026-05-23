const seedStories = [
  {
    id: "solar-veil",
    title: "Solar Veil",
    type: "Science Fantasy",
    genre: "Science",
    author: "Elias Osei",
    narrator: "Elias Osei",
    length: "9h 12m",
    durationSeconds: 605,
    progress: 64,
    cover: "mockup-assets/image-005-1024x1536.jpg",
    monetization: "Premium",
    tags: ["Dual narration", "Science", "Mythic archive"],
    description:
      "A luminous science-fantasy journey where a student astronomer discovers a hidden history inside the sun's oldest flare.",
    chapterTitle: "Chapter 4: The Archive of Light",
    chapterLines: [
      "The flare arrived without thunder, a gold line opening across the observatory dome.",
      "Nia pressed one palm to the glass and watched the light translate itself into symbols her grandmother once stitched into quilts.",
      "In the headphones, Elias lowered his voice until the archive felt close enough to breathe against the page.",
      "A second narration entered beneath the first, softer and older, carrying the remembered names of towns the maps had refused to keep.",
      "By the time the sun quieted, every reader in the chapter room had highlighted the same sentence."
    ],
    comments: [
      ["MinaReads", "The way the narrator drops into the grandmother's voice gave this chapter a pulse.", "128 likes"],
      ["OrbitClub", "Our book club is pausing on paragraph four. The science note makes the fantasy hit harder.", "42 replies"],
      ["JaeAudio", "The ambient layer is soft enough to read with, but still cinematic. This is the feature.", "89 likes"]
    ]
  },
  {
    id: "velvet-chains",
    title: "Velvet Chains",
    type: "Romance",
    genre: "Romance",
    author: "Sierra Monet",
    narrator: "Mara Voss",
    length: "7h 48m",
    durationSeconds: 468,
    progress: 41,
    cover: "mockup-assets/image-004-1024x1536.jpg",
    monetization: "Coin unlock",
    tags: ["Human voice", "Romance", "Premium"],
    description:
      "A guarded designer and a jazz pianist rebuild trust one late-night recording session at a time.",
    chapterTitle: "Chapter 8: Blue Note Apartment",
    chapterLines: [
      "The piano was out of tune, but Amara still knew the song by the shape of his hands.",
      "Julian did not apologize first. He poured tea, set the recorder down, and let silence make room for honesty.",
      "When Mara's narration softened, every pause sounded like a door unlocking.",
      "The city outside kept rushing, but inside the chapter there was only velvet, rain, and the choice to stay.",
      "Amara highlighted the sentence even before she knew she had forgiven him."
    ],
    comments: [
      ["TaliaTurns", "The chemistry reads beautifully, then the human narration makes it dangerous.", "304 likes"],
      ["BookRoom 9", "We all highlighted the same line. That never happens.", "61 replies"],
      ["MaraFan", "Narrator tag is perfect. Her pacing sells the tension.", "117 likes"]
    ]
  },
  {
    id: "archive-river",
    title: "Archive River",
    type: "History / Education",
    genre: "Science",
    author: "Nadine Donovan",
    narrator: "Imani Clarke",
    length: "5h 06m",
    durationSeconds: 306,
    progress: 22,
    cover: "mockup-assets/image-025-1024x1536.jpg",
    monetization: "Free",
    tags: ["Educational", "Book club", "Classroom"],
    description:
      "A narrative history series following river communities, oral memory, and the science of flood maps.",
    chapterTitle: "Chapter 2: Waterlines",
    chapterLines: [
      "The first map called the settlement empty because the surveyor arrived after Sunday dinner.",
      "By dusk, the river had already carried three names downstream and left the county record looking clean.",
      "Imani's narration marked each primary source with care, making the classroom feel less like a lecture and more like a witness stand.",
      "The floodplain did not forget. It kept the shape of every road that officials stopped printing.",
      "Students in the chapter thread began adding family maps of their own."
    ],
    comments: [
      ["ProfLane", "Assigned this to my seminar. The audio notes made the primary sources more accessible.", "76 likes"],
      ["RiverStudy", "The chapter threads are clean enough for class discussion.", "23 replies"],
      ["AriLearns", "I came for a story and accidentally learned how maps can erase people.", "98 likes"]
    ]
  }
];

const seedUser = {
  name: "Christina",
  email: "",
  role: "Reader",
  coins: 1420,
  libraryCount: 32,
  tbr: [],
  bookmarks: [],
  uploads: [],
  progress: {
    "solar-veil": 64,
    "velvet-chains": 41,
    "archive-river": 22
  }
};

const storageKey = "aseverse-mvp-state";
const waitlistUrl = "https://docs.google.com/forms/d/172WeHy_DbYiCX9bZmbY7edn6MZ6c-Yw5JpYYcpvZVoI/edit?pli=1";
let state = loadState();
let selectedStory = state.stories[0];
let activeLine = 0;
let playing = false;
let timer = null;
let elapsedSeconds = 202;

const storyGrid = document.querySelector("#storyGrid");
const commentGrid = document.querySelector("#commentGrid");
const chapterText = document.querySelector("#chapterText");
const progressFill = document.querySelector("#progressFill");
const playToggle = document.querySelector("#playToggle");
const modeLabel = document.querySelector("#modeLabel");
const playerNarrator = document.querySelector("#playerNarrator");
const published = document.querySelector("#published");
const readerPanel = document.querySelector(".reader-panel");

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return {
      session: null,
      user: structuredClone(seedUser),
      stories: structuredClone(seedStories),
      createdStories: [],
      waitlist: []
    };
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      session: parsed.session || null,
      user: { ...structuredClone(seedUser), ...(parsed.user || {}) },
      stories: parsed.stories?.length ? parsed.stories : structuredClone(seedStories),
      createdStories: parsed.createdStories || [],
      waitlist: parsed.waitlist || []
    };
  } catch {
    return {
      session: null,
      user: structuredClone(seedUser),
      stories: structuredClone(seedStories),
      createdStories: [],
      waitlist: []
    };
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTime(seconds) {
  const minutes = Math.floor(Math.max(seconds, 0) / 60);
  const remainder = Math.max(seconds, 0) % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function getVisibleStories() {
  const query = document.querySelector("#storySearch")?.value.trim().toLowerCase() || "";
  const genre = document.querySelector("#genreFilter")?.value || "all";
  const format = document.querySelector("#formatFilter")?.value || "all";

  return state.stories.filter((story) => {
    const searchable = [story.title, story.author, story.narrator, story.description, story.type, ...story.tags]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesGenre = genre === "all" || story.genre.includes(genre) || story.type.includes(genre);
    const matchesFormat = format === "all" || story.tags.join(" ").includes(format) || story.type.includes(format);
    return matchesQuery && matchesGenre && matchesFormat;
  });
}

function renderStories() {
  const visibleStories = getVisibleStories();
  storyGrid.innerHTML = visibleStories.length
    ? visibleStories
        .map(
          (story) => `
            <article class="story-card">
              <img src="${story.cover}" alt="${escapeHtml(story.title)} cover">
              <div class="story-card-content">
                <p class="eyebrow">${escapeHtml(story.type)}</p>
                <h3>${escapeHtml(story.title)}</h3>
                <p>${escapeHtml(story.description)}</p>
                <div class="card-meta">
                  <span>${escapeHtml(story.narrator)}</span>
                  <span>${escapeHtml(story.length)}</span>
                  <span>${state.user.progress[story.id] ?? story.progress}%</span>
                </div>
                <button class="secondary-button" data-story="${story.id}">Open Story</button>
              </div>
            </article>
          `
        )
        .join("")
    : `<p class="mini-list-empty">No stories match those filters yet.</p>`;
}

function renderChapter() {
  chapterText.innerHTML = selectedStory.chapterLines
    .map((line, index) => `<p class="${index === activeLine ? "active-line" : ""}">${escapeHtml(line)}</p>`)
    .join("");

  const percent = Math.min(98, Math.round(((activeLine + 1) / selectedStory.chapterLines.length) * 100));
  const readingProgress = Math.max(state.user.progress[selectedStory.id] || selectedStory.progress, percent);
  state.user.progress[selectedStory.id] = readingProgress;
  progressFill.style.width = `${percent}%`;
  document.querySelector("#readerProgress").textContent = `${readingProgress}%`;
  document.querySelector("#storyProgress").textContent = `${readingProgress}%`;
  renderProfile();
  saveState();
}

function renderComments() {
  commentGrid.innerHTML = selectedStory.comments
    .map(
      ([name, text, signal]) => `
        <article class="comment-card">
          <div class="comment-author">
            <span class="avatar" aria-hidden="true"></span>
            <div>
              <strong>${escapeHtml(name)}</strong>
              <div>${escapeHtml(selectedStory.title)} ${escapeHtml(selectedStory.chapterTitle.split(":")[0])}</div>
            </div>
          </div>
          <blockquote>${escapeHtml(text)}</blockquote>
          <footer>
            <span>${escapeHtml(signal)}</span>
            <span>Quote shared</span>
          </footer>
        </article>
      `
    )
    .join("");
}

function renderPlayerTimes() {
  document.querySelector("#timeElapsed").textContent = formatTime(elapsedSeconds);
  document.querySelector("#timeRemaining").textContent = `-${formatTime(selectedStory.durationSeconds - elapsedSeconds)}`;
}

function selectStory(id) {
  selectedStory = state.stories.find((story) => story.id === id) || state.stories[0];
  activeLine = 0;
  elapsedSeconds = Math.round(selectedStory.durationSeconds * ((state.user.progress[selectedStory.id] || selectedStory.progress) / 100));

  document.querySelector("#story-title").textContent = selectedStory.title;
  document.querySelector("#storyDescription").textContent = selectedStory.description;
  document.querySelector("#storyNarrator").textContent = selectedStory.narrator;
  document.querySelector("#storyLength").textContent = selectedStory.length;
  document.querySelector("#storyProgress").textContent = `${state.user.progress[selectedStory.id] ?? selectedStory.progress}%`;
  document.querySelector("#detailCover").src = selectedStory.cover;
  document.querySelector("#detailCover").alt = `${selectedStory.title} cover`;
  document.querySelector("#storyTags").innerHTML = selectedStory.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  document.querySelector("#dualStoryLabel").textContent = selectedStory.title;
  document.querySelector(".reader-header strong").textContent = selectedStory.chapterTitle;
  document.querySelector("#playerTitle").textContent = selectedStory.title;
  document.querySelector("#playerCover").src = selectedStory.cover;
  playerNarrator.textContent = `${modeLabel.textContent} with ${selectedStory.narrator}`;
  document.querySelector("#saveStoryButton").textContent = state.user.tbr.includes(selectedStory.id) ? "Saved to TBR" : "Save to TBR";
  document.querySelector("#bookmarkToggle").checked = state.user.bookmarks.includes(selectedStory.id);

  renderChapter();
  renderComments();
  renderPlayerTimes();
}

function renderSession() {
  const button = document.querySelector("#sessionButton");
  const status = document.querySelector("#sessionStatus");
  const role = state.session?.role || "Reader";
  document.querySelector("#profileRole").textContent = `Premium Member · ${role}`;

  if (state.session) {
    button.textContent = state.user.name;
    button.dataset.jump = "profile";
    status.textContent = `Signed in as ${state.session.email} · ${role}`;
  } else {
    button.textContent = "Sign In";
    button.dataset.jump = "auth";
    status.textContent = "No live backend yet. Your session is stored only in this browser.";
  }
}

function renderWaitlist() {
  const status = document.querySelector("#waitlistStatus");
  status.textContent = "Early readers, creators, and voice actors get first access through the official Google Form.";
}

function renderProfile() {
  const tbrStories = state.user.tbr
    .map((id) => state.stories.find((story) => story.id === id))
    .filter(Boolean);
  const continueStories = Object.entries(state.user.progress)
    .map(([id, progress]) => ({ story: state.stories.find((item) => item.id === id), progress }))
    .filter((item) => item.story)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  document.querySelector("#profileLibraryCount").textContent = state.user.libraryCount + state.createdStories.length;
  document.querySelector("#profileTbrCount").textContent = tbrStories.length;
  document.querySelector("#profilePoints").textContent = state.user.coins.toLocaleString();
  document.querySelector("#continueList").innerHTML = continueStories
    .map(({ story, progress }) => miniStoryItem(story, `${progress}% complete`))
    .join("");
  document.querySelector("#tbrList").innerHTML = tbrStories.length
    ? tbrStories.map((story) => miniStoryItem(story, story.monetization)).join("")
    : `<p class="mini-list-empty">Save a story from its detail page and it will appear here.</p>`;
  document.querySelector("#creatorActivity").innerHTML = state.createdStories.length
    ? state.createdStories.map((story) => miniStoryItem(story, "Published preview")).join("")
    : `<p class="mini-list-empty">Creator uploads will appear here after publishing a preview.</p>`;
}

function miniStoryItem(story, detail) {
  return `
    <div class="mini-list-item">
      <img src="${story.cover}" alt="">
      <div>
        <strong>${escapeHtml(story.title)}</strong>
        <span>${escapeHtml(story.author)} · ${escapeHtml(story.narrator)}</span>
      </div>
      <small>${escapeHtml(detail)}</small>
    </div>
  `;
}

function jumpTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function stepLine(direction) {
  activeLine = (activeLine + direction + selectedStory.chapterLines.length) % selectedStory.chapterLines.length;
  elapsedSeconds = Math.min(selectedStory.durationSeconds, Math.max(0, elapsedSeconds + direction * 10));
  renderChapter();
  renderPlayerTimes();
}

function setPlaying(next) {
  playing = next;
  playToggle.textContent = playing ? "Pause" : "Play";
  clearInterval(timer);
  if (playing) {
    timer = setInterval(() => {
      elapsedSeconds = Math.min(selectedStory.durationSeconds, elapsedSeconds + 5);
      if (elapsedSeconds >= selectedStory.durationSeconds) {
        setPlaying(false);
      }
      if (elapsedSeconds % 10 === 0) {
        stepLine(1);
      }
      renderPlayerTimes();
    }, 1000);
  }
}

function createStoryFromUpload(form) {
  const data = new FormData(form);
  const title = String(data.get("title") || "Untitled Story").trim();
  const genre = String(data.get("genre") || "Creator Story").trim();
  const narrator = String(data.get("narrator") || "Narration can be added later").trim();
  const summary = String(data.get("summary") || "A new AseVerse story.").trim();
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `story-${Date.now()}`;
  const story = {
    id: `${id}-${Date.now()}`,
    title,
    type: genre,
    genre: genre.includes("Romance") ? "Romance" : genre.includes("Science") ? "Science" : "Fantasy",
    author: state.user.name,
    narrator,
    length: "Preview pending",
    durationSeconds: 240,
    progress: 0,
    cover: "mockup-assets/image-010-1024x1536.jpg",
    monetization: String(data.get("monetization") || "Preview"),
    tags: ["Creator upload", "Preview", "Narrator matching"],
    description: summary,
    chapterTitle: "Chapter 1: Preview",
    chapterLines: [
      "Your story opens here, safely saved as a premium AseVerse preview.",
      "Readers will see the description, chapter format, and monetization path before publication.",
      "Voice actors can be invited when you are ready to add narration."
    ],
    comments: [["AseVerse", "Preview submitted. Narrator matching and monetization review are ready for the next step.", "System note"]]
  };

  state.stories.unshift(story);
  state.createdStories.unshift(story);
  state.user.uploads.unshift(story.id);
  state.user.progress[story.id] = 0;
  saveState();
  renderStories();
  renderProfile();
  selectStory(story.id);
}

document.addEventListener("click", (event) => {
  const storyButton = event.target.closest("[data-story]");
  if (storyButton) {
    selectStory(storyButton.dataset.story);
    jumpTo("story");
  }

  const jumpButton = event.target.closest("[data-jump]");
  if (jumpButton) {
    jumpTo(jumpButton.dataset.jump);
  }

  const narratorButton = event.target.closest("[data-narrator]");
  if (narratorButton) {
    document.querySelectorAll("[data-narrator]").forEach((button) => button.classList.remove("active"));
    narratorButton.classList.add("active");
    modeLabel.textContent = narratorButton.dataset.narrator;
    playerNarrator.textContent = `${narratorButton.dataset.narrator} with ${selectedStory.narrator}`;
  }
});

document.querySelector("#authForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  state.session = {
    email: String(data.get("email")),
    role: String(data.get("role"))
  };
  state.user.email = state.session.email;
  state.user.role = state.session.role;
  saveState();
  renderSession();
  renderProfile();
  jumpTo("home");
});

document.querySelector("#waitlistForm").addEventListener("submit", (event) => {
  event.preventDefault();
  window.open(waitlistUrl, "_blank", "noopener,noreferrer");
});

document.querySelector("#saveStoryButton").addEventListener("click", () => {
  if (!state.user.tbr.includes(selectedStory.id)) {
    state.user.tbr.push(selectedStory.id);
    state.user.coins += 15;
  }
  saveState();
  document.querySelector("#saveStoryButton").textContent = "Saved to TBR";
  renderProfile();
});

document.querySelector("#bookmarkToggle").addEventListener("change", (event) => {
  if (event.target.checked && !state.user.bookmarks.includes(selectedStory.id)) {
    state.user.bookmarks.push(selectedStory.id);
  }
  if (!event.target.checked) {
    state.user.bookmarks = state.user.bookmarks.filter((id) => id !== selectedStory.id);
  }
  saveState();
});

document.querySelector("#backLine").addEventListener("click", () => stepLine(-1));
document.querySelector("#forwardLine").addEventListener("click", () => stepLine(1));
playToggle.addEventListener("click", () => setPlaying(!playing));

document.querySelector("#ambientToggle").addEventListener("change", (event) => {
  readerPanel.style.boxShadow = event.target.checked ? "inset 0 0 90px rgba(216, 167, 51, 0.16)" : "none";
});

document.querySelector("#ambientVolume").addEventListener("input", (event) => {
  document.querySelector(".dual-device").style.filter = `saturate(${1 + event.target.value / 260})`;
});

document.querySelector("#readingTheme").addEventListener("change", (event) => {
  readerPanel.classList.remove("theme-dark", "theme-warm", "theme-light");
  readerPanel.classList.add(`theme-${event.target.value}`);
});

document.querySelector("#fontSize").addEventListener("input", (event) => {
  chapterText.style.fontSize = `${event.target.value}px`;
});

document.querySelector("#storySearch").addEventListener("input", renderStories);
document.querySelector("#genreFilter").addEventListener("change", renderStories);
document.querySelector("#formatFilter").addEventListener("change", renderStories);

document.querySelector("#uploadForm").addEventListener("submit", (event) => {
  event.preventDefault();
  createStoryFromUpload(event.currentTarget);
  published.classList.add("visible");
  jumpTo("published");
});

renderStories();
renderSession();
renderProfile();
renderWaitlist();
selectStory("solar-veil");
