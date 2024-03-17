// Create scoller progress indicator
const calculateScrollerProgress = (mediaScroller) => {
  let mediaScrollerProgress = null;
  if (mediaScroller) {
    mediaScrollerProgress = mediaScroller;
  } else {
    mediaScrollerProgress = document.createElement("div");
    mediaScrollerProgress.classList.add("media-scroller__progress");
  }
  mediaScrollerProgress.innerHTML = "";
  const itemsPerSlide = parseInt(
    getComputedStyle(document.body).getPropertyValue("--item-per-slide")
  );
  const scrollerProgressCount = Math.ceil(7 / itemsPerSlide);
  for (let i = 0; i < scrollerProgressCount; i++) {
    mediaScrollerProgress.insertAdjacentHTML(
      "beforeend",
      "<div class='scroller-progress'></div>"
    );
  }
  return mediaScrollerProgress;
};

// Create carousel
const createMediaScroller = (category, index, medias) => {
  const mediaGroup = document.createElement("div");
  medias.forEach((m) => {
    mediaGroup.insertAdjacentHTML(
      "beforeend",
      `<a class="movie-link" href="${apiUrl}/titles/${m.id}"><img src="${m.image_url}" alt="${m.title}" data-id="${m.id}"></a>`
    );
  });
  const mediaScrollerProgress = calculateScrollerProgress();
  mediaScrollerProgress.children[0].classList.add("active-group");

  const mediaScroller = `
<div class="media-scroller">
    <div class="media-scroller__header">
        <h2 class="media-scroller__title">${category}</h2>
        <div class="media-scroller__progress">
            ${mediaScrollerProgress.innerHTML}
        </div>
    </div>
    <div class="media-scroller__content">
        <button class="handle left-handle inactive-handle" id="left-scroller-${index}">&#8249;</button>
        <div class="media-group">
            ${mediaGroup.innerHTML}
        </div>
        <button class="handle right-handle" id="right-scroller-${index}">&#8250</button>
    </div>
</div>`;
  return mediaScroller;
};

// Handle clic on left/right scroller handles
const onHandleClick = (handle) => {
  const progress = handle
    .closest(".media-scroller")
    .querySelector(".media-scroller__progress");
  const slider = handle
    .closest(".media-scroller__content")
    .querySelector(".media-group");
  let sliderIndex = parseInt(
    getComputedStyle(slider).getPropertyValue("--slider-index")
  );
  if (handle.classList.contains("left-handle")) {
    if (sliderIndex - 1 <= 0) {
      handle.classList.add("inactive-handle");
    }
    slider.style.setProperty("--slider-index", sliderIndex - 1);
    progress.children[sliderIndex].classList.remove("active-group");
    progress.children[sliderIndex - 1].classList.add("active-group");
  }
  if (handle.classList.contains("right-handle")) {
    if (sliderIndex + 1 >= progress.children.length) {
      progress.children[progress.children.length - 1].classList.remove(
        "active-group"
      );
      sliderIndex = 0;
      slider.style.setProperty("--slider-index", 0);
      progress.children[sliderIndex].classList.add("active-group");
      handle
        .closest(".media-scroller__content")
        .querySelector(".left-handle")
        .classList.add("inactive-handle");
    } else {
      handle
        .closest(".media-scroller__content")
        .querySelector(".left-handle")
        .classList.remove("inactive-handle");
      slider.style.setProperty("--slider-index", sliderIndex + 1);
      progress.children[sliderIndex].classList.remove("active-group");
      progress.children[sliderIndex + 1].classList.add("active-group");
    }
  }
};

// Format income number
const formatIncome = (number) =>
  Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD" }).format(
    number
  );

