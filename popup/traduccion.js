// Matriz bidimensional contiene id y texto del elemento
var opcTrad = [
    // Msg
    ["h1Id", "extensionNombre", "Youtube inicia a las"],
    ["h2Id", "h2IdTexto", "Keep watching..."],
    // Botones
    ["aboutElinv", "botonAboutValor", "Sobre Elinv"],
    ["aboutElinv", "botonAboutTitle", "Más información sobre Elinv"],
    ["preferidos", "botonPreferidosTexto", "YouTube Recomendados"],
    ["preferidos", "botonPreferidosTitle", "Preferidos de YouTube"],
    // Filtrar por busqueda
    ["filtrarBut","filtrarButTexto","Filtrar información"],
    ["filtrarBut","filtrarButTitle","Filtrar información"],
    ["searchText","filtrarButPlaceHolder","Filtrar información"]
];

// función para la traducción
function tradIdioma() { 
    // bucle sobre matriz bidimensional
    for (var i = 0; i < opcTrad.length; i++) {
        // obtenemos la traducción de esta palabra o frase
        var grabarVar = chrome.i18n.getMessage(opcTrad[i][1]);
        // asignamos al id la frase traduccida o la original por defecto
        if (opcTrad[i][1] == "botonAboutTitle" ||
            opcTrad[i][1] == "botonPreferidosTitle" ||
            opcTrad[i][1] == "filtrarButTitle") {
            document.getElementById(opcTrad[i][0]).title = grabarVar || opcTrad[i][2];
        }else if(opcTrad[i][1] == "filtrarButPlaceHolder") {
            document.getElementById(opcTrad[i][0]).placeholder = grabarVar || opcTrad[i][2];
        } else {
            document.getElementById(opcTrad[i][0]).textContent = grabarVar || opcTrad[i][2];
        }
    }
}

// Ejecutamos la función
tradIdioma();
