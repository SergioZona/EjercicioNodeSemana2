//Import de librerías necesarias.
const axios = require("axios");
const fs = require("fs");
const http = require("http");

//Lectura del archivo JSON de los clientes de manera asincrónica.
function getClientes(callback) {
  axios
    .get(
      "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json"
    )
    .then((response) => {
      return response["data"];
    })
    .then((result) => callback(result));
}

//Lectura del archivo JSON de los proveedores de manera asincrónica.
function getProveedores(callback) {
  axios
    .get(
      "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json"
    )
    .then((response) => {
      return response["data"];
    })
    .then((result) => callback(result));
}

//Ejecución del servidor WEB.
const server = http
  .createServer((req, res) => {
    
    //URL de los clientes
    if (req.url === "/api/clientes") {
      getClientes((result) => {
        
        //Leyendo el archivo clientes.html con fs.
        fs.readFile("clientes.html", "utf-8", (err, data) => {
          if (err) {
            return;
          }

          //Editando el archivo clientes.html.
          var htmlTemp = data.split("</tr>");
          var clientesHTML = htmlTemp[0] + "</tr><tbody>";
          for (element of result) {
            clientesHTML += `<tr><th scope="row">${element.idCliente}</th><td>${element.NombreCompania}</td><td>${element.NombreContacto}</td></tr></tbody>`;
          }
          clientesHTML += htmlTemp[1];

          //Renderizado de los datos en la ruta.
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(clientesHTML);
          res.end();
        });
      });      
    } 

    //URL de los proveedores.
    else if (req.url === "/api/proveedores") {

      //Leyendo el archivo proveedores.html con fs.
      getProveedores((result) => {
        fs.readFile("proveedores.html", "utf-8", (err, data) => {
          if (err) {
            return;
          }
          console.log(data);

          //Editando el archivo proveedores.html.
          var htmlTemp = data.split("</tr>");
          var proveedoresHTML = htmlTemp[0] + "</tr><tbody>";
          for (element of result) {
            proveedoresHTML += `<tr><th scope="row">${element.idproveedor}</th><td>${element.nombrecompania}</td><td>${element.nombrecontacto}</td></tr></tbody>`;
          }
          proveedoresHTML += htmlTemp[1];

          //Renderizado de los datos en la ruta.
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(proveedoresHTML);
          res.end();
        });
      });
    }

    //En caso de que se escoja otra ruta se retorna error 404.
    else{
      res.writeHead(404);
      res.end();
    }
  })
  .listen(8081); //Puerto a escuchar 8081.