// Handle clic to load modal
const onMoreInfoClick = async (data) => {
  const response = await query(`titles/${data.id}`);
  const modal = document.getElementById("modal");
  const card = modal.querySelector(".card");
  document.body.classList.toggle("noscroll");
  modal.classList.toggle("show-modal");
  card.style.backgroundImage = `url("${response.image_url}")`;
  card.querySelector(".card__content").insertAdjacentHTML(
    "afterbegin",
    `
  <h2>${response.title}</h2>
  <div class="btns">
    <button class="btn">&#9654; Play</button>
  </div>
  <div class="columns">
    <div class="column span-2">
      <p><span>Sorti le: ${response.date_published}</span> - Durée: ${
      response.duration
    }min</p>
      <p>Classement: ${response.rated}</p>
      <p>Score IMDB: ${response.imdb_score}</p>
      <h3>Description:</h3>
      <p>${response.long_description}</p>
    </div>
    <div class="column">
      <h3>Réalisateurs.rices:</h3>
      <p>${response.directors.toString()}</p>
      <h3>Acteurs.rices:</h3>
      <p>${response.actors.toString()}</p>
      <h4>Genre(s):</h4>
      <p>${response.genres.toString()}</p>
      <h4>Origine:</h4>
      <p>${response.countries.toString()}</p>
      <h4>Revenus mondiaux:</h4>
      <p>${
        response.worldwide_gross_income
          ? formatIncome(response.worldwide_gross_income)
          : "Inconnu"
      }</p>
    </div>
  </div>
  `
  );
};

// Create Hero Section and best movies Slider
const featuredFilm = document.getElementById("hero");
const featuredFilmContent = document.querySelector(".hero__content");
const heroLink = document.getElementById("heroLink");
getBestMovies().then(async (response) => {
  try {
    const movie = await getMovie(response[0].id);
    featuredFilm.style.backgroundImage = `url("${movie.image_url}")`;
    const heroContent = `<h2>${movie.title}</h2><p>${movie.description}</p>`;
    featuredFilmContent.insertAdjacentHTML("afterbegin", heroContent);
    heroLink.insertAdjacentHTML(
      "afterbegin",
      `<a href="${apiUrl}/titles/${movie.id}" class="movie-link" data-id="${movie.id}">&#128712; More info</a>`
    );
    response.shift();
    const mediaScroller = createMediaScroller(
      "Films les mieux notés",
      0,
      response
    );
    mainContent.insertAdjacentHTML("afterbegin", mediaScroller);

    // Listen for clicks on handles
    const sliderHandles = document.querySelectorAll(".handle");
    sliderHandles.forEach(function (element) {
      element.addEventListener("click", function (event) {
        onHandleClick(event.target);
      });
    });

    // Listen for click on More Info or movies
    const moreInfo = document.querySelectorAll(".movie-link");
    moreInfo.forEach(function (element) {
      element.addEventListener("click", function (event) {
        event.preventDefault();
        onMoreInfoClick(event.target.dataset);
      });
    });

    // Listen for screen resize to re calculate scroller progress
    window.addEventListener("resize", function () {
      const scrollersProgress = document.querySelectorAll(
        ".media-scroller__progress"
      );
      scrollersProgress.forEach((p) => {
        calculateScrollerProgress(p);
      });
    });
  } catch (error) {
    featuredFilmContent.innerHTML = "";
    alert("No response from API");
  }
});

// Create other Sliders
const featuredCategories = ["Sci-Fi", "Biography", "Comedy"];
const mainContent = document.querySelector(".main__content");

featuredCategories.forEach(async (c, index) => {
  try {
    const bestCategoryMovies = await getBestCategoryMovies(c);
    const mediaScroller = createMediaScroller(c, index + 1, bestCategoryMovies);

    mainContent.insertAdjacentHTML("beforeend", mediaScroller);
  } catch (error) {
    console.log(error);
  }
});

// Listen for close modal events
const closeModal = document.getElementById("close-modal");
closeModal.addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.querySelector(".card__content").innerHTML = "";
  modal.classList.remove("show-modal");
  document.body.classList.remove("noscroll");
});
