import { URLMapping } from './types';

const addForm = document.getElementById('add-form') as HTMLFormElement;
const redirectList = document.getElementById('redirect-list') as HTMLTableSectionElement;

let urlMappings: URLMapping = {};

// Load existing redirects from storage
chrome.storage.local.get(['urlMappings'], (data) => {
  urlMappings = data.urlMappings || {};
  renderRedirects();
});

// Function to render the list of redirects
function renderRedirects() {
  redirectList.innerHTML = '';
  for (const shortURL in urlMappings) {
    const longURL = urlMappings[shortURL];
    const row = redirectList.insertRow();

    const shortURLCell = row.insertCell();
    shortURLCell.textContent = shortURL;

    const longURLCell = row.insertCell();
    longURLCell.textContent = longURL;

    const actionsCell = row.insertCell();

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editRedirect(row, shortURL, longURL));
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteRedirect(shortURL));
    actionsCell.appendChild(deleteButton);
  }
}

// Handle adding a new redirect
addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const shortURLInput = document.getElementById('short-url') as HTMLInputElement;
  const longURLInput = document.getElementById('long-url') as HTMLInputElement;
  const shortURL = shortURLInput.value;
  const longURL = longURLInput.value;

  if (shortURL && longURL) {
    urlMappings[shortURL] = longURL;
    saveRedirects();
    shortURLInput.value = '';
    longURLInput.value = '';
    renderRedirects();
  }
});

// Function to handle editing a redirect
function editRedirect(row: HTMLTableRowElement, shortURL: string, longURL: string) {
  row.innerHTML = ''; // Clear the existing row

  const editForm = document.createElement('tr');
  editForm.classList.add('edit-form');

  const shortURLCell = document.createElement('td');
  const shortURLInput = document.createElement('input');
  shortURLInput.type = 'url';
  shortURLInput.value = shortURL;
  shortURLCell.appendChild(shortURLInput);
  editForm.appendChild(shortURLCell);

  const longURLCell = document.createElement('td');
  const longURLInput = document.createElement('input');
  longURLInput.type = 'url';
  longURLInput.value = longURL;
  longURLCell.appendChild(longURLInput);
  editForm.appendChild(longURLCell);

  const actionsCell = document.createElement('td');
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.addEventListener('click', () => {
    const newShortURL = shortURLInput.value;
    const newLongURL = longURLInput.value;
    if (newShortURL && newLongURL) {
      delete urlMappings[shortURL]; // Remove the old mapping
      urlMappings[newShortURL] = newLongURL;
      saveRedirects();
      renderRedirects();
    }
  });
  actionsCell.appendChild(saveButton);

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => renderRedirects());
  actionsCell.appendChild(cancelButton);

  editForm.appendChild(actionsCell);
  row.parentNode?.insertBefore(editForm, row);
  row.remove(); // Remove the original row
}

// Function to handle deleting a redirect
function deleteRedirect(shortURLToDelete: string) {
  if (confirm(`Are you sure you want to delete the redirect for ${shortURLToDelete}?`)) {
    delete urlMappings[shortURLToDelete];
    saveRedirects();
    renderRedirects();
  }
}

// Function to save redirects to storage
function saveRedirects() {
  chrome.storage.local.set({ urlMappings: urlMappings });
}
