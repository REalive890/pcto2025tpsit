//--------------------------------------------------------------------------------------------------------------------
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
      localStorage.setItem("username", result.username || jsonObj.username || "");
      updateLoginStatus();
      loadView("games_edit_reviews");
    } else {
      showAlert(result.message || "Login failed", "danger");
      updateLoginStatus();
    }
  });
}
//--------------------------------------------------------------------------------------------------------------------
async function bindRegister() {
  const form = document.getElementById('registerForm');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    const jsonObj = {};
    formData.forEach((value, key) => {
      jsonObj[key] = value;
    });

    const res = await fetch('router.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonObj)
    });

    const result = await res.json();

    if (result.success) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", result.username || jsonObj.username || "");
      showAlert(result.message, "success");
      updateLoginStatus();
    } else {
      showAlert(result.message, "warning");
      updateLoginStatus();
    }
  });
}
//--------------------------------------------------------------------------------------------------------------------
function bindBtnLogout() {
  const btn = document.querySelector('#logoutBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    try {
      const res = await fetch('router.php?action=logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();

      if (result.success) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");
        userId = null;
        updateLoginStatus();
        loadView("login");
      } else {
        console.error("Errore nel logout:", result.message);
      }
    } catch (error) {
      console.error("Errore di rete durante il logout:", error);
    }
  });
}
//--------------------------------------------------------------------------------------------------------------------
function bindBtnRegister(){
  const btn = document.querySelector('#registerBtn');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    loadView("register");
  });
}
//--------------------------------------------------------------------------------------------------------------------
function bindBtnLogin(){
  const btn = document.querySelector('#loginBtn');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    loadView("login");
  });
}