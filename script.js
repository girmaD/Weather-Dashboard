// global variables
let today = moment();
let lat;
let lon;
let retrArr = JSON.parse(localStorage.getItem("city")) || "null";;
let appid = "99686e16316412bc9b27bd9cb868d399";

// this function builds a url to make weather request using jQuery param method
function buildLocationUrl(){
    let url = "https://api.openweathermap.org/data/2.5/weather?";
    var queryParams = { "appid": "99686e16316412bc9b27bd9cb868d399"};
    queryParams.q = $("#city-name").val().trim();    
    queryParams.q = retrArr[cityArr.length - 1];    
    return url + $.param(queryParams);    
}
// this function builds a url to make forecast request using jQuery param method
function buildForecastUrl(){
    let url = "https://api.openweathermap.org/data/2.5/forecast?";
    var queryParams = { "appid": "99686e16316412bc9b27bd9cb868d399"};
    queryParams.q = $("#city-name").val().trim();    
    queryParams.q = retrArr[cityArr.length - 1];    
    return url + $.param(queryParams);    
}
// this function builds a url to make UV request using jQuery param method
function buildUVIndexUrl(){
    let url = "https://api.openweathermap.org/data/2.5/uvi?";
    var queryParams = { "appid": "99686e16316412bc9b27bd9cb868d399"};
    queryParams.lat = lat;
    queryParams.lon = lon;   
    return url + $.param(queryParams);    
}


function updateLocationPage(location){       
    console.log(location)
    let city = location.name;
    let icon = location.weather[0].icon;    
    let src = `http://openweathermap.org/img/wn/${icon}.png`
    
    for(let i = 0; i < retrArr.length; i++){
        let liEl = $(`<li class='list-group-item'>`);
        liEl.text(retrArr[i]);
        $(".list-group-flush").prepend(liEl);
    }
    
    $("#main-body").removeClass("d-none");
    $("#city-title").html(`${city} (${today.format("L")}) <img src=${src}>`)
    $("#temp").html(`Temprature: ${convertKtoF(parseFloat(location.main.temp)).toFixed(2)}&deg;F`)
    $("#humidity").text(`Humidity: ${location.main.humidity}%`)
    $("#wind-speed").text(`Wind Speed: ${location.wind.speed}MPH`)

    // making a UV index request and function
    lon = location.coord.lon;
    lat = location.coord.lat;

    let UVUrl = buildUVIndexUrl();
    
    $.ajax({
        url: UVUrl, 
        method: "GET"
    }).then(function(res){
        // console.log(res)
        UVIndex = res.value;    
        if(UVIndex > 8.00){
            $("#uv-index").addClass("btn-danger");
            $("#uv-index").removeClass("btn-success");
            $("#uv-index").removeClass("btn-warning");
        } else if(UVIndex < 8.00 && UVIndex > 3.00) {
            $("#uv-index").addClass("btn-warning");
            $("#uv-index").removeClass("btn-danger");
            $("#uv-index").removeClass("btn-sucess");
        } else {
            $("#uv-index").addClass("btn-success");
            $("#uv-index").removeClass("btn-danger");
            $("#uv-index").removeClass("btn-warning");
        }
        $("#uv-label").text(`UV-Index: `)
        $("#uv-index").text(`${UVIndex}`)
    })
}

function updatePage(location){       
    console.log(location)
    let city = location.name;
    let icon = location.weather[0].icon;    
    let src = `http://openweathermap.org/img/wn/${icon}.png`
         
    $("#main-body").removeClass("d-none");
    $("#city-title").html(`${city} (${today.format("L")}) <img src=${src}>`)
    $("#temp").html(`Temprature: ${convertKtoF(parseFloat(location.main.temp)).toFixed(2)}&deg;F`)
    $("#humidity").text(`Humidity: ${location.main.humidity}%`)
    $("#wind-speed").text(`Wind Speed: ${location.wind.speed}MPH`)

    // making a UV index request and function
    lon = location.coord.lon;
    lat = location.coord.lat;

    let UVUrl = buildUVIndexUrl();
    
    $.ajax({
        url: UVUrl, 
        method: "GET"
    }).then(function(res){
        // console.log(res)
        UVIndex = res.value;    
        if(UVIndex > 8.00){
            $("#uv-index").addClass("btn-danger");
            $("#uv-index").removeClass("btn-success");
            $("#uv-index").removeClass("btn-warning");
        } else if(UVIndex < 8.00 && UVIndex > 3.00) {
            $("#uv-index").addClass("btn-warning");
            $("#uv-index").removeClass("btn-danger");
            $("#uv-index").removeClass("btn-sucess");
        } else {
            $("#uv-index").addClass("btn-success");
            $("#uv-index").removeClass("btn-danger");
            $("#uv-index").removeClass("btn-warning");
        }
        $("#uv-label").text(`UV-Index: `)
        $("#uv-index").text(`${UVIndex}`)
    })
}
// a function to convert Kelvin to Farenheit
function convertKtoF(tempInKelvin) {    
    return ((tempInKelvin - 273.15) * 9 / 5 + 32);
}

