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

                async function insertButton(elemYT) {
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
                for (var n = 0; n <= Number.MAX_VALUE; n++) {
                    var obj = await promiseElemHTMLContScript(n);
                    // obj.value & obj.result);
                    if (obj.value) {
                        await insertButton(obj.value);
                        break;
                    }
                }
            }
            run();
        },
        // Botones Elinv en YT 1°) 'Youtube inicia a las' y 2°) 'Flotar'
        // flotantes a la derecha
        botonElinvInYTFloat: function () {
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
                async function insertButton(elemYT) {
                    // agregamos el estilo del menu flotante elinv
                    let css = `.elinvYTStartUp-container{
                        padding:0px;
                        margin:0px;
                        position:fixed;
                        right:-170px;
                        top:230px;
                        width:210px;
                        z-index: 1100;
                    }
                    .elinvYTStartUp li{
                        list-style-type:none;
                        background-color:#fff;
                        color:#efefef;
                        height:43px;
                        padding:0px;
                        margin:0px 0px 1px 0px;
                        -webkit-transition:all 0.25s ease-in-out;
                        -moz-transition:all 0.25s ease-in-out;
                        -o-transition:all 0.25s ease-in-out;
                        transition:all 0.25s ease-in-out;
                        cursor:pointer;
                    }
                    .elinvYTStartUp li:hover{
                        margin-left:-105px;
                    }
                    .elinvYTStartUp li img{
                        float:left;
                        margin:5px 4px;
                        margin-right:5px;
                    }
                    .elinvYTStartUp li p{
                        padding-top:5px;
                        margin:0px;
                        line-height:16px;
                        font-size:11px;
                    }
                    .elinvYTStartUp li p a{
                        text-decoration:none;
                        color:#2C3539;
                    }
                    .elinvYTStartUp li p a:hover{
                        text-decoration:underline;
                    }`,
                        head = document.head || document.getElementsByTagName('head')[0],
                        style = document.createElement('style');
                    style.type = 'text/css';
                    if (style.styleSheet) {
                        style.styleSheet.cssText = css;
                    } else {
                        style.appendChild(document.createTextNode(css));
                    }
                    head.appendChild(style);

                    // html que insertaremos
                    let winFloat = `data:image/jpeg;base64,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`;
                    let saveState = `data:image/jpeg;base64,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`;
                    let textSaveState = chrome.i18n.getMessage("extensionNombre")
                    //let textWinFloat = chrome.i18n.getMessage("flotar");
                    let textWinFloatTitle = chrome.i18n.getMessage("flotartitle");
                    // creamos div
                    var div = document.createElement('div');
                    div.setAttribute('class', 'elinvYTStartUp-container');
                    // creamos lista 1
                    var ul = document.createElement('ul');
                    ul.setAttribute('class','elinvYTStartUp');
                    // list 1
                    var li1 = document.createElement('li');
                    // Ahregamos img saveState
                    var imgSS = document.createElement("img");
                    imgSS.setAttribute("src", saveState);
                    imgSS.setAttribute("height", "32");
                    imgSS.setAttribute("width", "32");
                    li1.appendChild(imgSS);
                    // Agregamos button butSaveStateElinv
                    var elem_p1 = document.createElement('p');
                    elem_p1.setAttribute('id',"butSaveStateElinv");
                    elem_p1.setAttribute('title', textSaveState );
                    li1.appendChild(elem_p1);
                    ul.appendChild(li1);

                    // list 2
                    var li2 = document.createElement('li');
                    // Ahregamos img saveState
                    var imgSS2 = document.createElement("img");
                    imgSS2.setAttribute("src", winFloat);
                    imgSS2.setAttribute("height", "32");
                    imgSS2.setAttribute("width", "32");                    
                    li2.appendChild(imgSS2);
                    // Agregamos button butSaveStateElinv
                    var elem_p2 = document.createElement('p');
                    elem_p2.setAttribute('id',"butWinApartElinv");
                    elem_p2.setAttribute('title', textWinFloatTitle );
                    li2.appendChild(elem_p2);
                    ul.appendChild(li2);
                    // agregamos todo al div
                    div.appendChild(ul);
                    // agregamos al body
                    document.body.appendChild(div);
                    // estilo de los botones
                    let estilo = `
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                    border-left: solid 1px #C02B21;
                    color: #fff;
                    background: #DE463B;
                    box-shadow: 0px 5px 0px 0px #C02B21;
                    cursor: pointer; 
                    `;
                    // agregamos el boton save
                    let button = document.createElement('button');
                    let texto = chrome.i18n.getMessage("extensionNombre")
                    let t = document.createTextNode(' ' + texto);
                    button.appendChild(t);
                    button.setAttribute('id', 'ElinvButYT');
                    button.setAttribute('title', texto);
                    button.setAttribute('style', estilo);
                    // eslint-disable-next-line no-undef
                    button.onclick = modFireSavePage.grabarNota;
                    document.getElementById('butSaveStateElinv').appendChild(button);
                    // agregar button video flotante
                    // ----------------------------------------------
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
                    let butFloat = document.createElement("input");
                    butFloat.type = "button";
                    butFloat.value = chrome.i18n.getMessage("flotar");
                    butFloat.setAttribute('title', chrome.i18n.getMessage("flotartitle") + '!');
                    butFloat.setAttribute('style', estilo);
                    butFloat.onclick = winApart;
                    document.getElementById('butWinApartElinv').appendChild(butFloat);
                    // ----------------------------------------------                                         
                }
                // para insertar buttons
                for (var n = 0; n <= Number.MAX_VALUE; n++) {
                    var obj = await promiseElemHTMLContScript(n);
                    // obj.value & obj.result);
                    if (obj.value) {
                        await insertButton(obj.value);
                        break;
                    }
                }
            }
            run();
        }
    }
    // ----------------------------------------    
})();
