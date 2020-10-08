// global variables
let today = moment();

function buildLocationUrl(){
    let url = "https://api.openweathermap.org/data/2.5/weather?";
    var queryParams = { "appid": "99686e16316412bc9b27bd9cb868d399"};
    queryParams.q = $("#city-name").val().trim();
    // queryParams.q = "seattle";
    return url + $.param(queryParams);    
}
function buildForecastUrl(){
    let url = "http://api.openweathermap.org/data/2.5/forecast?";
    var queryParams = { "appid": "99686e16316412bc9b27bd9cb868d399"};
    queryParams.q = $("#city-name").val().trim();
    // queryParams.q = "seattle";
    return url + $.param(queryParams);    
}
// console.log(buildLocationUrl());
let url = "http://api.openweathermap.org/data/2.5/weather?q=seattle&appid=99686e16316412bc9b27bd9cb868d399"
// $.ajax({
//     url: url, 
//     method: "GET"
// }).then(function(response){
//     console.log(response);
// })


function updateLocationPage(response){       
    console.log(response)
    let city = response.name;
    let iconUrl = response.weather[0].icon;
    let src = `http://openweathermap.org/img/wn/${iconUrl}.png`
    console.log(iconUrl)
    console.log(city)
    let liEl = $("<li class='list-group-item'>");
    // liEl.addClass("list-group-item");
    liEl.text(city);
    $(".list-group-flush").append(liEl)
    // $("img").attr("src", "http://openweathermap.org/img/wn/10d@2x.png")
    $("#city-title").html(`${city}  (${today.format("L")}) <img src=${src}>`)
    $("#temp").html(`Temprature: ${convertKtoF(parseFloat(response.main.temp)).toFixed(2)} &deg;F`)
    $("#humidity").text(`Humidity:  ${response.main.humidity}%`)
    $("#wind-speed").text(`Wind Speed:  ${response.wind.speed}MPH`)
}
// a function to convert Kelvin to Farenheit
function convertKtoF(tempInKelvin) {    
    return ((tempInKelvin - 273.15) * 9 / 5 + 32);
}

$("#search-button").on("click", function(event){
    event.preventDefault();

    let url = buildLocationUrl();

    $.ajax({
        url: url, 
        method: "GET"
    }).then(updateLocationPage)
})