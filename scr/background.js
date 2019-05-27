/* eslint-disable no-console */
"use strict";
// --------------------------------------------------
let filtroWeb = {
    url:
        [
            { hostContains: "youtube.com" },
            { hostPrefix: "youtube" }
        ]
}

function logOnCompleted(details) {
    //objet=>details -> frameId: 0 parentFrameId: -1 tabId: 27 timeStamp: 1558730014505
    //url: "https://www.youtube.com/watch?v=yvGlM33ZOoQ" windowId: 119
    // funcion para recuperar el tempo de reproducción por la url.
    const baseElv = browser.storage.local;
    baseElv.get(function (result) {
        for (let i in result) {
            // Si i es igual a la url completa y el resultado no es nulo o indefinido
            if (i === details.url && result[i] !== "undefined" && result[i] !== "") {
                // obtenemos el tiempo desde donde reproducir
                // eslint-disable-next-line no-undef
                let tempo = modFireSavePage.obtTempo(result[i].tiempo);
                setTimeout(function () {
                    browser.tabs.sendMessage(
                        details.tabId,
                        { informaTempo: tempo }
                        // eslint-disable-next-line no-unused-vars
                    ).then(respuesta => {
                        //respuesta.respEstado
                    }).catch(onError);
                }, 1000);
            }
        }
    });
    function onError(error) {
        console.error(`Error: ${error}`);
    }
}

browser.webNavigation.onCompleted.addListener(logOnCompleted, filtroWeb);

// Deshabilita togle click en browserAction
browser.browserAction.onClicked.addListener((tab) => {
    // disable the active tab
    browser.browserAction.disable(tab.id);
    // requires the "tabs" or "activeTab" permission
    //console.log(tab.url);
});

// --------------------------------------------------