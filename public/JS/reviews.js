//--------------------------------------------------------------------------------------------------------------------
async function loadPosts() {
    const res = await fetch('router.php?action=getUsersPostsByID');
    const result = await res.json();
    addPostForm();
    renderPosts(result["data"]);
    if (result.success && result.data.length > 0) {
        localStorage.setItem("posts", result["data"]);   
        editPostForm();
        deletePostForm();
        showAlert(result.message, "success");    
    } else {
        showAlert(result.message, "warning");
    }
}




function sanitize(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
}

function escapeAttribute(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
}


//--------------------------------------------------------------------------------------------------------------------
    function addPostForm() {
        const form = document.querySelector('#addPostForm');
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
   
        newForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const jsonObj = {};
            formData.forEach((value, key) => {
                jsonObj[key] = value;
                });        
            const res = await fetch('router.php?action=addPost', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(jsonObj)
            });
            const result = await res.json();
            if (result.success){
                showAlert(result.message, "success");
            } else{
                showAlert(result.message, "danger");
            }

            const modal = bootstrap.Modal.getInstance(document.querySelector('#addModal'));
            modal.hide();
            newForm.reset();
            loadPosts();
        });
    }
//---------------------------------------------------------------------------------------------------------------------  
// Aggiunta degli event listener ai bottoni
    function editPostForm (){
        document.querySelectorAll('.edit-post-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                // Popola il form della modale
                const form = document.querySelector('#editPostForm');
                for (const key in button.dataset){
                    form.elements[key].value = button.dataset[key];
                }
                form.addEventListener('submit', async function (e){
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const jsonObj = {};
                    formData.forEach((value, key) => {
                        jsonObj[key] = value;
                        });        
                    const res = await fetch('router.php?action=editPost', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(jsonObj)
                    });
                    const result = await res.json();

                     if (result.success){
                        showAlert(result.message, "success");
                    } else{
                        showAlert(result.message, "danger");
                    }
        
                    const modal = bootstrap.Modal.getInstance(document.querySelector('#editModal'));
                    modal.hide();
                    form.reset();
                    loadPosts();
                });
                    
                // Mostra la modale
                const modal = new bootstrap.Modal(document.querySelector('#editModal'));
                modal.show();    
            });
        })
    }    
