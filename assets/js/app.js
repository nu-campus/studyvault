// ============================================================
// StudyVault download page
//
// EDIT THESE TWO LINES to point at your GitHub repo.
// This repo is where your Actions workflow (see
// .github/workflows/release.yml) publishes each APK as a
// GitHub Release — this page just reads the latest one.
// ============================================================
const GITHUB_OWNER = "nu-campus";
const GITHUB_REPO  = "studyvault";

const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

const btn      = document.getElementById("dl-btn");
const btnLabel = document.getElementById("dl-label");
const verEl    = document.getElementById("dl-version");
const sizeEl   = document.getElementById("dl-size");
const dateEl   = document.getElementById("dl-date");
const errEl    = document.getElementById("dl-error");

function formatBytes(bytes) {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

async function loadLatestRelease() {
  try {
    const res = await fetch(API_URL, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const release = await res.json();

    const apkAsset = (release.assets || []).find(a => a.name.toLowerCase().endsWith(".apk"));
    if (!apkAsset) throw new Error("No APK attached to the latest release yet");

    verEl.textContent  = release.tag_name || "—";
    sizeEl.textContent = formatBytes(apkAsset.size);
    dateEl.textContent = formatDate(release.published_at);

    btn.href = apkAsset.browser_download_url;
    btn.removeAttribute("disabled");
    btnLabel.textContent = "Download APK";
  } catch (err) {
    console.error(err);
    btnLabel.textContent = "Download unavailable";
    errEl.textContent = "Couldn't find a published release yet — check back soon.";
    errEl.style.display = "block";
  }
}

loadLatestRelease();

// ---------------- features modal ----------------
const featuresBtn = document.getElementById("features-btn");
const backdrop     = document.getElementById("modal-backdrop");
const modalClose   = document.getElementById("modal-close");

function openModal() {
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  backdrop.classList.remove("open");
  document.body.style.overflow = "";
}

featuresBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
