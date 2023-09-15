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
// Функция для добавления заметки
function addNote() {
  const title = inputElement.value.trim();
  const time = timeElement.value.trim();

  if (title.length === 0) {
    return;
  }

  // Проверяем, что введено корректное время в формате HH:MM
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!time.match(timeRegex)) {
    alert('Введите время выполнения заметки в формате HH:MM (пример 10:56)');
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
  timeElement.value = '';
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
      const newContent = prompt('Введите новый контент (заметка и время через пробел):', `${notes[index].title} ${notes[index].time}`);
      if (newContent !== null) {
        // Разделяем новый контент на заметку и оставшуюся часть
        const splitIndex = newContent.lastIndexOf(' ');
        if (splitIndex > 0) {
          const newTitle = newContent.slice(0, splitIndex);
          const newTime = newContent.slice(splitIndex + 1);

          // Проверяем, что и заметка и время не являются пустыми строками
          if (newTitle.trim() !== '' || newTime.trim() !== '') {
            notes[index].title = newTitle;
            // Проверяем, что введенное время соответствует формату "00:00"
            if (/^\d{2}:\d{2}$/.test(newTime)) {
              notes[index].time = newTime;
            } else {
              alert('Введите время выполнения заметки в формате 00:00');
            }
          }
        } else {
          alert('Введите и заметку, и время');
        }
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