//---------------------------------------------------------------------------------------------------------------------  
   function deletePostForm() {
        document.querySelectorAll('.delete-post-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
        const postId = e.target.dataset.id;

        const conferma = confirm("Sei sicuro di voler eliminare questo post?");
        if (!conferma) return; 

    
        const res = await fetch('router.php?action=deletePost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "post_id": postId })
        });

        const result = await res.json();

        if (result.success) {
            showAlert(result.message, "success");
        } else {
            showAlert(result.message, "danger");
        }

        loadPosts(); 
        });
  });
}
//--------------------------------------------------------------------------------------------------------------------
    function renderAllPosts(posts) {
        const accordion = document.getElementById('accordionAuthors');
        accordion.innerHTML = '';

        Object.keys(posts).forEach((key, index) => {
            const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, ''); // Pulizia chiave

            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item shadow rounded';

            accordionItem.innerHTML = `
                <h2 class="accordion-header" id="heading-${safeKey}">
                    <button class="accordion-button py-2 ${key !== 0 ? 'collapsed' : ''}" type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#collapse-${safeKey}" 
                        aria-expanded="${index === 0 ? 'true' : 'false'}" 
                        aria-controls="collapse-${safeKey}">
                        ${posts[key].email}
                    </button>
                </h2>
                <div id="collapse-${safeKey}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                    aria-labelledby="heading-${safeKey}" data-bs-parent="#accordionAuthors">
                    <div class="accordion-body bg-light">
                        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            ${posts[key].post.map(post => `
                                <div class="col d-flex">
                                    <div class="card shadow-sm rounded-3 h-100">
                                        <img src="https://picsum.photos/seed/${encodeURIComponent(post.title)}/600/200" class="card-img-top" alt="Immagine post" loading="lazy">
                                        <div class="card-body d-flex flex-column">
                                            <h5 class="card-title fw-bold fs-5">${escapeHtml(post.title)}</h5>
                                            <p class="card-text truncate-text">${escapeHtml(post.content).replace(/\n/g, '<br>')}</p>
                                            <p class="card-text mt-auto">
                                                <small class="text-muted">Created at: ${post.created_at}</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            accordion.appendChild(accordionItem);
        });
    }

    // Funzione di escape base per evitare XSS
    function escapeHtml(text) {
        return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    // ...existing code...

// Load user's reviews when modal is opened
$(document).on('click', '#myReviewsBtn', async function() {
    const res = await fetch('router.php?action=getMyReviews');
    const result = await res.json();
    const reviews = result["data"] || [];
    const container = $('#myReviewsList');
    container.empty();

    if (reviews.length === 0) {
        container.html('<p>No reviews found.</p>');
        return;
    }

    reviews.forEach(review => {
        container.append(`
            <div class="card mb-2" data-review-id="${review.id}">
                <div class="card-body">
                    <h6>Game: ${review.game_title || review.id_gioco}</h6>
                    <textarea class="form-control mb-2 review-edit-text" disabled>${review.commento}</textarea>
                    <input type="number" class="form-control mb-2 review-edit-rating" value="${review.voto}" min="0" max="10" disabled>
                    <button class="btn btn-sm btn-warning edit-review-btn">Edit</button>
                    <button class="btn btn-sm btn-danger delete-review-btn">Delete</button>
                    <button class="btn btn-sm btn-success save-review-btn d-none">Save</button>
                    <button class="btn btn-sm btn-secondary cancel-edit-btn d-none">Cancel</button>
                </div>
            </div>
        `);
    });
});

// Edit button
$(document).on('click', '.edit-review-btn', function() {
    const card = $(this).closest('.card');
    card.find('.review-edit-text, .review-edit-rating').prop('disabled', false);
    card.find('.save-review-btn, .cancel-edit-btn').removeClass('d-none');
    card.find('.edit-review-btn, .delete-review-btn').addClass('d-none');
});

// Cancel edit
$(document).on('click', '.cancel-edit-btn', function() {
    const card = $(this).closest('.card');
    card.find('.review-edit-text, .review-edit-rating').prop('disabled', true);
    card.find('.save-review-btn, .cancel-edit-btn').addClass('d-none');
    card.find('.edit-review-btn, .delete-review-btn').removeClass('d-none');
});

// Save edit
$(document).on('click', '.save-review-btn', async function() {
    const card = $(this).closest('.card');
    const reviewId = card.data('review-id');
    const comment = card.find('.review-edit-text').val();
    const rating = card.find('.review-edit-rating').val();

    if (!confirm('Are you sure you want to save changes to this review?')) return;

    const res = await fetch('router.php?action=editReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_review: reviewId, comment, rating })
    });
    const data = await res.json();
    if (data.success) {
        card.find('.review-edit-text, .review-edit-rating').prop('disabled', true);
        card.find('.save-review-btn, .cancel-edit-btn').addClass('d-none');
        card.find('.edit-review-btn, .delete-review-btn').removeClass('d-none');
        updateReviews(true); // Refresh the reviews
        alert('Review updated!');
    } else {
        alert('Error updating review: ' + data.message);
    }
});

// Delete button
$(document).on('click', '.delete-review-btn', async function() {
    const card = $(this).closest('.card');
    const reviewId = card.data('review-id');
    if (!confirm('Are you sure you want to delete this review?')) return;

    const res = await fetch('router.php?action=deleteReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_review: reviewId })
    });
    const data = await res.json();
    if (data.success) {
        card.remove();
        updateReviews(true); // Refresh the reviews
        alert('Review deleted!');
    } else {
        alert('Error deleting review: ' + data.message);
    }
});

// Prevent carousel from sliding when modal is open
$(document).on('show.bs.modal', function () {
    $('#gameCarousel').carousel('pause');
});
$(document).on('hidden.bs.modal', function () {
    $('#gameCarousel').carousel('cycle');
});