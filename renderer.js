const { dialog } = require('electron').remote;
const fs = require('fs');
const monaco = require('monaco-editor');

// Initialize Monaco editor
let currentEditor = null;
let currentFile = 'file1';
let editorContent = '';

// Create Monaco editor
function createEditor() {
  currentEditor = monaco.editor.create(document.getElementById('editor'), {
    value: '',
    language: 'javascript',
    theme: 'monokai', // Default theme
  });

  currentEditor.onDidChangeModelContent((event) => {
    // Update content when editor changes
    editorContent = currentEditor.getValue();
  });
}

// Switch between tabs
function switchTab(file) {
  // Deactivate all tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Activate the selected tab
  document.querySelector(`[data-file="${file}"]`).classList.add('active');
  currentFile = file;

  // Update the editor content (initialize with some text for demonstration)
  currentEditor.setValue(`// Content of ${file}`);
}

// Add new tab functionality
document.getElementById('newTab').addEventListener('click', () => {
  const newFile = `file${document.querySelectorAll('.tab').length + 1}`;
  const newTab = document.createElement('div');
  newTab.classList.add('tab');
  newTab.textContent = `File ${document.querySelectorAll('.tab').length + 1}`;
  newTab.setAttribute('data-file', newFile);
  newTab.addEventListener('click', () => switchTab(newFile));

  document.getElementById('tabs').appendChild(newTab);
  switchTab(newFile);
});

// Theme switcher functionality
document.getElementById('themeSwitcher').addEventListener('click', () => {
  const currentTheme = monaco.editor.getModelMarkers({}).length ? 'vs-dark' : 'monokai';
  monaco.editor.setTheme(currentTheme === 'monokai' ? 'vs-dark' : 'monokai');
});

// Import File (Open file)
document.getElementById('importFile').addEventListener('click', () => {
  dialog.showOpenDialog({
    properties: ['openFile'],
  }).then(result => {
    if (!result.canceled) {
      const filePath = result.filePaths[0];
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      currentEditor.setValue(fileContent);  // Update editor with file content
    }
  });
});

// Export File (Save file)
document.getElementById('exportFile').addEventListener('click', () => {
  dialog.showSaveDialog({
    defaultPath: 'untitled.txt',
  }).then(result => {
    if (!result.canceled) {
      const fileContent = currentEditor.getValue();
      fs.writeFileSync(result.filePath, fileContent); // Save content to selected file
    }
  });
});

// Initialize the editor and switch to the first tab
createEditor();
switchTab(currentFile);
