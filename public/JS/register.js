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
      load_view("login");
      showAlert(result.message, "success");
      updateLoginStatus();
    } else {
      showAlert(result.message, "warning");
      updateLoginStatus();
    }
  });
}