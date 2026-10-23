const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  
  if (!query) return;
  try {
    const items = await search(query);
    if (items) {
      render(items);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
async function search(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";
  const response = await fetch(url);
  if (!response.ok) throw new Error(response.status);
  const data = await response.json();
  if (!data.query || !data.query.pages) return [];
  return Object.values(data.query.pages);
}
function render(items) {
  const results = document.getElementById("results");
  results.innerHTML = "";
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