async function loadGames() {
    const res = await fetch('router.php?action=getGames');
    if (res.ok) console.log("fetch ok"); 
    const result = await res.json();
    if (result.success) {
        console.log("success");
        localStorage.setItem("games", JSON.stringify(result["data"])); // Store as a JSON string
        renderGames(result["data"]);
    } else {
        console.log("failure");

        showAlert(result.message, "danger");
    }
}
//--------------------------------------------------------------------------------------------------------------------
function renderGames(games) {
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
}