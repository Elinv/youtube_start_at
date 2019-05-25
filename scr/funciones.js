/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
"use strict";
const modFireSavePage = (function () {
    // ----------------------------------------    
    // mensajes tipo notificación
    // ----------------------------------------
    return {
        msgNotif: function (titulo, msge) {
            browser.notifications.create({
                'type': 'basic',
                'iconUrl': browser.extension.getURL("icons/youtube.png"),
                'title': titulo,
                'message': msge
            });
        },
        // ---------------------------------------- 
        // ----------------------------------------
        // ver mas info sobre elinv
        infoAboutElinv: function () {
            function onCreated(tab) {
                //console.log(`Created new tab: ${tab.id}`)
            }

            function onError(error) {
                //console.log(`Error: ${error}`);
            }

            var creating = browser.tabs.create({
                url: "https://www.google.com.ar/search?q=elinv"
            });
            creating.then(onCreated, onError);
        },
        // ---------------------------------------- 
        // ----------------------------------------
        // ver recomendados de Youtube
        preferidosYT: function () {
            var urlFloat = 'https://www.youtube.com';
            function onCreated(windowInfo) {
                //console.log(`Created window: ${windowInfo.id}`);
            }
            function onError(error) {
                //console.log(`Error: ${error}`);
            }
            var creating = browser.windows.create({
                url: urlFloat,
                type: "popup",
                width: 800,
                height: 600
            });
            creating.then(onCreated, onError);
        },
        // ----------------------------------------
        // ----------------------------------------
        // mensaje span en documento html
        // ----------------------------------------        
        msgDocHtmlSpan: function (msge) {
            let frag = document.createDocumentFragment();
            // formato al texto
            var label = document.createElement("div");
            label.appendChild(document.createElement(msge));
            label.style.fontSize = "25px";
            label.style.textAlign = "center";
            label.style.color = "#000020";
            // lo agregamos
            frag.appendChild(label);
            document.body.appendChild(frag);
        },
        // ----------------------------------------  
        // ----------------------------------------
        // mensaje Link en documento html
        // ----------------------------------------        
        msgDocHtmlLink: function (elvOBJETO, searchTXT) {
            // Create fragment and append links to it.
            var fragment = document.createDocumentFragment()
            var divVar = document.createElement('div');
            divVar.id = 'ytStartAtDiv';
            divVar.align = "center";
            divVar.style.cssText = "background-color:#ddd;";

            // función para convertir un entero en hora, minutos y segundos
            function convEntToTime(time) {
                let hours = Math.floor(time / 3600);
                let minutes = Math.floor((time % 3600) / 60);
                let seconds = time % 60;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                let result = hours + ":" + minutes + ":" + seconds;
                return result;
            }

            // Remueve el item Storage local e informa mediante notificación
            function onClickLinkDel(linkYT, titulo, idBoton) {
                //let tituloExt = chrome.i18n.getMessage("extensionNombre");
                // si fué removido
                function onRemoved() {
                    /*
                    //modFireSavePage.msgNotif(tituloExt, linkYT +
                        '\r\n' + titulo + '\r\n' +
                        chrome.i18n.getMessage("notifBorrado") + '!');
                        */
                }
                // caso error
                // eslint-disable-next-line no-unused-vars
                function onError(e) {
                    //modFireSavePage.msgNotif(tituloExt, chrome.i18n.getMessage("notifBorradoError") + ": " + e);
                }
                //baseElv = browser.storage.local
                let removeKitten = browser.storage.local.remove(linkYT);
                removeKitten.then(onRemoved, onError);

                // resaltamos el texto del link
                let btn = document.getElementById(idBoton);
                let atrId = btn.getAttribute("linkTextDec");
                let lnkTextDec = document.getElementById(atrId);
                lnkTextDec.style.textDecoration = "line-through";
                lnkTextDec.style.textDecorationColor = "red";
                lnkTextDec.style.textDecorationStyle = "double";
                return false;
            }

            // abre la ventana flotante para mostrar 
            // el video YT en la instancia de tiempo correcta
            function onClickLinkFloat(linkYT, tiempo) {
                // Obtiene id forma url y crea window popup
                function parseId(url) {
                    let match = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\\&\\?]*).*/.exec(url);
                    if (match instanceof Array && match[2] !== undefined) {
                        return match[2];
                    } else {
                        return false;
                    }
                }
                let id = parseId(linkYT);
                var urlFloat = 'https://www.youtube.com/embed/' + id + '?autoplay=1&start=' + tiempo;
                // eslint-disable-next-line no-unused-vars
                function onCreated(windowInfo) {
                    //console.log(`Created window: ${windowInfo.id}`);
                }
                // eslint-disable-next-line no-unused-vars
                function onError(error) {
                    //console.log(`Error: ${error}`);
                }
                var creating = browser.windows.create({
                    url: urlFloat,
                    type: "popup",
                    width: 640,
                    height: 480
                });
                creating.then(onCreated, onError);
            }

            let cont = 0;
            for (let i in elvOBJETO) {
                // para el search txt
                if (elvOBJETO[i].titulo.toLowerCase().indexOf(searchTXT.toLowerCase()) >= 0) {
                    // agregar button video flotante
                    // ----------------------------------------------                
                    let butFloat = document.createElement("input");
                    butFloat.type = "button";
                    butFloat.value = chrome.i18n.getMessage("flotar");
                    butFloat.setAttribute('title', chrome.i18n.getMessage("flotartitle") + '!');
                    butFloat.className = "button";
                    butFloat.onclick = function (j, l) {
                        return function () {
                            onClickLinkFloat(j + '', l + '');
                        };
                    }(i, elvOBJETO[i].tiempo);
                    divVar.appendChild(butFloat);

                    // Tooltips de cada links
                    // ----------------------------------------------
                    let tooltipSpan = document.createElement('span');
                    tooltipSpan.className = "tooltiptext";
                    tooltipSpan.textContent = chrome.i18n.getMessage("tooltip") + ': ' + convEntToTime(elvOBJETO[i].tiempo);
                    // Link 
                    let newlink = document.createElement('a');
                    newlink.textContent = elvOBJETO[i].titulo;
                    newlink.id = cont;
                    //newlink.setAttribute('title', 'Watch the video. Start at: '+convEntToTime(elvOBJETO[i].tiempo));
                    newlink.setAttribute('href', i + '&feature=youtu.be&t=' + elvOBJETO[i].tiempo);
                    newlink.className = "tooltip";
                    // Agregamos el tooltips
                    newlink.appendChild(tooltipSpan);
                    // agregamos todo al div
                    divVar.appendChild(newlink);
                    // agregar button para borrar este link
                    // ----------------------------------------------                
                    let butDel = document.createElement("input");
                    butDel.type = "button";
                    butDel.value = chrome.i18n.getMessage("borrarBoton");
                    butDel.id = "delete" + cont;
                    butDel.setAttribute('title', chrome.i18n.getMessage("borrarBotonTitle"));
                    butDel.className = "button";
                    butDel.onclick = function (j, l, m) {
                        return function () {
                            onClickLinkDel(j + '', l + '', m + '');
                        };
                    }(i, elvOBJETO[i].titulo, butDel.id);
                    // creamos atributo referencial al link anterior
                    var a = document.createAttribute("linkTextDec");
                    a.value = cont++;
                    butDel.setAttributeNode(a);
                    // agregamos el botón
                    divVar.appendChild(butDel);

                    // salto de linea
                    // ----------------------------------------------
                    let br = document.createElement("br");
                    divVar.appendChild(br);
                }
            }
            fragment.appendChild(divVar);
            document.body.appendChild(fragment);
        },
        // ----------------------------------------  
        // ----------------------------------------        
        // Obtiene id forma url y crea window popup
        // ----------------------------------------  
        parseId: function (url) {
            let match = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\\&\\?]*).*/.exec(url);
            if (match instanceof Array && match[2] !== undefined) {
                return match[2];
            } else {
                return false;
            }
        },
        // ----------------------------------------
        // ----------------------------------------  
        // función para convertir tiempo en un entero
        // ----------------------------------------        
        obtTempo: function (valor) {
            let largo = valor.split(':').length;
            let total = 0, resMin, resSeg;
            if (largo === 3) {
                let resHora = valor.split(':')[0] * 60 * 60;
                resMin = valor.split(':')[1] * 60;
                resSeg = valor.split(':')[2] * 1;
                total = resHora + resMin + resSeg;
            } else if (largo === 2) {
                resMin = valor.split(':')[0] * 60;
                resSeg = valor.split(':')[1] * 1;
                total = resMin + resSeg;
            }
            return total;
        },
        // ---------------------------------------- 
        // Constante y funciones para grabar en Storage local
        //*Url y tiempo de ejecución
        grabarNota: function () {
            // ----------------------------------------
            const baseElv = browser.storage.local;
            // tiempo actual de reproducción y url
            let tiempo = document.getElementsByClassName('ytp-time-current')[0].innerHTML;
            let url = window.location.href;
            // solo esta definición de url
            url = url.match(/(https?):\/\/[^\\&|\s"]+/)[0];
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
            }
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

            // info mediante document.title
            function setItemInfo() {
                let titulo = document.title;
                let tiempo = document.getElementsByClassName('ytp-time-current')[0].innerHTML;
                let grabado = chrome.i18n.getMessage("grabado");
                document.title = titulo + ' ==> (' + grabado + ': ' + tiempo + ') <==';
                setTimeout(function () { document.title = titulo }, 7000);
            }
            // informa errores
            function onError(error) {
                //console.error(`Error: ${error}`);
            }
        },
        // Botones Elinv en YT 1°) 'Youtube inicia a las' y 2°) 'Flotar'
        botonElinvInYT: function () {
            // async y await
            function promiseElemHTMLContScript(value) {
                return new Promise(function (fulfill) {
                    // elementos contenedores -> container info info-text
                    value = document.getElementById("info");
                    setTimeout(function () {
                        fulfill({ value: value, result: value * value });
                    }, 2000);
                });
            }
            async function run() {
                for (var n = 0; n <= Number.MAX_VALUE; n++) {
                    var obj = await promiseElemHTMLContScript(n);
                    // obj.value & obj.result);
                    if (obj.value) {
                        insertButton(obj.value);
                        break;
                    }
                }
            }
            run();

            // Abrir video en ventana aparte
            function winApart() {
                // abre la ventana flotante para mostrar 
                // el video YT en la instancia de tiempo correcta
                // eslint-disable-next-line no-undef
                let id = modFireSavePage.parseId(window.location.href);
                let tiempo = document.getElementsByClassName('ytp-time-current')[0].innerHTML
                // eslint-disable-next-line no-undef
                tiempo = modFireSavePage.obtTempo(tiempo);
                let urlFloat = 'https://www.youtube.com/embed/' + id + '?autoplay=1&start=' + tiempo;
                let configuracion_ventana = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
                function abrir_Popup() {
                    // eslint-disable-next-line no-undef
                    objeto_window_referencia = window.open(urlFloat, "Video por Elinv", configuracion_ventana);
                }

                // Llamamos a la función    
                abrir_Popup();
            }

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
                    // eslint-disable-next-line no-undef
                    button.onclick = modFireSavePage.grabarNota;
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
    }
    // ----------------------------------------
})();
