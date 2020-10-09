// global variables
let today = moment();
let lat;
let lon;
let city;
// let cityArr;
// this function builds a url to make weather request using jQuery param method
function buildLocationUrl(){
    let url = "https://api.openweathermap.org/data/2.5/weather?";
    var queryParams = { "appid": "99686e16316412bc9b27bd9cb868d399"};
    queryParams.q = $("#city-name").val().trim();    
    return url + $.param(queryParams);    
}
// this function builds a url to make forecast request using jQuery param method
function buildForecastUrl(){
    let url = "https://api.openweathermap.org/data/2.5/forecast?";
    var queryParams = { "appid": "99686e16316412bc9b27bd9cb868d399"};
    queryParams.q = $("#city-name").val().trim();    
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
    city = location.name;
    let iconUrl = location.weather[0].icon;
    let src = `http://openweathermap.org/img/wn/${iconUrl}.png`
    
    // let cityArr = [];
    
    // localStorage.setItem("city", JSON.stringify(cityArr))
    
    let liEl = $(`<li id='${city}' class='list-group-item'>`);
    // let id = $(liEl).attr("id");
    // console.log(id)
    // let cityValue = JSON.parse(localStorage.getItem("city"));
    // if(cityValue === id) {
        liEl.text(city);
    // }
    
    $(".list-group-flush").prepend(liEl)
    // $(".list-group-flush").prepend(buttonEl)
    // function renderCity(){
    //     $(".list-group-item").each(function(){
    //         let cityValue = localStorage.getItem("city");
    //         if(cityValue){            
    //             $(this).text(cityValue);
    //         }
    //     });  
    // }  



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
        let UVIndex = res.value;
        // console.log(UVIndex);
        
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

    // let forecastOne = forecast.list[5];
    // let dayOneIcon = forecastOne.weather[0].icon
    // let src1 = `http://openweathermap.org/img/wn/${dayOneIcon}.png`

    // day-two-variables
    // let forecastTwo = forecast.list[13];    
    // let dayTwoIcon = forecastTwo.weather[0].icon    
    // let src2 = `http://openweathermap.org/img/wn/${dayTwoIcon}.png`

    // day-three varibles
    // let forecastThree = forecast.list[21];    
    // let dayThreeIcon = forecastThree.weather[0].icon    
    // let src3 = `http://openweathermap.org/img/wn/${dayThreeIcon}.png`

    // day-four-variables
    // let forecastFour = forecast.list[29];    
    // let dayFourIcon = forecastFour.weather[0].icon    
    // let src4 = `http://openweathermap.org/img/wn/${dayFourIcon}.png`

    // day-five-variables
    // let forecastFive = forecast.list[37];    
    // let dayFiveIcon = forecastFive.weather[0].icon    
    // let src5 = `http://openweathermap.org/img/wn/${dayFiveIcon}.png`


    // console.log(dayOneIcon);
    // console.log(forecast.list[5].dt_txt)
    // day-one-pages
    // $("#day-1").text(forecastOne.dt_txt)
    // $(".col-md-2").addClass("bg-primary");
    // $(".card-deck").removeClass("d-none");

    // $("#day-1").text(moment(forecastOne.dt_txt).format("L"))
    // $("#day-one-icon").attr("src", src1);
    // $("#temp-day-1").html(`Temp: ${convertKtoF(parseFloat(forecastOne.main.temp)).toFixed(2)}&deg;F`)
    // $("#humid-day-1").text(`Humidity:  ${forecastOne.main.humidity}%`)

    // day-two
    // $("#day-2").text(forecastTwo.dt_txt)
    // $("#day-2").text(moment(forecastTwo.dt_txt).format("L"))
    // $("#day-two-icon").attr("src", src2);
    // $("#temp-day-2").html(`Temp: ${convertKtoF(parseFloat(forecastTwo.main.temp)).toFixed(2)}&deg;F`)
    // $("#humid-day-2").text(`Humidity:  ${forecastTwo.main.humidity}%`)

    // day-three
    // $("#day-3").text(forecastThree.dt_txt)
    // $("#day-3").text(moment(forecastThree.dt_txt).format("L"))
    // $("#day-three-icon").attr("src", src3);
    // $("#temp-day-3").html(`Temp: ${convertKtoF(parseFloat(forecastThree.main.temp)).toFixed(2)}&deg;F`)
    // $("#humid-day-3").text(`Humidity:  ${forecastThree.main.humidity}%`)

    // day-four
    // $("#day-4").text(forecastFour.dt_txt)
    // $("#day-4").text(moment(forecastFour.dt_txt).format("L"))
    // $("#day-four-icon").attr("src", src4);
    // $("#temp-day-4").html(`Temp: ${convertKtoF(parseFloat(forecastFour.main.temp)).toFixed(2)}&deg;F`)
    // $("#humid-day-4").text(`Humidity:  ${forecastFour.main.humidity}%`)

    // day-five
    // $("#day-5").text(forecastFive.dt_txt)
//     $("#day-5").text(moment(forecastFive.dt_txt).format("L"))
//     $("#day-five-icon").attr("src", src5);
//     $("#temp-day-5").html(`Temp: ${convertKtoF(parseFloat(forecastFive.main.temp)).toFixed(2)}&deg;F`)
//     $("#humid-day-5").text(`Humidity:  ${forecastFive.main.humidity}%`)
}
function saveCityToLocalStorage(event){    
    event.preventDefault();
    // let text = $(this).parent("div").children(".form-control").val();
    // let time = $(this).parent("div").children(".time-block").text();
    let id = $(".list-group-item").attr("id");
    console.log(id)
    if(city === ""){
        alert("you have to write a valid city name")
        return           
    }
    else {               
        localStorage.setItem(id, city);               
    }            
}



$("#search-button").on("click", function(event){
    event.preventDefault();
    $(".card-deck").empty();

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

$(".list-group-flush").on("click", function(event){
    event.preventDefault();
    let element = $(this).text();
})
$(document).on("click", ".list-group-item", function(event){
    event.preventDefault();
    console.log($(this).text());
})
$(document).on("click", ".list-group-item", saveCityToLocalStorage)

// $(".list-group-item").on("click", function(event){
//     let element = event.target;
//     console.log(element)
// })