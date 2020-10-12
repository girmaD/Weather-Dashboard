// global variables
let today = moment();
let lat;
let lon;
let retrArr = JSON.parse(localStorage.getItem("city")) || "null";;
let appid = "99686e16316412bc9b27bd9cb868d399";
let UVIndex;

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

// a function to update the DOM with current weather and cities searched
function updateLocationPage(location){       
    // take name property form location object
    let city = location.name;
    // take icon from weather array inside the location object
    let icon = location.weather[0].icon;   
    // use icon to create a url which will be src for an img element below 
    let src = `https://openweathermap.org/img/wn/${icon}.png`
    // loop through retrArr 
    for(let i = 0; i < retrArr.length; i++){
        // create a list elemtn with the class shown
        let liEl = $(`<li class='list-group-item'>`);
        //update the textContent of the list created with array elements
        liEl.text(retrArr[i]);
        // append it to the ul element containing list-group-flush class
        $(".list-group-flush").prepend(liEl);
    }
    // make the div contaning id main-body visible
    $("#main-body").removeClass("d-none");
    // $("#displayed-city").text(city);
    // $("#today-date").text(today.format("L"));
    // $("#icon-img").html(`<img src=${src}>`);
    // fill the element containing id city-title with city name, date and imge that shows weather icon
    $("#city-title").html(`<span id='displayed-city'>${city}</span> (${today.format("L")}) <img src=${src}>`)
    // convert temprature to farheniet and place it in the element containing id temp
    $("#temp").html(`Temprature: ${convertKtoF(parseFloat(location.main.temp)).toFixed(2)}&deg;F`)
    // humidity also placed in the DOM
    $("#humidity").text(`Humidity: ${location.main.humidity}%`)
    // wind speed also placed in the DOm
    $("#wind-speed").text(`Wind Speed: ${location.wind.speed}MPH`)

    // grap longtide and latitiude from location onject
    lon = location.coord.lon;
    lat = location.coord.lat;
    // using the lon and lat variables call buildUVIndexUrl function 
    let UVUrl = buildUVIndexUrl();
    // make ajax call
    $.ajax({
        url: UVUrl, 
        method: "GET"
    }).then(function(res){
        // get the UVindex
        UVIndex = res.value; 
        // update the DOM by invoking UpdateUVIndex function 
        UpdateUVIndex();        
    })
}
// this function updates the UVindex in the DOM and changes the color of the button 
// containing UV index depending on the calue of the UV index
function UpdateUVIndex(){
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
}
// this function does exactly the samething as updateLocationPage except here I dont need to loop through retrArr
// and fill the ul element. I only update the current weather and 5day forecase here.
function updatePage(location){       
    console.log(location)
    let city = location.name;
    let icon = location.weather[0].icon;    
    let src = `https://openweathermap.org/img/wn/${icon}.png`
         
    $("#main-body").removeClass("d-none");
    // $("#displayed-city").text(city);
    // $("#today-date").text(today.format("L"));
    // $("#icon-img").html(`<img src=${src}>`);
    $("#city-title").html(`<span id='displayed-city'>${city}</span> (${today.format("L")}) <img src=${src}>`)
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
        UpdateUVIndex();         
    })
}
//this function converts Kelvin to Farenheit
function convertKtoF(tempInKelvin) {    
    return ((tempInKelvin - 273.15) * 9 / 5 + 32);
}