// function to update the 5-day forecast html file
function updateForecastpage(forecast){
    console.log(forecast);
    let listArr = forecast.list;
    
    let i = 5;
    while(i < listArr.length){
        let newForecast = listArr[i];
        i +=8;
        let icon = newForecast.weather[0].icon;
        let src = `http://openweathermap.org/img/wn/${icon}.png`;        
                                                  
        let cardCol = $('<div class="col-md-2 card pl-1 bg-primary">');
        let cardBody = $('<div class="card-body p-0">');
        let h5El = $("<h5>").text(moment(newForecast.dt_txt).format("L"));
        let imgEl = $("<img>").attr("src", src);
        let p1El = $("<p>").html(`Temp: ${convertKtoF(parseFloat(newForecast.main.temp)).toFixed(2)}&deg;F`)
        let p2El = $("<p>").text(`Humidity: ${newForecast.main.humidity}%`)

        cardBody.append(h5El);
        cardBody.append(imgEl);
        cardBody.append(p1El);
        cardBody.append(p2El);
        cardCol.append(cardBody);
        $(".card-deck").append(cardCol);        
    }
    $("#5d-forecast").removeClass("d-none");    
}

$("#search-button").on("click", function(event){
    event.preventDefault();
    $(".card-deck").empty();
    $(".list-group-flush").empty();

    // *********
    let city = $("#city-name").val().trim();
    let cityArr = JSON.parse(localStorage.getItem("city"));
    if (!cityArr) {
        cityArr = [];
        cityArr.push(city);
        localStorage.setItem("city", JSON.stringify(cityArr));
    } else {
        cityArr.push(city);
        localStorage.setItem("city", JSON.stringify(cityArr));
    }
    retrArr = JSON.parse(localStorage.getItem("city")) || "null";
    // renderCity();  
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${city}`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${city}`;
    $.ajax({
        url: url, 
        method: "GET"
    }).fail(function () {
        alert("Something wrong. Please verify spelling and try again.")
        return;
    }).then(updateLocationPage)
    
    $.ajax({
        url: forecastUrl, 
        method: "GET"
    }).then(updateForecastpage) 
    // ********        
})

function renderCity() {
    let retrArr = JSON.parse(localStorage.getItem("city")) || "null";
    let lastCity = retrArr[retrArr.length - 1]
    // if(retrArr !== "null") {
    //     lastCity = retrArr[retrArr.length - 1];
    // } 
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${lastCity}`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${lastCity}`;
    $.ajax({
        url: url, 
        method: "GET"
    }).then(updateLocationPage)
    
    $.ajax({
        url: forecastUrl, 
        method: "GET"
    }).then(updateForecastpage)     
}
// console.log(retrArr.length)
// console.log(retrArr)
// if (retrArr){
    renderCity(); 
// }


$(document).on("click", ".list-group-item", function(event){
    event.preventDefault();
    $(".card-deck").empty();
    let clickedCity =  $(this).text();   
    console.log(clickedCity) 
    // $(this).addClass("bg-primary");

    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${clickedCity}`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${clickedCity}`;
    $.ajax({
        url: url, 
        method: "GET"
    }).fail(function () {
        alert("Something wrong. Please verify spelling and try again.")
    }).then(updatePage)
    
    $.ajax({
        url: forecastUrl, 
        method: "GET"
    }).then(updateForecastpage) 
    // renderCity();
});

