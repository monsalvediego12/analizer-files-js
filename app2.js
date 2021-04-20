
var archivo1;
var archivoLineas;


function lineas(archivo) {
    var reader = new FileReader();
    // Cuando éste evento se dispara, los datos están ya disponibles.
    reader.onload = function (archivo) {
        // almacenar el texto en variable
        let todoTexto = this.result;
        var lineas = todoTexto.split('\n')
        archivoLineas = lineas;
        // console.log(archivoData)
        // Se trata de copiarlos a una área <div> en la página.
        // analizFile();
        // var output = document.getElementById("fileOutput");
        // output.textContent = fileR.target.result;
    };
    reader.readAsText(archivo);
    return 1;

}

function OnFileSelected() {
    // Get file list from input
    var files = document.getElementById('input-file').files;
    if (files.length !== 1) return;
    var navigator = new LineNavigator(files[0]);
    // === Reading all lines ===
    var indexToStartWith = 0;

    archivo1 = files[0];

    lineas(files[0]);
    console.log(archivoLineas)
    var lineasVacias = 0;
    var reservadasNuevo = [];
    for (var key in palabrasReservadas1) {
        reservadasNuevo.push(key)
    }


    navigator.readSomeLines(indexToStartWith, function linesReadHandler(err, index, lines, isEof, progress) {
        // Error happened
        if (err) throw err;
        archivo1 = lines;
        // Reading lines VACIAS
        for (var i = 0; i < lines.length; i++) {
            var lineIndex = index + i;
            var line = lines[i];
            if (line == '' || line == null) {
                lineasVacias++
            }
            // Do something with line
        }
        console.log("Lineas vacias ", lineasVacias)
        // progress is a position of the last read line as % from whole file length
        // End of file
        if (isEof) return;
        // Reading next chunk, adding number of lines read to first line in current chunk
        navigator.readSomeLines(index + lines.length, linesReadHandler);
    });



    // === Reading exact amount of lines ===
    var numberOfLines = 10;
    navigator.readLines(indexToStartWith, numberOfLines, function (err, index, lines, isEof, progress) {
        // Error happened
        if (err) throw err;
        // progress is a position of the last read line as % from whole file length
        // Reading lines
        for (var i = 0; i < lines.length; i++) {
            var lineIndex = index + i;
            var line = lines[i];
            // Do something with line
        }
    });
    // === Find first match ===
    var regex = /^.{10}/;
    navigator.find(regex, indexToStartWith, function (err, index, match) {
        // Error happened
        if (err) throw err;
        // match.line     full text of line
        // match.offset   position of match itself in this line
        // match.length   length of match itself in this line
    });
    // === Find all ===
    regex = /^.{10}/;
    var limit = 100;
    navigator.findAll(regex, indexToStartWith, limit, function (err, index, limitHit, results) {
        // Error happened
        if (err) return;
        // If limitHit is true that means that most probably not all matching lines already found
        // Continue search from last line's index +1 to find all
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            // result.index    index of line
            // result.line     full text of line
            // result.offset   position of match in this line
            // result.length   length of match in this line
            // highlight match: 
            //    result.line.slice(0, result.offset) + "<mark>" + 
            //    result.line.slice(result.offset, result.offset + result.length) + 
            //    "</mark>" + result.line.slice(result.offset + result.length)
        }
    });
}


const input1 = document.querySelector('#input-file')
input1.addEventListener('change', e => {
    console.log("Hola")
    OnFileSelected();
})




