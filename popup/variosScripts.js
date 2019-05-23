var modFireSavePage = (function () {
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
            let textNode = frag.appendChild(label);
            document.body.appendChild(frag);
        },
        // ----------------------------------------  
        // ----------------------------------------
        // mensaje span en documento html
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
                    newlink.setAttribute('href', i + '?t=' + elvOBJETO[i].tiempo);
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
        }
    }
    // ----------------------------------------
})();

// Remueve el item Storage local e informa mediante notificación
function onClickLinkDel(linkYT, titulo, idBoton) {
    let tituloExt = chrome.i18n.getMessage("extensionNombre");
    // si fué removido
    function onRemoved() {
        /*
        //modFireSavePage.msgNotif(tituloExt, linkYT +
            '\r\n' + titulo + '\r\n' +
            chrome.i18n.getMessage("notifBorrado") + '!');
            */
    }
    // caso error
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
        let match = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/.exec(url);
        if (match instanceof Array && match[2] !== undefined) {
            return match[2];
        } else {
            return false;
        }
    }
    let id = parseId(linkYT);
    var urlFloat = 'https://www.youtube.com/embed/' + id + '?autoplay=1&start=' + tiempo;
    function onCreated(windowInfo) {
        //console.log(`Created window: ${windowInfo.id}`);
    }
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