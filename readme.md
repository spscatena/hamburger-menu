# Redesign

- [Redesign](#redesign)
  - [Homework](#homework)
  - [Reading](#reading)
  - [Exercise - A Site Redesign](#exercise---a-site-redesign)
  - [GIT](#git)
  - [Deployment](#deployment)
  - [Setup and Navigation](#setup-and-navigation)
  - [Header](#header)
  - [SASS](#sass)
    - [Aside: Using Live SASS Compiler in VS Code](#aside-using-live-sass-compiler-in-vs-code)
    - [Nesting SASS](#nesting-sass)
    - [Media Query - Mobile First](#media-query---mobile-first)
    - [Variables](#variables)
  - [Responsive Main Nav](#responsive-main-nav)
    - [Show/Hide Nav](#showhide-nav)
    - [Large Screen](#large-screen)
  - [Video Component](#video-component)
    - [Getting and Setting HTML Attributes](#getting-and-setting-html-attributes)
    - [Updating the Video](#updating-the-video)
  - [Create Posts](#create-posts)
  - [Subtemplates](#subtemplates)
  - [Note: fall2019 - continue on the video scripting above.](#note-fall2019---continue-on-the-video-scripting-above)
    - [Image Carousel](#image-carousel)
    - [Content Slider](#content-slider)
  - [Event Delegation](#event-delegation)
  - [Forms](#forms)
    - [Form CSS](#form-css)
    - [Form Elements](#form-elements)
    - [CSS for Material Design Form](#css-for-material-design-form)
  - [Content Management](#content-management)
  - [Notes](#notes)

## Homework

Prepare your final project.

## Reading

- [Using Git, Github and 11ty](https://youtu.be/PqlhYVqLDm0) together to create a simple site.
- Also [Oh Shit Git](https://ohshitgit.com)
- and don't forget the [11ty](https://www.11ty.io/docs/templates/) documentation

## Exercise - A Site Redesign

Our hypothetical company has a site the looks outdated, is not responsive and needs to be broken up into multiple pages.

[Here](http://oit2.scps.nyu.edu/~devereld/session8/app/) is what their site looks like.

![site](ignore/other/wide.png)

We will be using many of the files and techniques we looked at last week. Before beginning, examine the files.

- `.gitignore` - includes the `dist` directory
- `pages` - our base directory
- `layouts` - our `layout.html` file now references partials via `include`
- `.eleventyignore` - instructs 11ty to not process `readme.md` (this file) and the ignore directory
- `.eleventy.js` - passthroughs for images and JS but not css
- `home.md` has a permalink (`/`) in the front matter which means it will not render to its own directory in the `dist` folder but will instead render to the top level (i.e. it becomes `index.html`). Therefore `<li><a href="/">Home</a></li>` has been removed from the navigation as it is no longer necessary.

## GIT

Initialize the repository

```sh
$ cd <project directory>
$ git init
$ git add .
$ git commit -m 'Initial commit'
```

Run the project:

```sh
$ npm run eleventy
```

And open the site in Chrome.

Create a new Github repo and add the remote origin to the repo following the instructions on Github.

```sh
$ git add <your repo name as per the instructions on Github>
$ git push -u origin main
```

## Deployment

We'll use [Netlify](https://www.netlify.com/) to put this on the web. Register and/or log in to [app.netlify.com](https://app.netlify.com) and drag and drop the `dist` folder onto the web browser window to upload the contents [live to the web](https://zealous-kilby-113356.netlify.com/).

We can also hook into a Github branch to set up [continuous delpoyment](https://app.netlify.com/start). Here is a [sample](https://agitated-bartik-814348.netlify.com/) with [admin](https://agitated-bartik-814348.netlify.com/admin).

- use the terminal to create and checkout a new branch

```sh
$ git branch dev
$ git checkout dev
```

In the future you will be able to merge your dev branch with the master branch, push it to Github and have your site updated automatically.

Make sure the branch is clean, then checkout the main (master) branch and push to Github. Netlify will take over from there - running the eleventy command to create a `dist` folder and putting that on its CDN.

```sh
$ git add .
$ git commit -m 'commit message'
$ git checkout master
$ git push -u origin master
```

## LocalStorage and SessionStorage

It seems excessive to check the NY Times API every time we go to the home page.

The localStorage and sessionStorage APIs let you store data locally in the browser. You can use the local storage API to store data locally that the browser can access later.

Data is stored indefinitely, and must be a string.

```js
// Store data
var someData = "The data that I want to store for later.";
localStorage.setItem("myDataKey", someData);

// Get data
var data = localStorage.getItem("myDataKey");

// Remove data
localStorage.removeItem("myDatakey");
```

Session storage works just like localStorage, except the data is cleared when the browser session ends.

```js
// Store data
var someTempData = "The data that I want to store temporarily.";
sessionStorage.setItem("myTempDataKey", someTempData);

// Get data
var tempData = sessionStorage.getItem("myTempDataKey");

// Remove data
sessionStorage.removeItem("myTempDatakey");
```

Browsers provide differing levels of storage space for localStorage and sessionStorage, ranging from as little as 2mb up to unlimited. Try to reduce the overall footprint of your data as much as possible.

We begin by creating a key for our nytimes data and then checking for the data in local storage. If it exists then we'll use that data. Otherwise we'll fetch the data from the nytimes api:

```js
// the key
const storagePrefix = "nyt-autosave";
// omitted for brevity

function showData(stories) {
  // omitted for brevity
  sessionStorage.setItem(storagePrefix, looped);
}

if (document.querySelector(".home")) {
  var saved = sessionStorage.getItem(storagePrefix);
  if (saved) {
    console.log("loading from sessionStorage");
    document.querySelector(".stories").innerHTML = saved;
  } else {
    console.log("fetching from nytimes");
    getStories();
  }
}
```

<!--
```
const key = "uQG4jhIEHKHKm0qMKGcTHqUgAolr1GM0";
const API = `https://api.nytimes.com/svc/topstories/v2/nyregion.json?api-key=${key}`;
const storagePrefix = "nyt-autosave";

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

  sessionStorage.setItem(storagePrefix, looped);
  document.querySelector(".stories").innerHTML = looped;
}

if (document.querySelector(".home")) {
  var saved = sessionStorage.getItem(storagePrefix);
  if (saved) {
    console.log("loading from sessionStorage");
    document.querySelector(".stories").innerHTML = saved;
  } else {
    console.log("fetching from nytimes");
    getStories();
  }
}

```
 -->

## Active Class for the Navigation

Update the [navigation](https://www.11ty.io/docs/) to include an active class using a Liquid `if` statement:

```html
<nav>
  <ul>
    {% for nav in collections.nav %}
    <li class="{% if nav.url == page.url %} active{% endif %}">
      <a href="{{ nav.url | url }}">{{ nav.data.navTitle }}</a>
    </li>
    {%- endfor -%}
  </ul>
</nav>
```

## Header

Add the first component to `layout.html` after the nav include, e.g.:

```
{% include components/nav.html %}
{% include components/header.html %}
```

## SASS

Stop 11ty processing and install sass:

```sh
$ npm i -D sass
```

Note: `i` is short for `install` and `-D` is short for `--save-dev`

Add scripts to the manifest:

```js
  "scripts": {
    "eleventy": "eleventy --serve",
    "sass": "sass src/scss/styles.scss dist/css/styles.css --watch --source-map",
    "start": "npm run eleventy & npm run sass"
  },
```

CSS minifcation can be added since the `dist` folder is our production version

`"sass": "sass src/scss/styles.scss dist/css/styles.css --watch --source-map --style=compressed",`

Restart (`npm start`) the processes.

Copy and paste the contents of `styles.css` to `_base.scss`.

Include the sass partial in `styles.scss`

```css
@import "imports/base";
```

Note: since we are compiling the scss directly to the `dist` folder, there is no need for a css passthrough in `.eleventy.js`.

### Nesting SASS

Add header CSS to a new `_header.scss` file using nesting:

```css
header {
  max-width: 980px;
  margin: 0 auto;
  padding-top: 2rem;
  h1 {
    font-size: 2.5rem;
  }
  p {
    font-size: 1.5rem;
    text-transform: uppercase;
    line-height: 1.1;
    margin-bottom: 1rem;
  }
  h1 + p {
    padding-top: 1rem;
    border-top: 3px double #dbd1b5;
  }
  p + p {
    font-size: 1rem;
    line-height: 1.1;
    color: #999;
  }
}
```

Examine the resulting css file. Note the minification and mapping.

Inspect the header in the developer tools and note that _mapping_ maps the css line numbers to the scss line numbers

### Media Query - Mobile First

Add a media query to hide the header paragraphs on small screens.

Normally this would be written as:

```css
@media (max-width: 780px) {
  header p {
    display: none;
  }
}
```

But because we are nesting with sass we can simply write (in `_header.scss`):

```css
p {
  /* ...  */
  @media (max-width: 780px) {
    display: none;
  }
}
```

Note: this is _not_ a mobile first design pattern. It uses `max-width` to add display attributes to small screens.

Change it to use a `min-width` mobile first design pattern:

```css
p {
  display: none;
  @media (min-width: 780px) {
    display: block;
    font-size: 1.5rem;
    text-transform: uppercase;
    line-height: 1.1;
    margin-bottom: 1rem;
  }
}
```

Git add, commit, merge and push the branch to deploy the changes.

```sh
$ git add .
$ git commit -m 'added header'
$ git status
$ git checkout master
$ git merge dev
$ git push -u origin master
```

### Variables

Create `_variables.scss` in `scss/imports` with:

```
$break-sm: 480px;
$break-med: 768px;
$break-wide: 980px;

$max-width: 980px;

$link: #007eb6;
$hover: #df3030;
$text: #333;
$med-gray: #666;
$light-gray: #ddd;
$dk-yellow: #dbd1b5;
```

Import it into `styles.scss`. Be sure to import it first in order to make the variables available to the subsequent imports.

Apply the color and break point variables to `_header.scss`

```css
header {
  max-width: $max-width;
  margin: 0 auto;
  padding-top: 2rem;
  h1 {
    font-size: 2.5rem;
  }
  p {
    display: none;
    @media (min-width: $break-med) {
      display: block;
      font-size: 1.5rem;
      text-transform: uppercase;
      line-height: 1.1;
      margin-bottom: 1rem;
    }
  }
  h1 + p {
    padding-top: 1rem;
    border-top: 3px double $dk-yellow;
  }
  p + p {
    font-size: 1rem;
    line-height: 1.1;
    color: $med-gray;
  }
}
```

## Responsive Main Nav

Add a link `<a href="#" id="pull"></a>` to the nav:

```html
<nav>
  <a href="#" id="pull"></a>
  <ul>
    ...
  </ul>
</nav>
```

We will use this to show a menu on small screens.

- create a sass partial `_nav.scss`
- import it into `styles.css` with `@import 'imports/nav';`
- IMPORTANT - remove all references to nav in `_base.scss`

Small screen first - show and format the hamburger menu:

```css
#pull {
  display: block;
  background-color: $link;
  padding-top: 12px;
  padding-left: 12px;
  width: 100vh;
}

#pull::after {
  content: "";
  background: url(../img/nav-icon.png) no-repeat;
  width: 22px;
  height: 22px;
  background-size: cover;
  display: inline-block;
}
```

Format the ul for the small screen:

```css
nav ul {
  // display: none;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: $link;
}

nav a {
  padding: 1rem;
  color: #fff;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    text-decoration: none;
  }
}

nav li:hover:not(.active) {
  background-color: lighten($link, 10%);
}

nav .active {
  background-color: darken($link, 10%);
}

nav .active a {
  font-weight: bold;
}
```

### Show/Hide Nav

Add to the top of `scripts.js`:

```js
var hamburger = document.querySelector("#pull");
var body = document.querySelector("body");

hamburger.addEventListener("click", showMenu);

function showMenu(event) {
  body.classList.toggle("show-nav");
  event.preventDefault();
}
```

or, using event delegation:

```js
// var hamburger = document.querySelector("#pull");
// var body = document.querySelector("body");

document.addEventListener("click", clickHandlers);

function clickHandlers(event) {
  console.log(event.target);
  if (event.target.matches("#pull")) {
    document.querySelector("body").classList.toggle("show-nav");
    event.preventDefault();
  }
  // event.preventDefault();
}
```

Enable the `display: none` property on `nav ul` and add a `.show-nav` class in `_nav.scss`:

```css
.show-nav nav ul {
  display: block;
}
```

Note that the content shifts down when the nav is visible.

```css
.show-nav nav ul {
  display: block;
  position: absolute;
  width: 100%;
}
```

We can use flex wiith a column direction instead of display block:

```css
.show-nav nav ul {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
}
```

### Large Screen

Add media queries for medium and larger screens.

Hide the hamburger on wider screens:

```css
#pull {
  display: block;
  background-color: $link;
  padding-top: 12px;
  padding-left: 12px;
  @media (min-width: $break-med) {
    display: none;
  }
}
```

Show the navigation on large screens:

```css
nav ul {
  display: none;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: $link;
  @media (min-width: $break-med) {
    display: flex;
    justify-content: space-around;
    background: $link;
    text-align: center;
  }
}
```

Format the flex children with `flex-grow` to allow the li's to expand.

```css
// nav li:hover:not(.active) {
//   background-color: lighten($link, 10%);
// }

nav li {
  &:hover:not(.active) {
    background-color: lighten($link, 10%);
  }
  @media (min-width: $break-med) {
    flex-grow: 1;
  }
}
```

The complex selector with the ampersand compiles to `nav li:hover:not(.active)`. Without the ampersand it compiles to `nav li :hover:not(.active)`. See [CSS Tricks](https://css-tricks.com/the-sass-ampersand/) for more information on the ampersand in SASS.

Check the navigation on both sizes and make adjustments as necessary.

Note: if we were making a single page app (SPA) we would have to code the menu to disappear when a selection was made. But because we are actually navigating to a new URL, the menu collapses naturally.

## Video Component

Add the component to `videos.md`

```html
<section>{% include components/video.html %}</section>
```

Examine the component's HTML in the dev tools.

Format the video and buttons in a new `_video.scss`:

```css
.content-video {
  iframe {
    background: #222;
    height: 320px;
  }
  .btn-list {
    padding: 6px;
    display: flex;
    li {
      margin: 1rem;
    }
    .active {
      border-radius: 4px;
      background: $link;
      color: #fff;
      padding: 0.5rem;
    }
  }
}
```

In `base`

```css
img,
iframe {
  width: 100%;
}

ul {
  list-style: none;
}
```

Clicking the buttons should reveal a different video.

Create variables and a function:

```js
const videoLinks = document.querySelectorAll(".content-video a");

videoLinks.forEach((videoLink) =>
  videoLink.addEventListener("click", function (event) {
    console.log(event.target);
    event.preventDefault();
  })
);
```

Examine the `videoLinks` nodelist in the console.

Add a `selectVideo` function:

```js
const videoLinks = document.querySelectorAll(".content-video a");

videoLinks.forEach((videoLink) =>
  videoLink.addEventListener("click", selectVideo)
);

function selectVideo(event) {
  console.log(event.target);
  event.preventDefault();
}
```

Note: we are using `forEach` - a method that exists for both nodeLists and Arrays.

Examine the videoLinks in the console. Not, they are a nodelist.

If you want to convert them into an array use `Array.from()`:

`const videoLinks = Array.from(document.querySelectorAll('.content-video a'));`

### Getting and Setting HTML Attributes

Isolate the `href` value using `getAttribute`:

```js
const videoLinks = Array.from(document.querySelectorAll(".content-video a"));

videoLinks.forEach((videoLink) =>
  videoLink.addEventListener("click", selectVideo)
);

function selectVideo(event) {
  const videoToPlay = event.target.getAttribute("href");
  console.log(videoToPlay);
  event.preventDefault();
}
```

### Updating the Video

Add a variable for the iFrame:

`const iFrame = document.querySelector('iframe')`

and set its src attribute to the videoToPlay variable:

`iFrame.setAttribute('src', videoToPlay)`:

```js
const iFrame = document.querySelector("iframe"); // NEW
const videoLinks = document.querySelectorAll(".content-video a");

videoLinks.forEach((videoLink) =>
  videoLink.addEventListener("click", selectVideo)
);

function selectVideo(event) {
  const videoToPlay = event.target.getAttribute("href");
  iFrame.setAttribute("src", videoToPlay); // NEW
  console.log(iFrame); // NEW
  event.preventDefault();
}
```

Switch the active class:

```js
const iFrame = document.querySelector("iframe");
const videoLinks = document.querySelectorAll(".content-video a");
videoLinks.forEach((videoLink) =>
  videoLink.addEventListener("click", selectVideo)
);

function selectVideo(event) {
  removeActiveClass(); // NEW
  this.classList.add("active"); // NEW
  const videoToPlay = event.target.getAttribute("href");
  iFrame.setAttribute("src", videoToPlay);
  event.preventDefault();
}

// NEW
function removeActiveClass() {
  videoLinks.forEach((videoLink) => videoLink.classList.remove("active"));
}
```

For performance reasons, you also should not loop over each element and attach an event listener to it.

Delete the video code and use event delegation:

```js
function clickHandlers(event) {
  if (event.target.matches("#pull")) {
    document.querySelector("body").classList.toggle("show-nav");
    event.preventDefault();
  }
  if (event.target.matches(".content-video a")) {
    const iFrame = document.querySelector("iframe");
    const videoLinks = document.querySelectorAll(".content-video a");
    videoLinks.forEach((videoLink) => videoLink.classList.remove("active"));
    event.target.classList.add("active");
    const videoToPlay = event.target.getAttribute("href");
    iFrame.setAttribute("src", videoToPlay);
    event.preventDefault();
  }
}
```

Note: our clickHandlers function is getting out of hand. Let's use it to call separate functions:

```js
function clickHandlers(event) {
  if (event.target.matches("#pull")) {
    showMenu();
    event.preventDefault();
  }
  if (event.target.matches(".content-video a")) {
    videoSwitch();
    event.preventDefault();
  }
}

var showMenu = function () {
  document.querySelector("body").classList.toggle("show-nav");
};

var videoSwitch = function () {
  const iFrame = document.querySelector("iframe");
  const videoLinks = document.querySelectorAll(".content-video a");
  videoLinks.forEach((videoLink) => videoLink.classList.remove("active"));
  event.target.classList.add("active");
  const videoToPlay = event.target.getAttribute("href");
  iFrame.setAttribute("src", videoToPlay);
};
```

To support a side-by-side layout on wide screens add the following to base.scss:

```css
section {
  @media (min-width: $break-med) {
    max-width: $max-width;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-column-gap: 1rem;
    padding-top: 2rem;
    article {
      iframe {
        min-height: 300px;
      }
    }
  }
}

p {
  margin: 1rem 0;
}
```

<!-- HERE -->

## Create Posts

Create a new posts folder in src.

Create two posts.

1. `services.md`:

```md
---
layout: layouts/layout.html
date: 2010-01-01
postTitle: Services
---

# Our Services

Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.

Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.
```

2. `people.md`:

```md
---
layout: layouts/layout.html
date: 2010-01-01
postTitle: People
---

# People

Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.

Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.
```

Create `posts.json`:

```js
{
  "layout": "layouts/layout.html",
  "tags": ["posts"]
}
```

Use the content on the blog page.

`blog.html`:

```md
---
pageTitle: About Us
date: 2019-03-01
navTitle: About Us
pageClass: blog
---

<section>
  {% for post in collections.posts %}
  <article>
    {{ post.templateContent }} {{ post.date | date: "%Y-%m-%d" }}
  </article>
  {% endfor %}
</section>
```

If you wish you can create a series of links to the posts:

In `pages/home.md`:

```md
---
layout: layouts/layout.html
pageTitle: Welcome
tags: nav
navTitle: Home
date: 2010-01-01
permalink: /
---

<section>

{% for post in collections.posts %}

  <article>
  <h2><a href="{{ post.url }}">{{ post.data.postTitle | upcase }}</a></h2>
  <p>{{ post.date | date: "%Y-%m-%d" }}<p>
  </article>
  {% endfor %}

</section>
```

## Subtemplates

In order to further customize the video template we will set up a partial in `_includes/layouts/video.html`:

```
---
layout: layouts/layout.html
---

<section>
  {% include components/video.html %}
</section>

{{ content }}

```

## Note: fall2019 - continue on the video scripting above.

In `pages/videos.md`

```md
---
layout: layouts/video.html
pageTitle: Videos
navTitle: Videos
date: 2019-01-01
---

Insisting that they had taken every measure to keep the message “extra top secret,” the Trump boys reportedly spent Wednesday defending their decision to send Saudi Arabia plans for a cool missile using their personal Etch A Sketch. “We spent, like, a million hours making that rocket look super good, so we had to send it to our friends in Sunny Arabia."

[Home](/)
```

<!-- HERE -->

### Image Carousel

Add and new layout file `images.html` to `_includes/layouts`:

```
---
layout: layouts/layout.html
---

{% include components/images.html %}

{{ content }}
```

In `images.md`

```
---
layout: layouts/images.html
pageTitle: Images
navTitle: Images
date: 2019-02-01
---

[Home](/)
```

Do a DOM review of this section of the page.

In a new SASS partial `_carousel.scss`:

```css
.secondary aside {
  ul {
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    li {
      flex-basis: 28%;
      margin: 2px;
      padding: 4px;
      background-color: #fff;
      border: 1px solid $dk-yellow;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1);
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
      }
    }
  }
}
```

Note the transition:

```css
li img {
	...
	transition: all 0.2s linear;
	&:hover {
		transform: scale(1.1);
		box-shadow: 1px 1px 1px rgba(0,0,0,0.4);
	}
```

### Content Slider

The large image on the images page

```css
figure {
  position: relative;
  figcaption {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    position: absolute;
    bottom: 0;
  }
}
```

Create a script that will change the main image when a thumbnail is clicked.

```js
const carouselLinks = document.querySelectorAll(".image-tn a");
const carousel = document.querySelector("figure img");

carouselLinks.forEach((carouselLink) =>
  carouselLink.addEventListener("click", runCarousel)
);

function runCarousel() {
  const imageHref = this.getAttribute("href");
  carousel.setAttribute("src", imageHref);
  event.preventDefault();
}
```

Set the text in the figure caption.

Find the appropriate traversal `const titleText = this.firstChild.title`:

```js
function runCarousel() {
  const imageHref = event.target.parentNode.getAttribute("href");
  console.log(imageHref);
  const titleText = event.target.title;
  console.log(titleText);
  carousel.setAttribute("src", imageHref);
  event.preventDefault();
}
```

Create a pointer to the figcaption in order to manipulate its content:

```js
const carouselPara = document.querySelector("figcaption");
```

Set the innerHTML `carouselPara.innerHTML = titleText` of the paragraph:

```js
function runCarousel() {
  const imageHref = event.target.parentNode.getAttribute("href");
  console.log(imageHref);
  const titleText = event.target.title;
  console.log(titleText);
  carousel.setAttribute("src", imageHref);
  carouselPara.innerHTML = titleText;
  event.preventDefault();
}
```

## Event Delegation

Delete the scripts related to the carousel.

Let's see what we are clicking on when we click on a thumbnail.

```js
function clickHandlers() {
  event.preventDefault(); // NEW
  console.log(event.target); //NEW
  if (event.target.matches("#pull")) {
    showMenu();
    event.preventDefault();
  }
  if (event.target.matches(".content-video a")) {
    videoSwitch();
    event.preventDefault();
  }
}
```

We are getting the image node.

Block the default event on the click:

```js
function clickHandlers() {
  if (event.target.matches("#pull")) {
    showMenu();
    event.preventDefault();
  }
  if (event.target.matches(".content-video a")) {
    videoSwitch();
    event.preventDefault();
  }
  if (event.target.matches(".image-tn img")) {
    event.preventDefault();
  }
}
```

Add a function:

```js
function runCarousel() {
  const imageHref = event.target.parentNode.getAttribute("href");
  console.log(imageHref);
}
```

and a call to that function in `clickHandlers`:

```js
if (event.target.matches(".image-tn img")) {
  runCarousel();
  event.preventDefault();
}
```

Our clicks now capture the href value of the linked thumbnails.

Capture the title text:

```js
function runCarousel() {
  const imageHref = event.target.parentNode.getAttribute("href");
  const titleText = event.target.title;
  console.log(titleText);
}
```

Finallly, use those two variables to set the large image and caption:

```js
function runCarousel() {
  const imageHref = event.target.parentNode.getAttribute("href");
  const titleText = event.target.title;
  document.querySelector("figure img").setAttribute("src", imageHref);
  document.querySelector("figcaption").innerHTML = titleText;
}
```

Compare the commented out function. Note how simpler and maintainable delegation is.

## Forms

Examine the HTML below:

```html
<form name="contact" method="POST" action="/" autocomplete="true">
  <fieldset>
    <label for="name">Your name</label>
    <input
      type="text"
      name="name"
      id="name"
      placeholder="Name"
      required
      autocomplete="off"
      autofocus
    />

    <label for="email">Email address</label>
    <input
      type="email"
      name="email"
      id="email"
      placeholder="Email"
      required
      autocomplete="off"
    />

    <label for="website">Website</label>
    <input
      type="url"
      name="website"
      required
      placeholder="http://www.example.com"
    />

    <label for="number">Number</label>
    <input
      type="number"
      name="number"
      min="0"
      max="10"
      step="2"
      required
      placeholder="Even num < 10"
    />

    <label for="range">Range</label>
    <input type="range" name="range" min="0" max="10" step="2" />

    <label for="message">Your message</label>
    <textarea
      name="message"
      id="message"
      placeholder="Your message"
      rows="7"
    ></textarea>

    <button type="submit" name="submit">Send Message</button>
  </fieldset>
</form>
```

Let's get the form onto our page before we examine it.

Create `_includes/components/contact.html` with the HTML above.

Create a layout which includes the form, `layouts/contact.html`:

```yml
---
layout: layouts/layout.html
---
<article>
{% include components/contact.html %}
</article>

{{ content }}
```

Edit the content `contact.md` to use the new layout:

```yml
---
layout: layouts/contact.html
pageTitle: Contact Us
navTitle: Contact
date: 2019-04-01
---
## Why contact us?

Not certain if we'll ever get back to you but its worth a try.
```

### Form CSS

Create and link a new sass partial called `_form.scss`:

```css
form {
  padding: 2em 0;
}

form label {
  /* display: none; */
}

input,
textarea,
button {
  width: 100%;
  padding: 1em;
  margin-bottom: 1em;
  font-size: 1rem;
}

input,
textarea {
  border: 1px solid $med-gray;
  border-radius: 5px;
}

button {
  border: 1px solid $link;
  background-color: $link;
  color: #fff;
  cursor: pointer;
}
```

There are a number of css pseudo selectors and techniques that can be used with forms:

```css
input:focus,
textarea:focus {
  box-shadow: 0 0 15px lighten($link, 40%);
}

input:not(:focus),
textarea:not(:focus) {
  opacity: 0.35;
}

input:required,
textarea:required {
  background-color: lighten($link, 60%);
}

input:valid,
textarea:valid {
  background-color: lighten(green, 60%);
}

input:invalid,
textarea:invalid {
  background-color: lighten(red, 40%);
}

input:focus:invalid,
textarea:focus:invalid {
  background-color: lighten(red, 40%);
}
```

### Form Elements

`<form>`:

- action - specifies where to send the user when a form is submitted
- autocomplete - specifies whether a form should have autocomplete on or off
- method - specifies the HTTP method to use when sending form-data
- name - specifies the name of a form
- novalidate - turns validation off, typically used when you provide your own custom validations routines

`<fieldset>`:

- allows the form to be split into multiple sections (e.g. shipping, billing)
- not really needed here

`<label>`:

- identifies the field's purpose to the user
- the `for` attribute of the `<label>` tag should be the same as the id attribute of the related input to bind them together
- Clicking on a properly bound form selects its linked input

`<input>`:

- specifies an input field where the user can enter data.
- can accept autocomplete and autofocus
- is empty (`/>`) and consists of attributes only

`<input>` attributes:

- `name` - Specifies the name of an `<input>` element used to reference form data after a form is submitted
- `type` - the [most complex](https://www.w3schools.com/tags/att_input_type.asp) attribute, determines the nature of the input
- `required` - works with native HTML5 validation
- `placeholder` - the text the user sees before typing

Additional input attributes we will be using:

- `pattern` - uses a [regular expression](https://www.w3schools.com/TAGS/att_input_pattern.asp) that the `<input>` element's value is checked against on form submission
- `title` - use with pattern to specify extra information about an element, not form specific, often shown as a tooltip text, here - describes the pattern to help the user

DELETE THE FORM FIELDS LEAVING ONLY THE BUTTON.

Edit the first field:

```html
<input
  type="text"
  name="name"
  id="name"
  required
  autocomplete="name"
  title="Please enter your name"
/>
<label for="name">Name</label>
```

Note the tooltip and autocomplete action.

Note that I have placed the labels after the inputs. Placing them before would be more common but we are going to style them.

Edit the second field:

```html
<input
  type="email"
  name="email"
  id="email"
  autocomplete="email"
  title="The domain portion of the email address is invalid (the portion after the @)."
  pattern="^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$"
  required
/>
<label for="email">Email</label>
```

Edit the textarea:

```html
<textarea
  name="message"
  id="message"
  placeholder="Write your message here"
  rows="7"
  required
></textarea>
<label for="message">Message</label>
```

Add a data attribute to allow Netlify to process the posting:

```html
<form name="contact" method="POST" data-netlify="true" action="/"></form>
```

Note: the form will not function correctly on localhost.

In order to run the form locally we might try installing [Netlify Dev](https://www.netlify.com/products/dev/) but for today we'll deploy and test the deployed form.

End form:

```html
<form name="contact" method="POST" data-netlify="true" action="/">
  <fieldset>
    <input
      type="text"
      name="name"
      id="name"
      autocomplete="name"
      title="Please enter your name"
      required
    />
    <label for="name">Name</label>

    <input
      type="email"
      name="email"
      id="email"
      autocomplete="email"
      title="The domain portion of the email address is invalid (the portion after the @)."
      pattern="^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$"
      required
    />
    <label for="email">Email</label>

    <textarea
      name="message"
      id="message"
      placeholder="Write your message here"
      rows="7"
      required
    ></textarea>
    <label for="message">Message</label>

    <button type="submit" name="submit">Send Message</button>
  </fieldset>
</form>
```

### CSS for Material Design Form

Label effect:

```css
form {
  display: grid;
  padding: 2em 0;
  display: block;
  position: relative;
}

form label {
  display: block;
  position: relative;
  top: -42px;
  left: 16px;
  font-size: 16px;
  z-index: 1;
  transition: all 0.3s ease-out;
}

input:focus + label,
input:valid + label {
  top: -80px;
  font-size: 0.875rem;
  color: #00aced;
}

input,
textarea,
button {
  width: 100%;
  padding: 1em;
  margin-bottom: 1em;
  font-size: 1rem;
}

input {
  display: block;
  position: relative;
  background: none;
  border: none;
  border-bottom: 1px solid $link;
  font-weight: bold;
  font-size: 16px;
  z-index: 2;
}

textarea {
  border: 1px solid $link;
}
textarea + label {
  display: none;
}
textarea:focus {
  outline: none;
}

input:focus,
input:valid {
  outline: none;
  border-bottom: 1px solid $link;
}

button {
  border: 1px solid $link;
  background-color: $link;
  color: #fff;
  cursor: pointer;
}
```

## Content Management

[Headless CMS](https://en.wikipedia.org/wiki/Headless_content_management_system) - a back-end only content management system built from the ground up as a content repository that makes content accessible via a RESTful API for display on any device.

[Netlify CMS](https://www.netlifycms.org/).

Here's a [tutorial](https://css-tricks.com/jamstack-comments/) on CSS-Tricks.

https://www.netlifycms.org/docs/add-to-your-site/

https://templates.netlify.com/template/eleventy-netlify-boilerplate/#about-deploy-to-netlify
https://github.com/danurbanowicz/eleventy-netlify-boilerplate/blob/master/admin/preview-templates/index.js

## Notes

js ajax and localstorage

At a certain point I had to adjust the js to remove an error.

```
---
pageClass: blog
pageTitle: Blog
date: 2019-03-01
navTitle: Blog
---

<div class="blog"></div>
```

```js
document.addEventListener("click", clickHandlers);

var nyt =
  "https://api.nytimes.com/svc/topstories/v2/nyregion.json?api-key=uQG4jhIEHKHKm0qMKGcTHqUgAolr1GM0";

function clickHandlers() {
  if (event.target.matches("#pull")) {
    document.querySelector("body").classList.toggle("show-nav");
    event.preventDefault();
  }
  if (event.target.matches(".content-video a")) {
    const iFrame = document.querySelector("iframe");
    const videoLinks = document.querySelectorAll(".content-video a");
    videoLinks.forEach((videoLink) => videoLink.classList.remove("active"));
    event.target.classList.add("active");
    const videoToPlay = event.target.getAttribute("href");
    iFrame.setAttribute("src", videoToPlay);
    event.preventDefault();
  }
}

var addContent = function (data) {
  var looped = "";

  for (i = 0; i < data.results.length; i++) {
    looped += `
      <div class="item">
        <h3>${data.results[i].title}</h3>
        <p>${data.results[i].abstract}</p>
      </div>
      `;
  }
  if (document.querySelector(".content .blog")) {
    document.querySelector(".content .blog").innerHTML = looped;
  }
};

var getData = function () {
  fetch(nyt)
    .then((response) => response.json())
    .then((json) => addContent(json));
};

getData();
```
