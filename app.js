const inputElement = document.getElementById('title');
const createBtn = document.getElementById('create');
const listElement = document.getElementById('list');
const timeElement = document.getElementById('time'); // Получаем элемент ввода времени

// Функция для загрузки данных из localStorage при загрузке страницы
function loadNotes() {
  const savedNotes = localStorage.getItem('notes');
  return savedNotes ? JSON.parse(savedNotes) : [];
}

// Используем localStorage для сохранения и загрузки заметок
let notes = loadNotes();
let currentEditingNote = null; // Добавляем переменную для отслеживания текущей редактируемой заметки

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Функция для отображения заметок на странице
function render() {
  listElement.innerHTML = '';
  if (notes.length === 0) {
    listElement.innerHTML = '<p class="font-weight-bold">Нет активных заметок</p>';
  }
  for (let i = 0; i < notes.length; i++) {
    listElement.insertAdjacentHTML('beforeend', getNoteTemplate(notes[i], i));
  }
}

render(); // Вызываем функцию render для отображения заметок при загрузке страницы

createBtn.onclick = addNote; // Используем отдельную функцию для добавления заметки

// Функция для добавления заметки
function addNote() {
  const title = inputElement.value.trim();
  const time = timeElement.value.trim(); // Получаем значение времени из поля ввода времени
  if (title.length === 0) {
    return;
  }
  const newNote = {
    title,
    time,
    completed: false,
  };
  notes.push(newNote);
  saveNotes(); // Сохраняем заметки в localStorage
  render();
  inputElement.value = '';
  timeElement.value = ''; // Очищаем поле ввода времени после добавления заметки
}

// Добавляем обработчик события для поля ввода, чтобы добавлять заметку при нажатии Enter
inputElement.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addNote();
  }
});

listElement.onclick = function (event) {
  if (event.target.dataset.index) {
    const index = parseInt(event.target.dataset.index);
    const type = event.target.dataset.type;

    if (type === 'toggle') {
      notes[index].completed = !notes[index].completed;
    } else if (type === 'remove') {
      notes.splice(index, 1);
    } else if (type === 'editBoth') {
      const newContent = prompt('Введите новую заметку:', notes[index].title);
      const newTime = prompt('Введите новое время (например, 18:30):', notes[index].time);

      if (newContent !== null) {
        notes[index].title = newContent;
      }

      if (newTime !== null) {
        notes[index].time = newTime;
      }
    }
    saveNotes(); // Сохраняем заметки в localStorage после изменений
    render();
  }
};


function getNoteTemplate(note, i) {
  return `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span class="${note.completed ? 'text-decoration-line-through' : ''}">${note.title}</span>
      <span class="badge bg-secondary">${note.time || ''}</span>
      <span>
        <span class="btn btn-small btn-${note.completed ? 'warning' : 'success'}" data-index="${i}" data-type="toggle">&#10003;</span>
        <span class="btn btn-small btn-success" data-type="editBoth" data-index="${i}">&#9998;</span>
        <span class="btn btn-small btn-danger" data-type="remove" data-index="${i}">&#10005;</span>
      </span>
    </li>
  `;
}
