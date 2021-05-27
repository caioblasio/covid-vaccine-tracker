require("./polyfills");
var Promise = require("es6-promise").Promise;
var page = require("webpage").create();
var urls = require("./urls.json");
var data = Object.entries(urls);

function request(praxis, url) {
  return new Promise(function (resolve, reject) {
    console.log("Trying with Praxis", praxis);
    page.clearMemoryCache();
    page.open(url, function (status) {
      var content = page.evaluate(function () {
        return document.querySelector("pre").innerText;
      });
      content = JSON.parse(content);
      if (status === "success") {
        page.render("./screenshots/" + praxis + ".png");
        resolve(content.total, content["next_slot"]);
      } else {
        reject();
      }
    });
  });
}

function fetchPraxis(d) {
  request(data[d][0], data[d][1]).then(function (total, nextSlot) {
    console.log(
      "Praxis " +
        data[d][0] +
        " , total: " +
        total +
        ", next slot: " +
        nextSlot +
        "\n"
    );
    d++;
    if (total > 0 || nextSlot) {
      console.log("\u0007");
      phantom.exit();
    } else {
      if (d < data.length) {
        fetchPraxis(d);
      } else {
        setTimeout(fetchPraxis, 3000, 0);
      }
    }
  });
}

fetchPraxis(0);
