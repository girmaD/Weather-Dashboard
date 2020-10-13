// global variables
let today = moment();
let lat;
let lon;
let retrArr = JSON.parse(localStorage.getItem("city")) || "null";
let appid = "99686e16316412bc9b27bd9cb868d399";
let UVIndex;
// let displayedCity = JSON.parse(localStorage.getItem("displayedCity")) || "null";
let displayedCity = localStorage.getItem("displayedCity");
let lastCity =retrArr[retrArr.length - 1];


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
    $(".list-group-flush").empty();
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
    // fill the element containing id city-title with city name, date and imge that shows weather icon
    $("#city-title").html(`${city} (${today.format("L")}) <img src=${src}>`)    
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

//this function converts Kelvin to Farenheit
function convertKtoF(tempInKelvin) {    
    return ((tempInKelvin - 273.15) * 9 / 5 + 32);
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

// this function takes the last index in the retrArr and makes an ajax call
function renderCity(city) {
    // grap the last elemtn in the retrArr and call it lastCity    
    
    // the url to make weather ajax call
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}&q=${city}`;
    // the url to make a forecast ajax call
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&q=${city}`;
    // ajax call
    $.ajax({
        url: url, 
        method: "GET"
    })
    // if the ajax call fails - alert and return
    .fail(function () {
        alert("Not a valid city, try again.")        
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
// when the page loads - if displayedCity variable is available, run renderCity function by
// taking displayedCity variable
if(displayedCity){
    renderCity(displayedCity)
}

// listen to a click event on search button - push the text input value in to local-storage array and call renderCity function
$("#search-button").on("click", function(event){
    event.preventDefault();
    // empty the div that displays the 5-day forecast
    $(".card-deck").empty();
    // empty the ul elements that displays the list of cities searched
    $(".list-group-flush").empty();

    // grap the value from text input and call it city
    let city = $("#city-name").val().trim().toUpperCase();
    // === save city to local storage so that it can be used when page refreshed====
    if(city !== "") {
        displayedCity = city;
        localStorage.setItem("displayedCity", displayedCity)
    }    
    displayedCity = localStorage.getItem("displayedCity");
    //==========================
    // if a user enters empty string, alert and render the last city in the array and then return(dont save empty string)
    if(city === ""){
        alert("You have to enter a valid city name");       
        return;
    }
    // take out array saved in local storage with the key "city" and call it cityArr
    let cityArr = JSON.parse(localStorage.getItem("city"));
    // if cityArr is not found
    if (!cityArr) {
        // make cityArr and empty array
        cityArr = [];
        // push city in the cityArr array
        if(cityArr.indexOf(city) === -1){
            cityArr.push(city);
            // stringfy and store it in the local storage with "city" as a key
            localStorage.setItem("city", JSON.stringify(cityArr));
        }       
    }
    // if cityArr is found
    else {
        if(cityArr.indexOf(city) === -1){
            cityArr.push(city);
            // stringfy and store it in the local storage with "city" as a key
            localStorage.setItem("city", JSON.stringify(cityArr));
        }  
    }
    // grap from local storage, parse it and call it retrArr
    retrArr = JSON.parse(localStorage.getItem("city")) || "null";
    lastCity = retrArr[retrArr.length -1];
    // invoke renderCity function to run here
    renderCity(lastCity);         
})

// listening to a click on city lists
$(document).on("click", ".list-group-item", function(event){
    event.preventDefault();
   // empty the div that displays the 5-day forecast
    $(".card-deck").empty();
    // grab the value of the cliked list and call it clickedCity
    let clickedCity =  $(this).text();  
    // displayedCity.push(clickedCity); 
    displayedCity = clickedCity;   
    localStorage.setItem("displayedCity", displayedCity)
    displayedCity = localStorage.getItem("displayedCity");
    //Invoke renderCity function with a new clickedCity variable  
    renderCity(clickedCity) 
});

