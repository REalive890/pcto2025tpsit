//--------------------------------------------------------------------------------------------------------------------
function add_listener_btn_logout() {
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
        localStorage.removeItem("ruolo");
        userId = null;
        updateLoginStatus();
        load_view("login");
      } else {
        console.error("Errore nel logout:", result.message);
      }
    } catch (error) {
      console.error("Errore di rete durante il logout:", error);
    }
  });
}
//--------------------------------------------------------------------------------------------------------------------
function add_listener_btn_register(){
  const btn = document.querySelector('#registerBtn');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    load_view("register");
  });
}
//--------------------------------------------------------------------------------------------------------------------
function add_listener_btn_login(){
  const btn = document.querySelector('#loginBtn');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    load_view("login");
  });
}