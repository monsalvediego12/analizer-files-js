let area = document.getElementById('area');

area.addEventListener('dragover', e => e.preventDefault());
area.addEventListener('drop', readFile);

function readFile (e) {
  e.preventDefault();
  let file = e.dataTransfer.files[0];

  if (file.type === 'text/plain') {
    let reader = new FileReader();
    reader.onloadend = () => printFileContents(reader.result);
    reader.readAsText(file, 'ISO-8859-1');
  } else {
    alert('¡He dicho archivo de texto!');
  }
}

function printFileContents (contents) {
  area.style.lineHeight = '30px';
  area.textContent = '';
  let lines = contents.split(/\n/);

  lines.forEach(line => area.textContent += line + '\n');
}

//Comentario
//Comentario
//Comentario
//Comentario
//Comentario