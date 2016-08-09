console.log("wooo hooo!");

$("td.time").each(function (index, elem) {
  var date = new Date(Number(elem.innerHTML));
  date = date.toLocaleString()
  elem.innerHTML = date;
});

$("td.duration").each(function (index, elem) {
  console.log(Number(elem.innerHTML));
  var date = new Date(Number(elem.innerHTML));
  elem.innerHTML = padZeroes(date.getMinutes()) + ":" + padZeroes(date.getSeconds());
});

function padZeroes(value, padding) {
  if(!padding) var padding = "00";
  return padding.substring(0,padding.length - value.toString().length) + value.toString();
}
