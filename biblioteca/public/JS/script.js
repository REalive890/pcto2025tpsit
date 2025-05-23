document.addEventListener('DOMContentLoaded', () => {
  let studenteSelezionato = null;
  const studentSelect = document.getElementById('studentSelect');
  const prestitiList = document.getElementById('prestitiList');
  const editForm = document.getElementById('editForm');
  const editFormWrapper = document.getElementById('editFormWrapper');
  const totaleOutput = document.getElementById('totaleOutput');

  async function caricaStudenti() {
    const res = await fetch('router.php?action=getStudenti');
    const studenti = await res.json();
    studentSelect.innerHTML = '<option value="">-- Scegli uno studente --</option>';
    studenti.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.idStudente;
      opt.textContent = `${s.nome} ${s.cognome} (${s.classe})`;
      studentSelect.appendChild(opt);
    });
  }

  async function caricaPrestiti(idStudente) {
    const res = await fetch(`router.php?action=getPrestiti&id=${idStudente}`);
    const prestiti = await res.json();
    prestitiList.innerHTML = '';
    prestiti.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card mb-2 p-2';
      card.innerHTML = `
        <div><strong>Titolo:</strong> ${p.titoloLibro}</div>
        <div><strong>Prestato il:</strong> ${p.dataPrestito}</div>
        <div><strong>Restituzione prevista:</strong> ${p.dataRestituzione || '-'}</div>
        <div><strong>Restituito:</strong> ${p.restituito == 1 ? 'Sì' : 'No'}</div>
        <button class="btn btn-sm btn-outline-primary mt-2">Modifica</button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        editForm.idPrestito.value = p.idPrestito;
        editForm.dataRestituzione.value = p.dataRestituzione;
        editForm.restituito.value = p.restituito;
        editFormWrapper.classList.remove('d-none');
      });
      prestitiList.appendChild(card);
    });
  }

  studentSelect.addEventListener('change', () => {
    studenteSelezionato = studentSelect.value;
    if (studenteSelezionato) {
      caricaPrestiti(studenteSelezionato);
      editFormWrapper.classList.add('d-none');
      totaleOutput.textContent = '';
    }
  });

  editForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(editForm);
    const payload = {};
    formData.forEach((v, k) => payload[k] = v);
    await fetch('router.php?action=updatePrestito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    editFormWrapper.classList.add('d-none');
    caricaPrestiti(studenteSelezionato);
  });

  document.getElementById('calcolaTotale').addEventListener('click', async () => {
    if (!studenteSelezionato) return;
    const res = await fetch(`router.php?action=nonRestituiti&id=${studenteSelezionato}`);
    const data = await res.json();
    totaleOutput.textContent = `Libri non restituiti: ${data.totale}`;
  });

  caricaStudenti();
});