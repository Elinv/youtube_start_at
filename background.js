/**
 * TODO: A FUTURO FALTA
 * ! -----------------------------------
 * ? Probar en celular para que funcione
 * ? FALTA TRADUCIR LOS ÚLTIMOS ITEMS
 */

"use strict";
// ----------------------------------------
// variable global
var tempo = 0;
const baseElv = browser.storage.local;

// --------------------------------------------------
var filter = {
    url:
        [
            { hostContains: "youtube.com" },
            { hostPrefix: "youtube" }
        ]
}

function logOnCompleted(details) {
    refreshNotas(details);
}

browser.webNavigation.onCompleted.addListener(logOnCompleted, filter);
// --------------------------------------------------

// Enviar y recibir desde background al contextScript
// --------------------------------------------------
function onError(error) {
    console.error(`Error: ${error}`);
}

// envia y recibe mensajes al content script
function sendMessageToTabs(tabs) {
    for (let tab of tabs) {
        browser.tabs.sendMessage(
            tab.id,
            { informaTempo: tempo }
        ).then(respuesta => {
            //respuesta.respEstado
        }).catch(onError);
    }
}
// Mensaje al tab actual
// --------------------------------------------------
function messageTabActual() {
    // aquí lo enviamos
    chrome.tabs.query({
        currentWindow: true,
        active: true
    },
        sendMessageToTabs);
}
// --------------------------------------------------

// funcion para recuperar el tempo de reproducción por la url.
// ----------------------------------------
function refreshNotas(paramUrl) {
    baseElv.get(function (result) {
        for (let i in result) {
            // Si i es igual a la url completa y el resultado no es nulo o indefinido
            if (i === paramUrl.url && result[i] !== "undefined" && result[i] !== "") {
                // pintamos de verde e informamos activado el comando
                browser.browserAction.setBadgeBackgroundColor({ color: "green" });
                // obtenemos el tiempo desde donde reproducir
                tempo = obtTempo(result[i].tiempo);
                // variables para la notificación
                let titMsg = chrome.i18n.getMessage("extensionNombre");
                let inMomentsMsg = chrome.i18n.getMessage("enMomentos");
                let contViendoMsg = chrome.i18n.getMessage("continuaraViendo");
                // Notificación
                browser.notifications.create({
                    "type": "basic",
                    "iconUrl": browser.extension.getURL("icons/youtube.png"),
                    "title": titMsg,
                    "message": '\r\n'+inMomentsMsg+'...\r\n\r\n' + 
                               result[i].titulo + 
                               '\r\n\r\n'+contViendoMsg+': ' + 
                               result[i].tiempo,
                });
                setTimeout(function () { messageTabActual(); }, 1000);
            } else {
                // si aun el video no se ha visto
                // pintamos de rojo e informamos desactivado el comando
                browser.browserAction.setBadgeBackgroundColor({ color: "red" });
            }
        }
    });
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

// Cada vez que una ficha se actualiza, informamos el estado
// ----------------------------------------
chrome.tabs.onActivated.addListener((activeInfo) => {
    var tab = chrome.tabs.get(activeInfo.tabId, function (tab) {
        if (tab.url.match(/youtube.com\/watch\?v=/)) {
            baseElv.get(function (result) {
                for (let i in result) {
                    // Si i es igual a la url completa y el resultado no es nulo o indefinido
                    if (i === tab.url && result[i] !== "undefined" && result[i] !== "") {
                        // pintamos de verde e informamos activado el comando
                        browser.browserAction.setBadgeBackgroundColor({ color: "green" });
                    }
                }
            });
        } else {
            // pintamos de rojo e informamos desactivado el comando
            browser.browserAction.setBadgeBackgroundColor({ color: "red" });
        }
    });

});
// ----------------------------------------