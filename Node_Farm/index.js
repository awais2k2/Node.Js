const fs = require("fs");
const http = require("http");
const url = require("url");

//Blocking
// const txt = fs.readFileSync("../starter/txt/input.txt", "utf-8");
// const puttxt = `ok i am going ${txt} on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", puttxt);

//Non-Blocking
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         `./txt/final.txt`,
//         `${data1}${data2}${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("File is being added");
//         }
//       );
//     });
//   });
// });
// console.log("First read this!!");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENT%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const productData = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(productData);
const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempProduct = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);

//Server
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname == "/overview" || pathname == "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }

  //PRODUCT PAGE
  else if (pathname == "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //API
  else if (pathname == "api") {
    res.end("Api");
  }

  //NOT_FOUND
  else {
    res.writeHead(404);
    res.end("Page not found");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server has been started on port 8000");
});
