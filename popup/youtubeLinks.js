"use strict";
/* eslint-disable no-undef */
/* eslint-disable no-console */
// Autoejecutar función al inicio
const elvOBJETOYTStartUp = {};
(function () {
    // variable
    const baseElv = browser.storage.local;
    // obtenemos valores desde storage local
    // ----------------------------------------
    baseElv.get(function (result) {
        for (let i in result) {
            let tempo = modFireSavePage.obtTempo(result[i].tiempo);
            //console.log(tempo);
            var contenido = {
                tiempo: tempo,
                titulo: result[i].titulo
            };
            elvOBJETOYTStartUp[i] = contenido;
        }
        modFireSavePage.msgDocHtmlLink(elvOBJETOYTStartUp, '');
    });
})()

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
            modFireSavePage.msgDocHtmlLink(elvOBJETOYTStartUp, txtSearch);
            e.preventDefault();
        }, true);
    } catch (err) {
        console.log("Error: " & err.message);
        //alert('error');
    }
};
// ----------------------------------------
