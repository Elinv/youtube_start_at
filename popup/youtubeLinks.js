// variable global
const baseElv = browser.storage.local;
var total = 0;
// ----------------------------------------
// función para convertir tiempo en un entero
function obtTempo(valor) {
    var largo = valor.split(':').length;
    var total = 0;
    if (largo === 3) {
        var resHora = valor.split(':')[0] * 60 * 60;
        var resMin = valor.split(':')[1] * 60;
        var resSeg = valor.split(':')[2] * 1;
        total = resHora + resMin + resSeg;
    } else if (largo === 2) {
        var resMin = valor.split(':')[0] * 60;
        var resSeg = valor.split(':')[1] * 1;
        total = resMin + resSeg;
    }
    return total;
}
// ----------------------------------------

// obtenemos valores desde storage local
// ----------------------------------------
const elvOBJETO = {};
baseElv.get(function (result) {
    for (let i in result) {
        total++;
        let tempo = obtTempo(result[i].tiempo);

        var contenido = {
            tiempo: tempo,
            titulo: result[i].titulo
        };
        elvOBJETO[i] = contenido;
    }
    modFireSavePage.msgDocHtmlLink(elvOBJETO, '');
    /*
    let titNotif = chrome.i18n.getMessage("extensionNombre");
    let totVidNotif = chrome.i18n.getMessage("totalVideos");
    //modFireSavePage.msgNotif(titNotif, '\r\n' + (total) + ' ' + totVidNotif + '...')
    */
});

// ----------------------------------------
window.onload = function () {
    try {
        document.getElementById("aboutElinv").addEventListener("click", modFireSavePage.infoAboutElinv);
        document.getElementById("preferidos").addEventListener("click", modFireSavePage.preferidosYT);
        document.getElementById("filtrarBut").addEventListener("click", function (e) {
            // valor del text search
            let txtSearch = document.getElementById('searchText').value;
            // removemos el div id= 'ytStartAtDiv'
            var node = document.getElementById("ytStartAtDiv");
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
            // mostrar el objeto con la base de datos
            modFireSavePage.msgDocHtmlLink(elvOBJETO, txtSearch);
            e.preventDefault();
        }, true);
    } catch (err) {
        console.log("Error: " & err.message);
    }
};
// ----------------------------------------