// function to update the 5-day forecast html file
function updateForecastpage(forecast){
    // select the list array from the forcast object
    let listArr = forecast.list;
    
    let i = 5;
    // loop through listArr for every 8th index after starting on the 5th index
    while(i < listArr.length){
        let newForecast = listArr[i];
        i +=8;
        // grap icon
        let icon = newForecast.weather[0].icon;
        // use icon to assemble a src to be used in img tag later
        let src = `https://openweathermap.org/img/wn/${icon}.png`;        
        // create a div with the classes shown and call it cardCol   
        let cardCol = $('<div class="col-md-2 card pl-1 bg-primary">');
        // create a another div with the classes shown and call it cardCol   
        let cardBody = $('<div class="card-body p-0">');
        // create h5 and fill the text as shown here
        let h5El = $("<h5>").text(moment(newForecast.dt_txt).format("L"));
        // create img tag and make its source the src variable defined above
        let imgEl = $("<img>").attr("src", src);
        //create a p tag and fill its innerHTML as sown
        let p1El = $("<p>").html(`Temp: ${convertKtoF(parseFloat(newForecast.main.temp)).toFixed(2)}&deg;F`)
        // create an other p and fill the textContent as shown
        let p2El = $("<p>").text(`Humidity: ${newForecast.main.humidity}%`)
        // append the created html elements in the order shown and finally append them to the div that contains 
        // card-deck class
        cardBody.append(h5El);
        cardBody.append(imgEl);
        cardBody.append(p1El);
        cardBody.append(p2El);
        cardCol.append(cardBody);
        $(".card-deck").append(cardCol);        
    }
    // make the html element containing id 5d-forecast visible
    $("#5d-forecast").removeClass("d-none");    
}
// listen to a click event on search button - push the text input value in to local-storage array and call renderCity function
$("#search-button").on("click", function(event){
    event.preventDefault();
    // empty the div that displays the 5-day forecast
    $(".card-deck").empty();
    // empty the ul elements that displays the list of cities searched
    $(".list-group-flush").empty();

    // grap the value from text input and call it city
    let city = $("#city-name").val().trim();
    // take out array saved in local storage with the key "city" and call it cityArr
    let cityArr = JSON.parse(localStorage.getItem("city"));
    // if cityArr is not found
    if (!cityArr) {
        // make cityArr and empty array
        cityArr = [];
        // push city in the cityArr array
        cityArr.push(city);
        // stringfy and store it in the local storage with "city" as a key
        localStorage.setItem("city", JSON.stringify(cityArr));
    }
    // if cityArr is found
    else {
        // push city to the cityArr
        cityArr.push(city);
        // and stringfy and store it in the local storage with "city" as a key
        localStorage.setItem("city", JSON.stringify(cityArr));
    }
    // grap from local storage, parse it and call it retrArr
    retrArr = JSON.parse(localStorage.getItem("city")) || "null";
    // invoke renderCity function to run here
    renderCity();         
})
// this function takes the last index in the retrArr and makes an ajax call
function renderCity() {
    // grap the last elemtn in the retrArr and call it lastCity
    let lastCity = retrArr[retrArr.length - 1]
    // the url to make weather ajax call
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${lastCity}`;
    // the url to make a forecast ajax call
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${lastCity}`;
    // ajax call
    $.ajax({
        url: url, 
        method: "GET"
    })
    // the call back function is updateLocationPage
    .then(updateLocationPage)
     // ajax call
    $.ajax({
        url: forecastUrl, 
        method: "GET"
    })
     // the call back function is updateForecastpage
    .then(updateForecastpage)     
}

// function refreshPage() {
    // let retrArr = JSON.parse(localStorage.getItem("city")) || "null";
    // let lastCity = retrArr[retrArr.length - 1]
    // if($("#displayed-city").text()){
        // let lastCity = $("#displayed-city").text();
    // }    
    // console.log(lastCity);
//     let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${lastCity}`;
//     let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${lastCity}`;
//     $.ajax({
//         url: url, 
//         method: "GET"
//     }).then(updateLocationPage)
    
//     $.ajax({
//         url: forecastUrl, 
//         method: "GET"
//     }).then(updateForecastpage)     
// }
// console.log(retrArr.length)
// console.log(retrArr)

// run renderCity only if retrArr is not null. With no city given(empty local-storage) don't bother to make ajax call
if (retrArr !== "null" ){
    renderCity();     
}

// listening to a click on city lists
$(document).on("click", ".list-group-item", function(event){
    event.preventDefault();
   // empty the div that displays the 5-day forecast
    $(".card-deck").empty();
    // grab the value of the cliked list and call it clickedCity
    let clickedCity =  $(this).text();       
    // the url to make weather ajax call with clickedCity
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${clickedCity}`;
    // the url to make forecast ajax call with clickedCity
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${clickedCity}`;
    // ajax call
    $.ajax({
        url: url, 
        method: "GET"    
    })
    // the call back function is updatePage
    .then(updatePage)
    
    $.ajax({
        url: forecastUrl, 
        method: "GET"
    })
    // the call back function is updateForecastpage
    .then(updateForecastpage)    
});

