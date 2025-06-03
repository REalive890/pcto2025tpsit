//tipica funzione di inizializzazione
$(document).ready(function () {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const ruolo = localStorage.getItem("ruolo");
  if (isLoggedIn && ruolo == "admin") loadView("admin");
  else loadView(isLoggedIn ? "games_edit_reviews" : "games_reviews")
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
  if (view === 'admin') bindAdminControls();
}
function bindAdminControls() {
  //lets continue for the second tab
  //structure of a review: id, id_utente,id_gioco,commento,voto,data_recensione
  const tab_admin_games = document.getElementById("list-video-games-list");
  console.log(tab_admin_games)
  tab_admin_games.addEventListener("click", load_games);
  //first lets add this event to the button copy_paste
  const tab_admin_reviews = document.getElementById("list-reviews-list");
  console.log(tab_admin_reviews)
  tab_admin_reviews.addEventListener("click", load_reviews);
  load_games();
  async function load_reviews() {
    //change the section
    const reviewsSection = document.querySelector('#reviews-section');
    const res2 = await fetch(`views/admin_reviews.html`);
    const html = await res2.text();
    reviewsSection.innerHTML = html;
    const res = await fetch('router.php?action=getAllReviews');
    //assumendo i dati siano arrivati senza problemi
    //creazione dinamica delle review
    console.log(res)
    const reviews = await res.json();
    reviews.data.forEach(review => {
      const review_item = createReviewItem(review);
      reviewsSection.querySelector('.list-group').appendChild(review_item);
      // bind_admin_review_btn()
    })
    reviewsSection.querySelectorAll(".delete-review-btn").forEach(
      review_item => review_item.addEventListener('click', async function () {
        console.log(this)
        const reviewId = this.dataset.idreview;
        const userId = this.dataset.idutente;
        console.log(reviewId, userId)
        const res = await fetch('router.php?action=deleteReviewAdmin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_review: reviewId, id_utente: userId })
        });
        console.log(await res.json())
      })
    )
    reviewsSection.querySelectorAll(".modify-review-btn").forEach(
      review_item => review_item.addEventListener('click', async function () {
        console.log(this)
        const reviewId = this.dataset.idreview;
        const userId = this.dataset.idutente;

        const commento = this.parentElement.querySelector('li.list-group-item:nth-child(1) > textarea:nth-child(4)').value;
        const voto = this.parentElement.querySelector('li.list-group-item:nth-child(1) > textarea:nth-child(5)').value;
        console.log(reviewId, commento, voto, userId)
        const res = await fetch('router.php?action=editReviewAdmin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_review: reviewId, comment: commento, rating: voto, user_id: userId })
        });
        console.log(await res.json())
      }
      )
    )
  }
  //aknowledged

      async function load_games() {
    const gamesSection = document.querySelector('#games-section');
    const res2 = await fetch(`views/admin_games.html`);
    const html = await res2.text();
    gamesSection.innerHTML = html;
    const res = await fetch('router.php?action=getGames');
    const games = await res.json();
    games.data.forEach(game => {
      gamesSection.querySelector('.card-deck').innerHTML += createGameCard(game);

      const btn_admin_update_game = document.querySelector(".card-deck .card:last-of-type button:first-of-type");
      const btn_admin_delete_game = document.querySelector(".card-deck .card:last-of-type button:last-of-type");

      btn_admin_update_game.addEventListener('click', async function () {
        const card = btn_admin_update_game.closest('.card');
        const idGame = card.getAttribute('data-idGame');
        const titolo = card.querySelector('textarea[placeholder="Titolo"]').value;
        const immagine = card.querySelector('input[placeholder="Immagine"]').value;
        const genere = card.querySelector('textarea[placeholder="Genere"]').value;
        const piattaforma = card.querySelector('textarea[placeholder="Piattaforma"]').value;
        const data_inserimento = card.querySelector('input[type="date"]').value;

        const res = await fetch('router.php?action=admin_update_game', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idGame: idGame,
            immagine: immagine,
            titolo: titolo,
            genere: genere,
            piattaforma: piattaforma,
            data_inserimento: data_inserimento
          })
        })
        const result = await res.json();
        console.log(result)

      });
      console.log(btn_admin_update_game);
      console.log(btn_admin_delete_game);
    })


  }
  function createReviewItem(review) {
    let date = "";
    if (review.data_recensione) {
      const d = new Date(review.data_recensione);
      date = d.toISOString().split('T')[0];
    }

    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.setAttribute('data-idReview', review.id);

    li.innerHTML = `
        <div class="mb-2"><strong>ID Review:</strong> ${review.id}</div>
        <div class="mb-2"><strong>ID Utente:</strong> ${review.id_utente}</div>
        <div class="mb-2"><strong>ID Gioco:</strong> ${review.id_gioco}</div>
    `;

    const textareaCommento = document.createElement('textarea');
    textareaCommento.className = 'form-control mb-2';
    textareaCommento.placeholder = 'Commento';
    textareaCommento.value = review.commento;

    const textareaVoto = document.createElement('textarea');
    textareaVoto.className = 'form-control mb-2';
    textareaVoto.placeholder = 'Voto';
    textareaVoto.value = review.voto;

    const inputDate = document.createElement('input');
    inputDate.type = 'date';
    inputDate.className = 'form-control mb-2';
    inputDate.placeholder = 'Data Recensione';
    inputDate.value = date;

    const btnModify = document.createElement('button');
    btnModify.className = 'btn btn-primary modify-review-btn';
    btnModify.setAttribute('data-idUtente', review.id_utente);
    btnModify.setAttribute('data-idReview', review.id);
    btnModify.textContent = 'Modify';

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-danger delete-review-btn';
    btnDelete.setAttribute('data-idReview', review.id);
    btnDelete.setAttribute('data-idUtente', review.id_utente);
    btnDelete.textContent = 'Delete';

    li.appendChild(textareaCommento);
    li.appendChild(textareaVoto);
    li.appendChild(inputDate);
    li.appendChild(btnModify);
    li.appendChild(btnDelete);

    return li;
  }
  function createGameCard(game) {
    let date = "";
    if (game.data_inserimento) {
      const d = new Date(game.data_inserimento);
      date = d.toISOString().split('T')[0];
    }
    return `
        <div class="card" style="width: 18rem;" data-idGame="${game.id}">
            <img class="card-img-top" src="images/${game.immagine}" alt="${game.titolo}">
            <div class="card-body">
                <input type="text" class="form-control mb-2" placeholder="Immagine" value="${game.immagine}" />
                <textarea class="form-control mb-2" placeholder="Titolo">${game.titolo}</textarea>
                <textarea class="form-control mb-2" placeholder="Genere">${game.genere}</textarea>
                <textarea class="form-control mb-2" placeholder="Piattaforma">${game.piattaforma}</textarea>
                <input type="date" class="form-control mb-2" value="${date}" placeholder="Data Inserimento" />
                <button class="btn btn-primary modify-btn" data-idGame="${game.id}">Modify</button>
                <button class="btn btn-danger delete-btn" data-idGame="${game.id}">Delete</button>
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
