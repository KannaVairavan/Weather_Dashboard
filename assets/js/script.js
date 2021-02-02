
var searchBtnEl=document.getElementById("search-button");
var inputCityEl=document.getElementById("search-city");
var TemperatureEl=document.getElementById("temp");
var humidityEl=document.getElementById("humidity");
var windSpeedEl=document.getElementById("wind-speed");
var uvIndexEl=document.getElementById("uv-index");
var currentCityEl=document.getElementById("current-city");

var styleUV=document.querySelector(".style-uv");
var cityListEl=document.querySelector(".cityList");
var errorCity=document.getElementById("error-city");
var clearList=document.getElementById("clear-list");
errorCity.style.display="none";
console.log(inputCityEl.value.trim());
var cityArray=[];

renderCity();

function cleardata(){
  

}
   
var key='21fcbf51cee9b6b8bc09bd26d3ff8386'
function getApi(cityID) {
    
    var requestUrl =  'https://api.openweathermap.org/data/2.5/weather?q=' + cityID + '&units=imperial&appid='+ key
    console.log(requestUrl);
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
        

        
       })
       
      .then(function (data) {
        // console.log to examine the data
        console.log(data.status);
        console.log("current data ", data)
        // check status
        if(data.cod==="404"){
          // clear data
          // request correct city name
          errorCity.style.display="block";
          errorCity.innerHTML="Enter correct city name"
          return;
        }
         
        

        var cityNameValue=data.name;
        var tempValue=data.main.temp;
        var temperatureFahrenheit = (tempValue) /* - 273.15) * 1.8 +32;*/
        
        var windSpeedValue=(data.wind.speed) /* 2.237; */
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
        windSpeedEl.innerText=windSpeedValue.toFixed(2) + " MPH";
        console.log(data.coord.lat)
        uvindex(data.coord.lat, data.coord.lon);
        forecast(data.coord.lat, data.coord.lon);
        SaveCity(cityID);
       
      });
  }
  

  

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

  function forecast(lat, lon){
    var forecasturl='https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ lon + '&exclude=hourly&units=imperial&appid='+ key

    // var forecasturl='http://api.openweathermap.org/data/2.5/onecall?=' + cityID + '&appid='+ key
    // 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityID + '&appid='+ key
    
    fetch(forecasturl)
    .then(function (response) {
      return response.json();
     })
    .then(function (data) {
      
      console.log("forecast ", data)

      // loop through 5 day forecast
      for(var i=1; i <= 5; i++ ){
        console.log(data.daily[i].dt);
        var forcastdtEl=document.createElement("p");
        console.log("data i", i);
        var iIndex=i;
        //  var iIndex= ((i+1) * 8)-1
        // console.log("data iIndex", iIndex);
        // console.log(data.list[iIndex]);
        // console.log(data.list[iIndex].dt);
        var forcastDtValue=data.daily[i].dt;
        
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
        var fcIconValue=data.daily[i].weather[0].icon;
        var fcIcon=document.createElement("img");
        fcIcon.setAttribute("src", 'https://openweathermap.org/img/wn/' + fcIconValue + '@2x.png'); 
        ForecastDiv.appendChild(fcIcon);
        // append temp
        var forcastTempEl=document.createElement("p");
        var fcTemperatureFahrenheit = (data.daily[i].temp.day) /*- 273.15) * 1.8 +32; */
        forcastTempEl.textContent="Temp: " + fcTemperatureFahrenheit.toFixed(2) + " °" + "F" ;
        ForecastDiv.appendChild(forcastTempEl);
        // append Humidity
        var forcastHumidityEl=document.createElement("p");
        
        forcastHumidityEl.textContent="Humidity: " +  data.daily[i].humidity + "%";
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

function SaveCity(cityID){
          var cityArray=[];
          var searchCity = {
              city : cityID,
                      };
          var cityArray = JSON.parse(localStorage.getItem("cityName") || "[]");
          // var found = cityArray.some(ele => ele.city === cityID);
          
          // console.log("found ",found)            
    
          cityArray.push(searchCity);
          localStorage.setItem("cityName", JSON.stringify(cityArray));
    
}

var cityArray=[];

function renderCity(){
  if (localStorage.cityName){
    var cityArray = JSON.parse(localStorage.getItem("cityName"));
    console.log(cityArray.length);
    for(var i=0; i < cityArray.length; i++){
     
        console.log(cityArray[i].city);
        var liCityEl = document.createElement('button');
        liCityEl.type = 'button';
        liCityEl.classList.add("list-group-item");
        liCityEl.classList.add("list-group-item-action");
        liCityEl.textContent = cityArray[i].city;
        cityListEl.appendChild(liCityEl);
        
    }
  }
}
searchBtnEl.addEventListener("click", function(){
  cleardata();
  errorCity.style.display="none";
  console.log(inputCityEl.value.trim())
  if (inputCityEl.value.trim() !==""){
    
    // render weather info
    getApi(inputCityEl.value.trim());
    

  } else {
    errorCity.style.display="block";
    errorCity.innerHTML="Enter city name"
  }
  
})

cityListEl.addEventListener("click",function(event){
  // render weather info
 
  var element = event.target;
  if (element.matches("button") === true) {
    errorCity.style.display="none";
    var cityListID=element.textContent;
    console.log(cityListID);
    getApi(cityListID);
  }
  
  
  
})
clearList.addEventListener("click", function(){
  var cityArray=[];
  localStorage.setItem("cityName", JSON.stringify(cityArray));

})