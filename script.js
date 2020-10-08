// global variables


function buildLocationUrl(){
    let url = "http://api.openweathermap.org/data/2.5/weather?";
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
// let url = "http://api.openweathermap.org/data/2.5/weather?q=seattle&"
// $.ajax({
//     url: buildForecastUrl(), 
//     method: "GET"
// }).then(function(response){
//     console.log(response);
// })

function updateLocationPage(){   
    let city = $("#city-name").val(); 
    console.log(city)
    let liEl = $("<li class='list-group-item'>");
    // liEl.addClass("list-group-item");
    liEl.text(city);
    $(".list-group-flush").append(liEl)
}

$("#search-button").on("click", updateLocationPage())