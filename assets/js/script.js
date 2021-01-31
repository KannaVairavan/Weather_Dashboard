
var searchBtnEl=document.getElementById("search-button");
var inputCityEl=document.getElementById("search-city");
var TemperatureEl=document.getElementById("temp");
var humidityEl=document.getElementById("humidity");
var windSpeedEl=document.getElementById("wind-speed");
var uvIndexEl=document.getElementById("uv-index");
var currentCityEl=document.getElementById("current-city");
var styleUV=document.querySelector(".style-uv");


console.log(inputCityEl.value.trim());
   
var key='21fcbf51cee9b6b8bc09bd26d3ff8386'
function getApi(cityID) {
    
    var requestUrl =  'https://api.openweathermap.org/data/2.5/weather?q=' + cityID + '&appid='+ key
    console.log(requestUrl);
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
       })
      .then(function (data) {
        
        // check status

        // console.log to examine the data
        console.log(data);
        var cityNameValue=data.name;
        var tempValue=data.main.temp;
        var temperatureFahrenheit = (tempValue - 273.15) * 1.8 +32;
        
        var windSpeedValue=(data.wind.speed) * 2.237;
        var iconValue=data.weather[0].icon;
        console.log("icon ", iconValue); 
        var dtValue=data.dt;
        var displaydate= new Date(dtValue * 1000).toLocaleDateString();
        console.log("date ", displaydate);
        console.log("temp ", temperatureFahrenheit);
        // icon is rendering from https://openweathermap.org/weather-conditions#How-to-get-icon-URL
        var iconSpace=document.createElement("img");
        iconSpace.setAttribute("src", 'https://openweathermap.org/img/wn/' + iconValue + '@2x.png');
        
        
        console.log(iconSpace);
        currentCityEl.innerHTML=cityNameValue + " (" + displaydate + ")" 
        currentCityEl.append(iconSpace) ;
        console.log(cityNameValue);
        TemperatureEl.innerText=temperatureFahrenheit.toFixed(2) + " °" + "F";
        humidityEl.innerText=data.main.humidity + "%";
        windSpeedEl.innerText=windSpeedValue.toFixed(1) + " MPH";
        console.log(data.coord.lat)
        uvindex(data.coord.lat, data.coord.lon);
        forecast(cityID);
       
      });
  }
  

  searchBtnEl.addEventListener("click", function(){
    console.log(inputCityEl.value.trim())
    if (inputCityEl.value.trim() !==""){
      
      // render weather info
      getApi(inputCityEl.value.trim());

    } else {
      alert ("Enter city name")
    }
    
  })

  function uvindex(lat, lon){
    var uvindexurl='http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + key
    fetch(uvindexurl)
    .then(function (response) {
      return response.json();
     })
    .then(function (data) {
      uvIndexEl.innerText=data.value;
      // apply class based on uv index
      if(data.value >=0 && data.value < 3){
        styleUV.classList.add ("favorable");
      }else if(data.value >= 3 && data.value < 6 ){
        styleUV.classList.add ("moderate");
      }else{
        styleUV.classList.add ("severe");
      }
      return data.value
      console.log("uv ", data)

    });
  }

  function forecast(cityID){
    var forecasturl='http://api.openweathermap.org/data/2.5/forecast?q=' + cityID + '&appid='+ key
    
    fetch(forecasturl)
    .then(function (response) {
      return response.json();
     })
    .then(function (data) {
      
      console.log("forecast ", data)

      // loop through 5 day forecast
      for(var i=0; i <= 5; i++ ){
        console.log(data.list[i].dt);
        var forcastdtEl=document.createElement("p");
        console.log("data i", i);
        var iIndex= ((i+1) * 8)-1
        console.log("data iIndex", iIndex);
        var forcastDtValue=data.list[iIndex].dt;
        var forcastdtDate= new Date(forcastDtValue * 1000).toLocaleDateString();
        console.log(forcastdtDate);
        forcastdtEl.textContent=forcastdtDate;
        var fcid="forecast" + i
        console.log(fcid);
        clearBox(fcid);
        var ForecastDiv=document.getElementById(fcid);
        // ForecastDiv.textContent="";
        ForecastDiv.appendChild(forcastdtEl);
        // append icon
        var fcIconValue=data.list[iIndex].weather[0].icon;
        var fcIcon=document.createElement("img");
        fcIcon.setAttribute("src", 'https://openweathermap.org/img/wn/' + fcIconValue + '@2x.png'); 
        ForecastDiv.appendChild(fcIcon);
        // append temp
        var forcastTempEl=document.createElement("p");
        var fcTemperatureFahrenheit = (data.list[iIndex].main.temp - 273.15) * 1.8 +32;
        forcastTempEl.textContent="Temp: " + fcTemperatureFahrenheit.toFixed(2) + " °" + "F" ;
        ForecastDiv.appendChild(forcastTempEl);
        // append Humidity
        var forcastHumidityEl=document.createElement("p");
        var fcTemperatureFahrenheit = (data.list[iIndex].main.temp - 273.15) * 1.8 +32;
        forcastHumidityEl.textContent="Humidity: " +  data.list[iIndex].main.humidity + "%";
        ForecastDiv.appendChild(forcastHumidityEl);
      }

    });
  }

  function clearBox(elementID) { 
    var div = document.getElementById(elementID); 
      
    while(div.firstChild) { 
        div.removeChild(div.firstChild); 
    } 
} 