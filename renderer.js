const monacoLoader = require('monaco-editor');

window.addEventListener('DOMContentLoaded', () => {
  monacoLoader.editor.create(document.getElementById('editor'), {
    value: '// Write your code here...',
    language: 'javascript',
    theme: 'vs-dark',
  });
});
