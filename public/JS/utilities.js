function showAlert(message, type = 'danger') {
  const alertDiv = document.querySelector('#content-wrap');
  const alert = document.createElement('div');
  alert.classList.add('container', 'shadow', 'rounded', 'alert', `alert-${type}`);
  alert.setAttribute('role', 'alert');
  alert.textContent = message;
  alertDiv.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
}
