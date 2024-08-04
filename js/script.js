//shows the part after "/" in the URL, e.g: if it is /index.html, currentPage = /index.html
const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResult: 0
  }
};

//console.log(global.currentPage);

//Init App 
const init = () => {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      displayTVShows();
      break;
    case '/movie-details.html':
      showMovieDetails();
      break;
    case '/tv-details.html':
      showTvShows();
      break;
    case '/search.html':
      search();
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);

/**********************************************************/

//Header(navbar) movies, tv-shows parts are yellow when clicked
const highlightActiveLink = () => {
  const headerItems = document.querySelectorAll(".nav-link");
  
  headerItems.forEach((item) => {
    if(item.getAttribute('href') === global.currentPage){
      item.classList.add('active');
    }
  })
}

/**********************************************************/

const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show");
}

const hideSpinner = () => {
  document.querySelector(".spinner").classList.remove("show");
}

//Fetch data from the API
const fetchAPIdata = async(endpoint) => {
  const API_KEY = "7f019a4f68f88c8ccf64086cbf28ff1c";
  const API_URL = "https://api.themoviedb.org/3/";

  //Show spinner while waiting for the data
  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`) //e.g: https://api.themoviedb.org/3/movie/{movie_id}
                                                                                          //or : https://api.themoviedb.org/3/search/movie

  const data = await response.json();

  //Remove spinner after getting the data
  hideSpinner();
  return data;
}

//Display movies by getting the data(movies from the API)
const displayPopularMovies = async() => {

  const data = await fetchAPIdata("movie/popular"); //i.e: https://api.themoviedb.org/3/movie/popular
  //console.log(data);
  const results = data.results;
  //console.log(results);

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = 
    `
      <a href="movie-details.html?id=${movie.id}">
        ${ //Remainder: ${} ==> means "I will write javascript inside the string now" 
          movie.poster_path ? 
          `<img
          src="https://images.tmdb.org/t/p/w500${movie.poster_path}"
          class="card-img-top"
          alt=${movie.title}
          />`

          : 
          `
            <img
            src="images/no-image.jpg"
            class="card-img-top"
            alt=${movie.title}
          />
          `
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>
    `

    document.getElementById("popular-movies").appendChild(div);
  })
} 

const displaySlider = async() => {
  //Display slider part
  const nowPlayingData = await fetchAPIdata("movie/now_playing"); 
  const myResults = nowPlayingData.results;
  console.log(myResults)

  myResults.forEach((movie) => {
    const myDiv = document.createElement("div");
    myDiv.classList.add("swiper-slide");
    myDiv.innerHTML = 
    `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://images.tmdb.org/t/p/w500${movie.poster_path}" alt=${movie.title}/>
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)}
      </h4>
    `

    document.querySelector(".swiper-wrapper").appendChild(myDiv);

    initSwiper();
  })
}

const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1, 
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },

      700: {
        slidesPerView: 3,
      },

      1200: {
        slidesPerView: 4,
      },
    }
  });
}

//Display tvshows by getting the data(movies from the API)
const displayTVShows = async() => {
  const data = await fetchAPIdata("tv/popular");
  const tvShows = data.results;
  console.log(tvShows);

  tvShows.forEach((tvShow) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = 
    `
      <a href="tv-details.html?id=${tvShow.id}">
        <img
          src="https://images.tmdb.org/t/p/w500${tvShow.poster_path}"
          class="card-img-top"
          alt=${tvShow.name}
        />
      </a>
      <div class="card-body">
        <h5 class="card-title">${tvShow.name}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date: ${tvShow.first_air_date}</small>
        </p>
      </div>
    `

    document.getElementById("popular-shows").appendChild(div);
  })

}

//Display background according to movie or tv show
const showBackground = (type, backgroundPath) => {
  //console.log(type, backgroundPath);
  
  const div = document.createElement("div");
  div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  div.style.backgroundSize = 'cover';
  div.style.backgroundPosition = 'center';
  div.style.backgroundRepeat = 'no-repeat';
  div.style.height = '100vh';
  div.style.width = '100vw';
  div.style.position = 'absolute';
  div.style.top = '0';
  div.style.left = '0';
  div.style.zIndex = '-1';
  div.style.opacity = '0.14';

  if (type === "movie") {
    document.getElementById("movie-details").appendChild(div);
  }else {
    document.getElementById("show-details").appendChild(div);
  }
} 

//Movie details page
const showMovieDetails = async() => {
  //Get the id from the url to be able to get the data of the movie accordingly
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const id = params.get('id');
  //console.log(id); 

  const data = await fetchAPIdata(`movie/${id}`) //https://api.themoviedb.org/3/find/{external_id} https://api.themoviedb.org/3/movie/{movie_id}
  //console.log(data)

  //console.log(data.backdrop_path)

  //Background image
  showBackground("movie", data.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = 
  `
    <div class="details-top">
      <div>
        <img
          src="https://images.tmdb.org/t/p/w500${data.poster_path}"
          class="card-img-top"
          alt=${data.title}
        />
      </div>
      <div>
        <h2>${data.title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${data.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${data.release_date}</p>
        <p>
          ${data.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${data.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href=${data.homepage} target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${data.budget.toLocaleString()}</li>
        <li><span class="text-secondary">Revenue:</span> $${data.revenue.toLocaleString()}</li>
        <li><span class="text-secondary">Runtime:</span> ${data.runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${data.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${data.production_companies.map((company) => `<span>${company.name}</span>`).join(", ")}
      </div>
    </div>
  `

  document.getElementById("movie-details").appendChild(div);
}

//Tv Shows Details Page
const showTvShows = async() => {
  //Get the id from the url to be able to get the data of the movie accordingly
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const id = params.get('id');
  //console.log(id); 

  const data = await fetchAPIdata(`tv/${id}`) //https://api.themoviedb.org/3/find/{external_id} https://api.themoviedb.org/3/movie/{movie_id}
  console.log(data)

  //console.log(data.backdrop_path)

  showBackground("tv", data.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = 
  `
    <div class="details-top">
      <div>
        <img
          src="https://images.tmdb.org/t/p/w500${data.poster_path}"
          class="card-img-top"
          alt=${data.title}
        />
      </div>
      <div>
        <h2>${data.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${data.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Last Air Date: ${data.last_air_date}</p>
        <p>
          ${data.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
           ${data.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href=${data.homepage} target="_blank" class="btn">Visit Show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number Of Episodes:</span> ${data.number_of_episodes}</li>
        <li>
          <span class="text-secondary">Last Episode To Air:</span> ${data.last_episode_to_air.name}
        </li>
        <li><span class="text-secondary">Status:</span> ${data.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
         ${data.production_companies.map((company) => `<span>${company.name}</span>`).join(", ")}
      </div>
    </div>
  `

  document.getElementById("show-details").appendChild(div);
}

const search = async () => {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  //Get the parameters from the URL
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  //console.log(type, searchTerm);
  const apiKey = '7f019a4f68f88c8ccf64086cbf28ff1c';

  if(global.search.term === ""){
    const alert = document.getElementById("alert");
    alert.classList.add("alert");
    alert.classList.add("alert-error");
    alert.innerHTML = "Please enter a search term";
    //console.log(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000)
    
    return;
  }

  if (global.search.term !== "" && global.search.type === "movie") {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${global.search.term}`);
    const {results, total_pages, page, total_results} = await response.json();

    global.search.page = page; //page = 1 
    global.search.totalPages = total_pages;
    global.search.totalResult = total_results;
    
    console.log(results);

    if(results.length === 0){
      const alert = document.getElementById("alert");
      alert.classList.add("alert");
      alert.classList.add("alert-error");
      alert.innerHTML = "No results found";
      return;
    }

    results.forEach((result) => {
      const div = document.createElement("div");
      div.classList.add("card");
      
      div.innerHTML = 
      `
        <a href="/movie-details.html?id=${result.id}"> 
          ${
            result.poster_path
              ? `<img
            src="https://image.tmdb.org/t/p/w500${result.poster_path}"
            class="card-img-top"
            alt="${result.title}"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${result.title}"
            />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${result.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release Date: ${result.release_date}</small>
          </p>
        </div>
      `
      
      document.querySelector("#search-results-heading").innerHTML = `<h2>${results.length} of ${global.search.totalResult} results for ${global.search.term}</h2>`;
      document.getElementById("search-results").appendChild(div);
    })

    displayPagination();

  } else if (global.search.term !== "" && global.search.type === "tv") {
    const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&query=${global.search.term}`);
    const {results, total_pages, page, total_results} = await response.json();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResult = total_results;
    
    console.log(results);

    if(results.length === 0){
      const alert = document.getElementById("alert");
      alert.classList.add("alert");
      alert.classList.add("alert-error");
      alert.innerHTML = "No results found";
      return;
    }

    results.forEach((result) => {
      const div = document.createElement("div");
      div.classList.add("card");
      
      div.innerHTML = 
      `
        <a href="/tv-details.html?id=${result.id}"> 
          ${
            result.poster_path
              ? `<img
            src="https://image.tmdb.org/t/p/w500${result.poster_path}"
            class="card-img-top"
            alt="${result.title}"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${result.title}"
            />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${result.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release Date: ${result.first_air_date}</small>
          </p>
        </div>
      `
      
      document.querySelector("#search-results-heading").innerHTML = `<h2>${results.length} of ${global.search.totalResult} results for ${global.search.term}</h2>`;
      document.getElementById("search-results").appendChild(div);
    })

    displayPagination();
  }
};

//Create and display pagination for search 
const displayPagination = () => {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = 
  `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `

  document.getElementById("pagination").appendChild(div);

  //Disable prev button if on first page
  if(global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

   //Disable next button if on last page
   if(global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  //Next page
  document.querySelector("#next").addEventListener("click", async() => {
    global.search.page++;
    showSpinner();
    loadPageData();
    hideSpinner();
  });

  //Previous page
  document.querySelector("#prev").addEventListener("click", async() => {
    global.search.page--;
    showSpinner();
    loadPageData();
    hideSpinner()
  });
}

// Load data for the current page
const loadPageData = async () => {
  const apiKey = '7f019a4f68f88c8ccf64086cbf28ff1c';
  const endpoint = global.search.type === 'movie' ? 'search/movie' : 'search/tv';
  const response = await fetch(`https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
  const data = await response.json();
  const results = data.results;

  // Clear current results
  document.getElementById("search-results").innerHTML = "";

  // Display new results
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = 
    `
      <a href="/${global.search.type === 'movie' ? 'movie-details' : 'tv-details'}.html?id=${result.id}"> 
        ${
          result.poster_path
            ? `<img
          src="https://image.tmdb.org/t/p/w500${result.poster_path}"
          class="card-img-top"
          alt="${result.title || result.name}"
          />`
              : `<img
          src="../images/no-image.jpg"
          class="card-img-top"
          alt="${result.title || result.name}"
          />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${result.title || result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release Date: ${result.release_date || result.first_air_date}</small>
        </p>
      </div>
    `

    document.getElementById("search-results").appendChild(div);
  });

  // Update pagination display
  document.querySelector(".page-counter").innerHTML = `Page ${global.search.page} of ${global.search.totalPages}`;

  // Enable/disable pagination buttons based on page number
  document.querySelector("#prev").disabled = global.search.page === 1;
  document.querySelector("#next").disabled = global.search.page === global.search.totalPages;
}







