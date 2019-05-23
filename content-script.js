"use strict";

browser.runtime.onMessage.addListener(solicitud => {
    let tempo = solicitud.informaTempo;
    // checkeamos la variable
    if (!!tempo) {
        let script = document.createElement("script");
        let code = `
        function promiseElemHTML(value){
            return new Promise(function (fulfill, reject){
                value = document.getElementById("movie_player");
                setTimeout(function() {
                    fulfill({ value: value, result: value * value });
                }, 2000);
            });
        }         
        async function run() {
            for (var n = 0; n <= Number.MAX_VALUE; n++) {
                var obj = await promiseElemHTML(n);                
                // obj.value & obj.result);
                if (obj.value){
                    obj.value.seekTo(${tempo}, true);
                    break;
                }
            }
        }
        run();       
        `;
        let codeElement = document.createTextNode(code);
        script.appendChild(codeElement);
        document.querySelector("head").appendChild(script);
    }
});

// Al cerrar guardar el estado actual del mismo.
window.onbeforeunload = function (e) {
    // salvamos los datos en storage local
    grabarNota();
    // evitamos el mensaje por defecto al cerrar el tab
    e.returnValue = '';
};

// Constante y funciones para grabar en Storage local
//*Url y tiempo de ejecución
// ----------------------------------------
const baseElv = browser.storage.local;
function onError(error) {
    console.error(`Error: ${error}`);
}
// info mediante document.title
function setItemInfo() {
    let titulo = document.title;
    let tiempo = document.getElementsByClassName('ytp-time-current')[0].innerHTML;
    let grabado = chrome.i18n.getMessage("grabado");
    document.title = titulo + ' ==> (' + grabado + ': ' + tiempo + ') <==';
    setTimeout(function () { document.title = titulo }, 7000);
}

// salvar en el storage local
function grabarNota() {
    // tiempo actual de reproducción y url
    let tiempo = document.getElementsByClassName('ytp-time-current')[0].innerHTML;
    let url = window.location.href;
    // solo esta definición de url
    url = url.match(/(https?):\/\/[^\&|\s"]+/)[0];
    // control document.title por si todo ocurre muy rápido
    let titDoc = document.title;
    let n = titDoc.indexOf(" ==>");
    if (n >= 0) {
        titDoc = titDoc.substring(0, n).trim();
    }
    // si es mayor a 50 caracteres cortamos separando por palabra
    // ----------------------------------
    function cortar(str, largo = 50, signos = '...') {
        var punto = str.length > largo ? signos : '';
        var resCorte = str.length > largo ? str.substring(0, largo).replace(/\W\w+\s*(\W*)$/, '$1') : str;
        return resCorte + punto;
    };
    if (titDoc.length > 50) {
        titDoc = cortar(titDoc);
    }
    // ----------------------------------    
    let contenido = {
        tiempo: tiempo,
        titulo: titDoc
    };
    // el objeto que guardaremos.
    let elvOBJETO = {};
    elvOBJETO[url] = contenido;
    // grabamos el objeto
    baseElv.set(elvOBJETO)
        .then(setItemInfo, onError);
}
// Abrir video en ventana aparte
function winApart() {
    // abre la ventana flotante para mostrar 
    // el video YT en la instancia de tiempo correcta
    // Obtiene id forma url y crea window popup
    function parseId(url) {
        let match = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/.exec(url);
        if (match instanceof Array && match[2] !== undefined) {
            return match[2];
        } else {
            return false;
        }
    }
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
    let id = parseId(window.location.href);
    let tiempo = document.getElementsByClassName('ytp-time-current')[0].innerHTML
    tiempo = obtTempo(tiempo);
    var urlFloat = 'https://www.youtube.com/embed/' + id + '?autoplay=1&start=' + tiempo;
    // abrimos la ventana
    // var win = window.open(urlFloat, '_blank');  win.focus();
    var objeto_window_referencia;
    var configuracion_ventana = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    function abrir_Popup() {
        objeto_window_referencia = window.open(urlFloat, "Video por Elinv", configuracion_ventana);
    }
    // Llamamos a la función    
    abrir_Popup();
}

// ----------------------------------------
document.addEventListener("DOMContentLoaded", botonElinv, false);

function botonElinv() {
    // async y await
    function promiseElemHTML(value) {
        return new Promise(function (fulfill, reject) {
            // elementos contenedores -> container info info-text
            value = document.getElementById("info");
            setTimeout(function () {
                fulfill({ value: value, result: value * value });
            }, 2000);
        });
    }
    async function run() {
        for (var n = 0; n <= Number.MAX_VALUE; n++) {
            var obj = await promiseElemHTML(n);
            // obj.value & obj.result);
            if (obj.value) {
                insertButton(obj.value);
                break;
            }
        }
    }
    run();

    function insertButton(elemYT) {
        // agregamos el botón a Youtube para salvar el estado actual
        if (document.getElementById('ElinvButYT')) {
            //console.log('existe');
        } else {
            let estilo = `
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            border-left: solid 1px #C02B21;
            color: #fff;
            background: #DE463B;
            box-shadow: 0px 5px 0px 0px #C02B21;
            cursor: pointer; 
            `;
            let button = document.createElement('button');
            let texto = chrome.i18n.getMessage("extensionNombre")
            let t = document.createTextNode(' ' + texto);
            button.appendChild(t);
            button.setAttribute('id', 'ElinvButYT');
            button.setAttribute('title', texto);
            button.setAttribute('style', estilo);
            button.onclick = grabarNota;
            elemYT.appendChild(button);
            // button float
            // agregar button video flotante
            // ----------------------------------------------
            let butFloat = document.createElement("input");
            butFloat.type = "button";
            butFloat.value = chrome.i18n.getMessage("flotar");
            butFloat.setAttribute('title', chrome.i18n.getMessage("flotartitle") + '!');
            butFloat.setAttribute('style', estilo);
            butFloat.onclick = winApart;
            elemYT.appendChild(butFloat);
            // ----------------------------------------------            
        }
    }
}