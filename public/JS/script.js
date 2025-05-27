function showAlert(message, type = 'danger') {
  const alertDiv = document.querySelector('#content-wrap');

  // Crea un nuovo elemento div
  const alert = document.createElement('div');
  alert.classList.add('container', 'shadow', 'rounded', 'alert', `alert-${type}`);
  alert.setAttribute('role', 'alert');
  alert.textContent = message;

  // Inserisce il div nel contenitore
  alertDiv.appendChild(alert);

  // Rimuove l'alert dopo 3 secondi
  setTimeout(() => {
    alert.remove();
  }, 3000);
}
//--------------------------------------------------------------------------------------------------------------------
$(document).ready(function() {
  //prima carico completamente la pagina
  const isLoggedIn = localStorage.getItem("loggedIn");
  loadView(isLoggedIn ? "games_edit_reviews" : "games_reviews")
  .then(() => {
  //poi faccio il bind degli oggetti del DOM
  bindBtnLogout();
  bindBtnRegister();
  bindBtnLogin();
  bindCarousel();
  bindFormReview();
  bindGamesReviews()
  updateLoginStatus();
  });});
  function bindGamesReviews(){
      
      const btn = document.querySelector('#home');
      if (!btn) return;
      
      btn.addEventListener('click', () => {
          loadView("games_reviews");
        });
    }
  //--------------------------------------------------------------------------------------------------------------------
  async function loadView(view) {
  const res = await fetch(`views/${view}.html`);
  const html = await res.text();
  document.querySelector('#app').innerHTML = html;

  if (view === "login") bindLogin();
  if (view === "register") bindRegister();
  if (view === "games_reviews" || view === "games_edit_reviews") {
    await loadGames();
    updateReviews(true);
  }
}
async function fetchReviewsFromServer(gameId) {
    const response = await fetch(`router.php?action=getReviews&id_game=${gameId}`);
    return response.json();
}

// Function to get reviews, using localStorage cache if available and not expired
async function getReviews(gameId,force) {
    const cacheKey = `reviews_${gameId}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData && !force) {
        const { timestamp, reviews } = JSON.parse(cachedData);
        const now = new Date().getTime();
        const cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (now - timestamp < cacheDuration) {
            return reviews;
        }
    }

    // Fetch fresh data from the server
    const reviews = await fetchReviewsFromServer(gameId);
    // Update localStorage with fresh data
    const dataToCache = {
        timestamp: new Date().getTime(),
        reviews: reviews
    };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

    return reviews;
}

// Function to update reviews in the UI
async function updateReviews(force=false) {
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

    // Fetch games from the server
   
    // Handle carousel slide event
function bindFormReview() {
    // Disable carousel sliding when the comment textarea is focused
    $('#comment').on('focus', function () {
        $('#gameCarousel').carousel('pause');
    });
    // Enable carousel sliding again when the textarea loses focus
    $('#comment').on('blur', function () {
        $('#gameCarousel').carousel('cycle');
    });

    $('#reviewForm').on('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission
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
                    $('#comment').val(''); // Clear the input box
                    $('#rating').val(''); // Clear the rating box
                    updateReviews(true); // Refresh the reviews
                } else {
                    loadView("login");
                    alert('Error adding review: ' + data.message+"you're being redirected to the login page");
                }
            });
    });
}

function bindCarousel() {
    // Initialize the carousel
    $('#gameCarousel').carousel();
    console.log("Carousel initialized");
    // Set up the event listener for when the carousel slides
    document.getElementById('gameCarousel').addEventListener('slid.bs.carousel', function () {
    // Get the current game ID from the data attribute
    // Fetch and update reviews based on the current game ID
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

// Call updateLoginStatus() after login/logout/register actions as well
