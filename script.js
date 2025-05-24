$(document).ready(function() {
// Function to fetch reviews from the server
async function fetchReviewsFromServer(gameId) {
    const response = await fetch(`router.php?action=getReviews&id_game=${gameId}`);
    return response.json();
}

// Function to get reviews, using localStorage cache if available and not expired
async function getReviews(gameId) {
    const cacheKey = `reviews_${gameId}`;
    const cachedData = localStorage.getItem(cacheKey);


    //DA SOSTITUIRE
    if (cachedData) {
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
async function updateReviews(gameId) {
    const reviews = await getReviews(gameId);
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
    fetch('router.php?action=getGames')
        .then(response => response.json())
        .then(games => {
            const carouselInner = $('#carouselInner');
            games.forEach((game, index) => {
                const activeClass = index === 0 ? 'active' : '';
                carouselInner.append(`
                    <div class="carousel-item ${activeClass}" data-game-id="${game.id}">
                        <img src="images/${game.immagine}" class="d-block w-100" alt="${game.titolo}">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>${game.titolo}</h5>
                            <p>Genre: ${game.genere}, Platform: ${game.piattaforma}</p>
                        </div>
                    </div>
                `);
            });
        })
        .catch(error => console.error('Error fetching games:', error));

    // Handle carousel slide event
    $('#gameCarousel').on('slid.bs.carousel', function () {
        // Get the current game ID from the data attribute
        var currentGameId = $('.carousel-item.active').data('game-id');
        // Fetch and update reviews based on the current game ID
        updateReviews(currentGameId);

    });
});
