const pairSelect = document.getElementById("pairSelect");
const price = document.getElementById("price");

function randomPrice() {
  let random = (Math.random() * 100).toFixed(2);
  price.innerHTML = random;
}

setInterval(randomPrice, 1000);

function updatePercent() {

  let buy = Math.floor(Math.random() * 100);
  let sell = 100 - buy;

  document.getElementById("buyPercent").innerHTML = buy + "%";
  document.getElementById("sellPercent").innerHTML = sell + "%";

}

setInterval(updatePercent, 2000);

function playSound(){
  document.getElementById("clickSound").play();
}

let seconds = 60;

function updateTimer(){

  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;

  sec = sec < 10 ? "0" + sec : sec;

  document.getElementById("timer").innerHTML = `${min}:${sec}`;

  if(seconds <= 0){
    seconds = 60;
  }

  seconds--;

}

setInterval(updateTimer,1000);

new TradingView.widget({
  "width": "100%",
  "height": 500,
  "symbol": "OANDA:XAUUSD",
  "interval": "1",
  "timezone": "Asia/Jakarta",
  "theme": "dark",
  "style": "1",
  "locale": "id",
  "toolbar_bg": "#0d1117",
  "enable_publishing": false,
  "hide_top_toolbar": false,
  "save_image": false,
  "container_id": "tradingview_chart"
});

pairSelect.addEventListener("change", function(){

  document.getElementById("tradingview_chart").innerHTML = "";

  new TradingView.widget({
    "width": "100%",
    "height": 500,
    "symbol": this.value,
    "interval": "1",
    "timezone": "Asia/Jakarta",
    "theme": "dark",
    "style": "1",
    "locale": "id",
    "toolbar_bg": "#0d1117",
    "enable_publishing": false,
    "hide_top_toolbar": false,
    "save_image": false,
    "container_id": "tradingview_chart"
  });

});
