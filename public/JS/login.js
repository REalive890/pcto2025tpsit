async function bindLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const jsonObj = {};
    formData.forEach((value, key) => {
      jsonObj[key] = value;
    });
    const res = await fetch('router.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonObj)
    });
    const result = await res.json();
    if (result.success) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("ruolo", result.ruolo);
      localStorage.setItem("username", result.username || jsonObj.username || "");
      updateLoginStatus();
      if(result.ruolo==='admin')
        load_view("admin");
      else if(result.ruolo==='user')
        load_view("games_edit_reviews");
      else alert("Something went wrong while trying to check your role")
    } else {
      showAlert(result.message || "Login failed", "danger");
      updateLoginStatus();
    }
  });
}