document.querySelector("#component-register").addEventListener("load", async function() {
    await bindRegister();
    console.log("Register component loaded");
});
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
      localStorage.setItem("ruolo", result.ruolo);
      localStorage.setItem("username", result.username || jsonObj.username || "");
      showAlert(result.message, "success");
      updateLoginStatus();
    } else {
      showAlert(result.message, "warning");
      updateLoginStatus();
    }
  });
}