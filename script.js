const symbols = {

XAUUSD:"XAU/USD",
EURUSD:"EUR/USD",
GBPUSD:"GBP/USD",
USDJPY:"USD/JPY",
AUDUSD:"AUD/USD"

};

const cryptoSymbols = {

BTCUSD:"BTCUSDT",
ETHUSD:"ETHUSDT"

};

let activePair =
"XAUUSD";

const apiKey =
"2e17930862544ff2a98735e8bac44bdf";

const heatmapData = {

XAUUSD: {

price: 4376.20,

strikes: [

{ strike:'4350', call:96, put:18 },
{ strike:'4360', call:82, put:30 },
{ strike:'4370', call:68, put:52 },
{ strike:'4380', call:44, put:74 },
{ strike:'4390', call:26, put:96 }

]

}

};

const heatmapRows =
document.getElementById(
"heatmapRows"
);

const pairSelect =
document.getElementById(
"pairSelect"
);

pairSelect.addEventListener(
"change",
() => {

activePair =
pairSelect.value;

renderMarket();

}
);

async function getForexPrice(pair){

try{

const response =
await fetch(

`https://api.twelvedata.com/price?symbol=${pair}&apikey=${apiKey}`

);

const data =
await response.json();

if(data.price){

return Number(data.price);

}

return null;

}catch{

return null;

}

}

async function getCryptoPrice(symbol){

try{

const response =
await fetch(

`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`

);

const data =
await response.json();

return Number(data.price);

}catch{

return null;

}

}

async function getLivePrice(){

if(
cryptoSymbols[activePair]
){

return await getCryptoPrice(

cryptoSymbols[activePair]

);

}else{

return await getForexPrice(

symbols[activePair]

);

}

}

function createHeatmap(price){

if(
heatmapData[activePair]
){

return heatmapData[
activePair
].strikes;

}

const levels = [];

let step;

if(price > 1000){

step =
price * 0.0015;

}else{

step =
price * 0.0008;

}

for(let i=-3;i<=3;i++){

const strike =
price + (i * step);

levels.push({

strike:
price > 1000
? strike.toFixed(2)
: strike.toFixed(4),

call:
Math.floor(
Math.random()*40+60
),

put:
Math.floor(
Math.random()*40+60
)

});

}

return levels;

}

async function renderMarket(){

let livePrice =
await getLivePrice();

if(
heatmapData[activePair]
){

livePrice =
heatmapData[
activePair
].price;

}

if(!livePrice){

document.getElementById(
"livePrice"
).innerText =
"Offline";

return;

}

const levels =
createHeatmap(
livePrice
);

heatmapRows.innerHTML = "";

let strongestCall =
levels[0];

let strongestPut =
levels[0];

levels.forEach(level => {

if(
level.call >
strongestCall.call
){

strongestCall =
level;

}

if(
level.put >
strongestPut.put
){

strongestPut =
level;

}

const row =
document.createElement(
"div"
);

row.classList.add(
"heatmap-row"
);

row.innerHTML = `

<div>
${level.strike}
</div>

<div class="bar">

<div
class="fill-call"
style="
width:${level.call}%;
">
</div>

</div>

<div class="bar">

<div
class="fill-put"
style="
width:${level.put}%;
">
</div>

</div>

`;

heatmapRows.appendChild(
row
);

});

document.getElementById(
"livePrice"
).innerText =
livePrice > 1000
? livePrice.toFixed(2)
: livePrice.toFixed(4);

document.getElementById(
"callVolume"
).innerText =
strongestCall.call + "K";

document.getElementById(
"putVolume"
).innerText =
strongestPut.put + "K";

document.getElementById(
"callArea"
).innerText =
strongestCall.strike;

document.getElementById(
"putArea"
).innerText =
strongestPut.strike;

const sentiment =
strongestCall.call >
strongestPut.put
? "Bullish"
: "Bearish";

const sentimentEl =
document.querySelector(
".bullish"
);

sentimentEl.innerText =
sentiment;

if(sentiment === "Bullish"){

sentimentEl.style.color =
"#00ff95";

}else{

sentimentEl.style.color =
"#ff3366";

}

}

document.getElementById(
"analyzeBtn"
).addEventListener(
"click",
() => {

const price =
Number(
document.getElementById(
"manualPrice"
).value
);

if(!price) return;

const callArea =
price + (price * 0.003);

const putArea =
price - (price * 0.003);

document.getElementById(
"callArea"
).innerText =
callArea.toFixed(2);

document.getElementById(
"putArea"
).innerText =
putArea.toFixed(2);

}
);

const menuBtn =
document.getElementById(
"menuBtn"
);

const dropdownMenu =
document.querySelector(
".dropdown-menu"
);

menuBtn.addEventListener(
"click",
(e) => {

e.stopPropagation();

if(
dropdownMenu.style.display
=== "flex"
){

dropdownMenu.style.display =
"none";

}else{

dropdownMenu.style.display =
"flex";

}

}
);

window.addEventListener(
"click",
(e) => {

if(
!menuBtn.contains(e.target)
&&
!dropdownMenu.contains(e.target)
){

dropdownMenu.style.display =
"none";

}

});

renderMarket();

setInterval(() => {

renderMarket();

},4000);
