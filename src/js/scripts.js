document.addEventListener("click", clickHandlers);

function clickHandlers(event) {
  console.log(event.target);
  if (event.target.matches("#pull")) {
    document.querySelector("body").classList.toggle("show-nav");
    event.preventDefault();
  }
}

// store the link plus the API key in a variable
const key = "uQG4jhIEHKHKm0qMKGcTHqUgAolr1GM0";
const API = `https://api.nytimes.com/svc/topstories/v2/nyregion.json?api-key=${key}`;
const storagePrefix = "nyt-autosave";

console.log(API);

function getStories() {
  fetch(API)
    .then((response) => response.json())
    .then((data) => showData(data.results));
}

function showData(stories) {
  var looped = stories
    .map(
      (story) => `
    <div class="item">
    <picture>
    <img src="${story.multimedia[2].url}" alt="" />
    <caption>${story.multimedia[2]?.caption}</caption>
    </picture>
      <h3><a href="${story.url}">${story.title}</a></h3>
      <p>${story.abstract}</p>
    </div>
  `
    )
    .join("");

  document.querySelector(".stories").innerHTML = looped;
  sessionStorage.setItem(storagePrefix, looped);
}

if (document.querySelector(".home")) {
  let saved = sessionStorage.getItem(storagePrefix);
  if (saved) {
    console.log("loading from session storage");
    document.querySelector(".stories").innerHTML = saved;
  } else {
    console.log("loading from nytimes api");
    getStories();
  }
}
