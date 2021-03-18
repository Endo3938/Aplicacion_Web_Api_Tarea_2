var nextPage = "";
var lastPage = "";
var endpoint = "https://api.jikan.moe/v3/search/anime?";
var endpointPerson = "https://api.jikan.moe/v3/search/person?"
var page = 1;
var lastQueryStr;

function onFilterComboChanged() {

    console.log("filtro cambiado (filtro)");
    lastQueryStr = "";
}

function onTypeComboChanged() {

    console.log("filtro cambiado (tipo)");
    lastQueryStr = "";

    if (document.getElementById("type").value == "anime") {

        document.getElementById("filter").setAttribute("style", "display:visible;")
    }

    if (document.getElementById("type").value == "person") {

        document.getElementById("filter").setAttribute("style", "display:none;")
    }

}

function next() {

    page++;
    find();

}

function back() {

    if (page > 1) {

        page--;
        find();
    }

}

function removeChildren(element) {

    while (element.lastElementChild) {

        element.removeChild(element.lastChild);
    }

}

function find() {

    var queryString = encodeURI(document.getElementById("query").value);

    if (lastQueryStr != queryString) {

        page = 1;
        console.log(lastQueryStr);
        console.log(queryString);
    }

    lastQueryStr = queryString;

    var rate = document.getElementById("filter").value
    var type = document.getElementById("type").value;

    if (type == "person")

        urlRequest = endpointPerson + "q=" + queryString + "&page=" + page + "&rated=" + rate;
        
    if (type == "anime")

        urlRequest = endpoint + "q=" + queryString + "&page=" + page + "&rated=" + rate;

    console.log(urlRequest);
    var data = undefined;
    request = new XMLHttpRequest();
    request.open('GET', urlRequest, true);
    request.send();

    request.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var resultRawData = this.response;
            data = JSON.parse(resultRawData);
            removeChildren(document.getElementById("countDiv"));
            removeChildren(document.getElementById("results"));
            window.scrollTo(0, 0);
            showResponse(data, type);

        }

    }

}



function showResponse(data, type) {

    var divHead = document.getElementById("divHead");
    var countDiv = document.getElementById("countDiv");
    var count = document.createElement("h3");
    var titles = document.createElement("tr");
    var table = document.getElementById("results");

    if (type == "anime") {

        count.innerHTML = "Animes coincidentes: " + data.results.length;
        count.setAttribute("style", "text-align: center;font-size:26px ;");

        if (data.results.length > 0) {

            var titulo = document.createElement("td");
           
            titulo.innerHTML = "Título";
            titulo.setAttribute("style", "text-align: center;font-size:16px ;");
            titles.appendChild(titulo);

            var episodios = document.createElement("td");
            
            episodios.innerHTML = "Número de episodios";
            episodios.setAttribute("style", "text-align: center;font-size:16px ;");
            titles.appendChild(episodios);

            var poster = document.createElement("td");
            
            poster.setAttribute("style", "text-align: center;font-size:16px ;");
            poster.innerHTML = "Poster";
            titles.appendChild(poster);
            titles.setAttribute("style", "text-align: center;font-size:16px ;font-family: 'Comic Sans MS';");
        }

    }

    if (type == "person") {

        count.innerHTML = "Personas coincidentes: " + data.results.length;

        if (data.results.length > 0) {

            var nombre = document.createElement("td");
            
            nombre.innerHTML = "Nombre";
            nombre.setAttribute("style", "text-align: center; font-size:16px ;font-family: 'Comic Sans MS';");
            titles.appendChild(nombre);

            var imagen = document.createElement("td");
            
            imagen.setAttribute("style", "text-align: center; font-size:16px ;font-family: 'Comic Sans MS';");
            imagen.innerHTML = "Fotografía";
            titles.appendChild(imagen);
        }
        
    }

    table.appendChild(titles);
    countDiv.appendChild(count);

    console.log("Viewing page " + page);

    if (data.last_page > page) {
        
        document.getElementById("btnNext").setAttribute("style", "display:visible;");
    } 
    
    else {

        document.getElementById("btnNext").setAttribute("style", "display:none;");

    }

    if (page > 1) {

        document.getElementById("btnBack").setAttribute("style", "display:visible;");

    } 
    
    else {

        document.getElementById("btnBack").setAttribute("style", "display:none;");

    }

    table.appendChild(titles);

    for (var i = 0; i < data.results.length; i++) {

        var item = data.results[i];

        if (type == "anime") {

            var boxTr = document.createElement("tr");
            var titleTr = document.createElement("td");
            var episodiosTr = document.createElement("td");
            var imageTr = document.createElement("td");
            var imageElement = document.createElement("img");
            var aHref = document.createElement("a");

            titleTr.setAttribute("style", "text-align: center;");
            episodiosTr.setAttribute("style", "text-align: center;");
            imageTr.setAttribute("style", "text-align: center;");

            aHref.setAttribute("href", item.url);
            aHref.setAttribute("target", "_blank");
            imageElement.setAttribute("src", item.image_url);
            imageElement.setAttribute("style", "width: 250px;height:250px;margin:20px 0 0 20px;");

            boxTr.appendChild(titleTr);
            boxTr.appendChild(episodiosTr);
            boxTr.appendChild(imageTr);
            imageTr.appendChild(aHref);
            aHref.appendChild(imageElement);

            titleTr.innerHTML = item.title;
            episodiosTr.innerHTML = item.episodes;

            table.appendChild(boxTr);
        }
        
        if (type == "person") {

            var boxTr = document.createElement("tr");
            var nameTr = document.createElement("td");
            var imageTr = document.createElement("td");
            var imageElement = document.createElement("img");
            var aHref = document.createElement("a");

            nameTr.setAttribute("style", "text-align: center;");
            imageTr.setAttribute("style", "text-align: center;");

            aHref.setAttribute("href", item.url);
            aHref.setAttribute("target", "_blank");
            imageElement.setAttribute("src", item.image_url);
            imageElement.setAttribute("style", "width: 250px;height:250px;margin:20px 0 0 20px;");
            boxTr.appendChild(nameTr);
            boxTr.appendChild(imageTr);
            imageTr.appendChild(aHref);
            aHref.appendChild(imageElement);

            nameTr.innerHTML = item.name;

            table.appendChild(boxTr);
        }

    }
    
}