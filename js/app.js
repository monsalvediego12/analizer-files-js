var db = new Dexie('archivos_leidos');
db.version(1).stores({
    archivos: 'name,info'
});
mostrarDB();


let extensiones_permitidas = new Array(".js");
var palabrasReservadas = {
    let: 0,
    const: 0,
    var: 0,
    function: 0,
    class: 0,
    else: 0,
    if: 0,
    for: 0,
    return: 0,
    throw: 0,
    try: 0,
    while: 0,
    '//': 0,
}
let original_archivo;
var archivoData;
var lineasTotal;
var lineasBlanco;
var lineasLogicas;


function cargar_archivo(formulario, archivo) {
    original_archivo = archivo;
    var archivo = archivo.value;
    var mierror = "";
    if (!archivo) {
        //Si no tengo archivo, es que no se ha seleccionado un archivo en el formulario
        mierror = "No has seleccionado ningún archivo";
    } else {
        //recupero la extensión del archivo
        var extension = (archivo.substring(archivo.lastIndexOf("."))).toLowerCase();
        //compruebo si la extensión está entre las permitidas
        var permitida = false;
        for (var i = 0; i < extensiones_permitidas.length; i++) {
            if (extensiones_permitidas[i] == extension) {
                permitida = true;
                break;
            }
        }
        if (!permitida) {
            mierror = "Comprueba la extensión del archivo a subir. \nSólo se pueden subir archivos con extensiones: " + extensiones_permitidas.join();
        } else {
            //submito!
            alert("Archivo correcto.");
            var reader = new FileReader();
            // Cuando éste evento se dispara, los datos están ya disponibles.
            let fileR = original_archivo.files[0];
            reader.onload = function (fileR) {
                // almacenar el texto en variable
                let todoTexto = this.result;
                var lineas = todoTexto.split('\n')
                archivoData = lineas;
                // console.log(archivoData)
                // Se trata de copiarlos a una área <div> en la página.
                // analizFile();
                var output = document.getElementById("fileOutput");
                output.textContent = fileR.target.result;
            };
            reader.readAsText(fileR);
            return 1;
        }
    }
    //si estoy aqui es que no se ha podido submitir
    alert(mierror);
    return 0;
}



function analizFile() {
    OnFileSelected()
    var reserP = [];

    for (var key in palabrasReservadas) {
        reserP.push(key)
    }
    console.log(archivoData)

    for (var i = 0; i < archivoData.length; i++) {
        for (var o = 0; o < reserP.length; o++) {
            let pos = archivoData[i].indexOf(reserP[o])
            if (pos !== -1) {
                palabrasReservadas[reserP[o]] += 1
            }
        }
    }
    console.log(palabrasReservadas)
}



function guardarDB() {
    let archivo_nombre = original_archivo.files[0].name
    console.log(palabrasReservadas)
    var completoObj = palabrasReservadas;
    completoObj['lVacia'] = lineasBlanco
    completoObj['lTotal'] = lineasTotal
    completoObj['lLogic'] = lineasLogicas
    db.archivos.put({ name: archivo_nombre, info: completoObj }).then(function () {
        return db.archivos.get(archivo_nombre);
    }).then(function (archivo) {
        // console.log("Result: ", archivo)
        mostrarDB();
    }).catch(function (error) {

        alert("Ooops: " + error);
    });
    var output = document.getElementById("fileOutput");
    output.textContent = '';
}

function mostrarDB() {
    db.archivos.each(file => {
        addItem(file);
        // console.log(file)
    });
    db.archivos.each(archivo => {
        var output = document.getElementById("dataDB1");
        output.textContent += "Archivo : " + archivo.name + "\n Informacion: " + archivo.info;
    })
}


function addItem(item) {
    const items = document.getElementById('dataDB');
    const elemento = document.createElement('div');
    elemento.classList = "card my-2 text-center text-dark"
    var lista = document.createElement('ul');
    lista.classList = "list-group"
    lista.id = "itemsLista"

    var itemsLi = document.getElementById('itemsLista');

    elemento.innerHTML += `     
    <div class="card-body ">
    <p class="font-weight-bold d-inline">Nombre: ${item.name} </p>
    </div>
    `;

    for (var key in item.info) {
        // console.log(key)
        // console.log(item.info[key])
        const li = document.createElement('li');
        li.classList = "list-group-item d-flex justify-content-between align-items-center text-dark";
        li.innerHTML = `${key} <span class="badge badge-primary badge-pill">${item.info[key]}</span>`
        // console.log(li)
        lista.appendChild(li)
    }
    elemento.appendChild(lista);
    items.appendChild(elemento);
}



function OnFileSelected() {

    var navigator = new LineNavigator(original_archivo.files[0]);
    // === Reading all lines ===
    var indexToStartWith = 0;
    var lineasVacias = 0;
    var totalLine =0;

    navigator.readSomeLines(indexToStartWith, function linesReadHandler(err, index, lines, isEof, progress) {
        // Error happened
        if (err) throw err;
        archivo1 = lines;
        // Reading lines VACIAS
        for (var i = 0; i < lines.length; i++) {
            var lineIndex = index + i;
            var line = lines[i];
            totalLine++;
            if (line == '' || line == null) {
                lineasVacias++
            }
            // Do something with line
        }
        lineasTotal = totalLine;
        lineasBlanco = lineasVacias;
        lineasLogicas = lineasTotal - lineasVacias - palabrasReservadas['//'];
        console.log("Lineas total ", totalLine)
        console.log("Lineas vacias ", lineasBlanco)
        console.log("Lineas logicas ", lineasLogicas)
        // progress is a position of the last read line as % from whole file length
        // End of file
        if (isEof) return;
        // Reading next chunk, adding number of lines read to first line in current chunk
        navigator.readSomeLines(index + lines.length, linesReadHandler);
    });

}

