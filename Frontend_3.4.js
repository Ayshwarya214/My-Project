const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  results.innerHTML = `<div class="status-msg"><div class="spinner"></div> Searching…</div>`;
  try {
    const url =
      "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
      "&gsrsearch=" + encodeURIComponent(query) +
      "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (!data.query || !data.query.pages) {
      results.innerHTML = `<p class="status-msg">No results for "${query}". Try another search.</p>`;
      return;
    }
    const items = Object.values(data.query.pages);
    if (items.length === 0) {
      results.innerHTML = `<p class="status-msg">No results for "${query}". Try another search.</p>`;
      return;
    }
    results.innerHTML = `<p class="result-count">Showing ${items.length} results for "${query}"</p>`;
    render(items);
  } catch (err) {
    console.error("Fetch error:", err);
    results.innerHTML = `<p class="status-msg error">Something went wrong. Please try again.</p>`;
  }
});
function render(items) {
  items.forEach((item) => {
    if (!item.imageinfo || !item.imageinfo[0].thumburl) return;
    const card = document.createElement("article");
    card.className = "card";
    const link = document.createElement("a");
    link.href = item.imageinfo[0].url;
    link.target = "_blank";
    const img = document.createElement("img");
    img.src = item.imageinfo[0].thumburl;
    img.alt = item.title;
    const caption = document.createElement("p");
    caption.textContent = item.title.replace("File:", "");
    link.appendChild(img);
    card.appendChild(link);
    card.appendChild(caption);
    results.appendChild(card);
  });
}