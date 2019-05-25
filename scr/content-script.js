/* eslint-disable no-console */
"use strict";

browser.runtime.onMessage.addListener(solicitud => {
    let tempo = solicitud.informaTempo;
    // checkeamos la variable
    if (!tempo) {
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
    // eslint-disable-next-line no-undef
    modFireSavePage.grabarNota();
    // evitamos el mensaje por defecto al cerrar el tab
    e.returnValue = '';
};


// ----------------------------------------
// Creamos Botones Elinv en YT 1°) 'Youtube inicia a las' y 2°) 'Flotar'
// eslint-disable-next-line no-undef
document.addEventListener("DOMContentLoaded", modFireSavePage.botonElinvInYT, false);

