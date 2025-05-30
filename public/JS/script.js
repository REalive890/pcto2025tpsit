//tipica funzione di inizializzazione
$(document).ready(function() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const ruolo=localStorage.getItem("ruolo");
  if(isLoggedIn&&ruolo=="admin") loadView("admin");
  else loadView(isLoggedIn?"games_edit_reviews":"games_reviews")
    //importante in .then almeno gli oggetti sono caricati
  .then(() => {
    //serie di addeventListeners
    bindCarousel();
    bindFormReview();
    bindGamesReviews();
  });
  bindBtnLogout();
  bindBtnRegister();
  bindBtnLogin();
});

function bindGamesReviews() {
  const btn = document.querySelector('#home');
  if (!btn) return;
  btn.addEventListener('click', () => {
    loadView("games_reviews");
  });
}

async function loadView(view) {
//forse importante quanto il router.php, mostra e cambia la vista
  const res = await fetch(`views/${view}.html`);
  const html = await res.text();
  document.querySelector('#app').innerHTML = html;
  //comunque non ci sarebbe bisogno di sta roba se lo script fosse
  //stato inserito in un file apposito o proprio nel file html
  //considerando che sono solo addEventListener, tanto sti metodi
  //si possono vedere comunque con lo strumento da sviluppatore
  if (view === "login") bindLogin();
  if (view === "register") bindRegister();
  //forse questa è l'unico snippet da poter lasciare
  if (view === "games_reviews" || view === "games_edit_reviews") {
    await loadGames();
    updateReviews(true);
  }
  if(view==='admin') bindAdminControls();
}
function bindAdminControls(){
  const tabs = document.querySelectorAll('#list-tab .list-group-item');
    tabs.forEach(tab => {
        tab.addEventListener('click',async function() {
            const tabId = this.id;
            if (tabId === 'list-video-games-list') {
                const gamesSection=document.querySelector('#games-section');
                const res=await fetch('router.php?action=getGames');
                const games= await res.json();
                gamesSection.innerHTML = games.data.map(game => createGameCard(game)).join('');
              } else if (tabId === 'list-reviews-list') {
                const reviewsSection=document.querySelector('#list-reviews');
            } 
        });
    });
     function createGameCard(game) {
        return `
            <div class="card" data-id="${game.id}">
                <img src="images/${game.immagine}" class="card-img-top" alt="${game.titolo}">
                <div class="card-body">
                    <h5 class="card-title">${game.titolo}</h5>
                    <p class="card-text">Genere: ${game.genere}</p>
                    <p class="card-text">Piattaforma: ${game.piattaforma}</p>
                    <p class="card-text">Data Inserimento: ${game.data_inserimento}</p>
                    <button class="btn btn-primary modify-btn" data-id="${game.id}">Modify</button>
                    <button class="btn btn-danger delete-btn" data-id="${game.id}">Delete</button>
                </div>
            </div>
        `;
    }
}

async function fetchReviewsFromServer(gameId) {
  const response = await fetch(`router.php?action=getReviews&id_game=${gameId}`);
  return response.json();
}

async function getReviews(gameId, force) {
  const cacheKey = `reviews_${gameId}`;
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData && !force) {
    const { timestamp, reviews } = JSON.parse(cachedData);
    const now = new Date().getTime();
    const cacheDuration = 5 * 60 * 1000;
    if (now - timestamp < cacheDuration) {
      return reviews;
    }
  }
  const reviews = await fetchReviewsFromServer(gameId);
  const dataToCache = {
    timestamp: new Date().getTime(),
    reviews: reviews
  };
  localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
  return reviews;
}

async function updateReviews(force = false) {
  const gameId = $('.carousel-item.active').data('game-id');
  const reviews = await getReviews(gameId, force);
  const reviewsContainer = $('#reviews');
  reviewsContainer.empty();
  reviews.forEach(review => {
    reviewsContainer.append(`
      <div class="review-card">
        <h5>Review by User ${review.id_utente}</h5>
        <p>${review.commento}</p>
        <p><strong>Rating:</strong> ${review.voto}/10</p>
        <p><small>Reviewed on: ${new Date(review.data_recensione).toLocaleDateString()}</small></p>
      </div>
    `);
  });
}

function bindFormReview() {
  $('#comment').on('focus', function () {
    $('#gameCarousel').carousel('pause');
  });
  $('#comment').on('blur', function () {
    $('#gameCarousel').carousel('cycle');
  });
  $('#reviewForm').on('submit', function (e) {
    e.preventDefault();
    const reviewText = $('#comment').val();
    const gameId = $('.carousel-item.active').data('game-id');
    const rating = $('#rating').val();
    fetch('router.php?action=addReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_game: gameId,
        review: reviewText,
        rating: rating
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        $('#comment').val('');
        $('#rating').val('');
        updateReviews(true);
      } else {
        loadView("login");
        alert('Error adding review: ' + data.message + "you're being redirected to the login page");
      }
    });
  });
}

function bindCarousel() {
  $('#gameCarousel').carousel();
  console.log("Carousel initialized");
  document.getElementById('gameCarousel').addEventListener('slid.bs.carousel', function () {
    console.log("Carousel slid event triggered, updating reviews");
    updateReviews();
  });
}

function updateLoginStatus() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const username = localStorage.getItem("username");
  const statusSpan = document.getElementById('loginStatus');
  if (!statusSpan) return;
  if (isLoggedIn === "true" && username) {
    statusSpan.textContent = `Logged in as ${username}`;
  } else if (isLoggedIn === "true") {
    statusSpan.textContent = "Logged in";
  } else {
    statusSpan.textContent = "Not logged in";
  }
}
