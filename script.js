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
    let url = "https://api.openweathermap.org/data/2.5/forecast?";
    var queryParams = { "appid": "99686e16316412bc9b27bd9cb868d399"};
    queryParams.q = $("#city-name").val().trim();
    // queryParams.q = "seattle";
    return url + $.param(queryParams);    
}
// console.log(buildLocationUrl());
// let url = "http://api.openweathermap.org/data/2.5/weather?q=seattle&appid=99686e16316412bc9b27bd9cb868d399"
// $.ajax({
//     url: url, 
//     method: "GET"
// }).then(function(response){
//     console.log(response);
// })


function updateLocationPage(location){       
    console.log(location)
    let city = location.name;
    let iconUrl = location.weather[0].icon;
    let src = `http://openweathermap.org/img/wn/${iconUrl}.png`
    console.log(iconUrl)
    console.log(city)
    let liEl = $("<li class='list-group-item'>");
    // liEl.addClass("list-group-item");
    liEl.text(city);
    $(".list-group-flush").append(liEl)
    // $("img").attr("src", "http://openweathermap.org/img/wn/10d@2x.png")
    $("#city-title").html(`${city} (${today.format("L")}) <img src=${src}>`)
    $("#temp").html(`Temprature: ${convertKtoF(parseFloat(location.main.temp)).toFixed(2)}&deg;F`)
    $("#humidity").text(`Humidity: ${location.main.humidity}%`)
    $("#wind-speed").text(`Wind Speed: ${location.wind.speed}MPH`)

    // making a UV index request and function
    let lon = location.coord.lon;
    let lat = location.coord.lat;

    function buildUVIndexUrl(){
        let url = "https://api.openweathermap.org/data/2.5/uvi?";
        var queryParams = { "appid": "99686e16316412bc9b27bd9cb868d399"};
        queryParams.lat = lat;
        queryParams.lon = lon;
        // queryParams.q = "seattle";
        return url + $.param(queryParams);    
    }

    let UVUrl = buildUVIndexUrl();
    
    $.ajax({
        url: UVUrl, 
        method: "GET"
    }).then(function(res){
        // console.log(res)
        let UVIndex = res.value;
        console.log(UVIndex);
        
        if(UVIndex > 10.00){
            $("#uv-index").addClass("btn-danger");
            $("#uv-index").removeClass("btn-success");
        } else {
            $("#uv-index").addClass("btn-success");
            $("#uv-index").removeClass("btn-danger");
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
    // day-one -variables
    let forecastOne = forecast.list[5];
    let dayOneIcon = forecastOne.weather[0].icon
    let src1 = `http://openweathermap.org/img/wn/${dayOneIcon}.png`

    // day-two-variables
    let forecastTwo = forecast.list[13];    
    let dayTwoIcon = forecastTwo.weather[0].icon    
    let src2 = `http://openweathermap.org/img/wn/${dayTwoIcon}.png`

    // day-three varibles
    let forecastThree = forecast.list[21];    
    let dayThreeIcon = forecastThree.weather[0].icon    
    let src3 = `http://openweathermap.org/img/wn/${dayThreeIcon}.png`

    // day-four-variables
    let forecastFour = forecast.list[29];    
    let dayFourIcon = forecastFour.weather[0].icon    
    let src4 = `http://openweathermap.org/img/wn/${dayFourIcon}.png`

    // day-five-variables
    let forecastFive = forecast.list[37];    
    let dayFiveIcon = forecastFive.weather[0].icon    
    let src5 = `http://openweathermap.org/img/wn/${dayFiveIcon}.png`


    console.log(dayOneIcon);
    console.log(forecast.list[5].dt_txt)
    // day-one-pages
    $("#day-1").text(forecastOne.dt_txt)
    $("#day-one-icon").attr("src", src1);
    $("#temp-day-1").html(`Temp: ${convertKtoF(parseFloat(forecastOne.main.temp)).toFixed(2)}&deg;F`)
    $("#humid-day-1").text(`Humidity:  ${forecastOne.main.humidity}%`)

    // day-two
    $("#day-2").text(forecastTwo.dt_txt)
    $("#day-two-icon").attr("src", src2);
    $("#temp-day-2").html(`Temp: ${convertKtoF(parseFloat(forecastTwo.main.temp)).toFixed(2)}&deg;F`)
    $("#humid-day-2").text(`Humidity:  ${forecastTwo.main.humidity}%`)

    // day-three
    $("#day-3").text(forecastThree.dt_txt)
    $("#day-three-icon").attr("src", src3);
    $("#temp-day-3").html(`Temp: ${convertKtoF(parseFloat(forecastThree.main.temp)).toFixed(2)}&deg;F`)
    $("#humid-day-3").text(`Humidity:  ${forecastThree.main.humidity}%`)

    // day-four
    $("#day-4").text(forecastFour.dt_txt)
    $("#day-four-icon").attr("src", src4);
    $("#temp-day-4").html(`Temp: ${convertKtoF(parseFloat(forecastFour.main.temp)).toFixed(2)}&deg;F`)
    $("#humid-day-4").text(`Humidity:  ${forecastFour.main.humidity}%`)

    // day-five
    $("#day-5").text(forecastFive.dt_txt)
    $("#day-five-icon").attr("src", src5);
    $("#temp-day-5").html(`Temp: ${convertKtoF(parseFloat(forecastFive.main.temp)).toFixed(2)}&deg;F`)
    $("#humid-day-5").text(`Humidity:  ${forecastFive.main.humidity}%`)
}


$("#search-button").on("click", function(event){
    event.preventDefault();

    let url = buildLocationUrl();
    let forecastUrl = buildForecastUrl()

    $.ajax({
        url: url, 
        method: "GET"
    }).then(updateLocationPage)

    $.ajax({
        url: forecastUrl, 
        method: "GET"
    }).then(updateForecastpage)
})