



function getApi(cityID) {
    var key='21fcbf51cee9b6b8bc09bd26d3ff8386'
    var requestUrl =  'https://api.openweathermap.org/data/2.5/weather?q=' + cityID + '&appid='+ key
    console.log(requestUrl);
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
       })
      .then(function (data) {
        // console.log to examine the data
        

        
        console.log(data);
        var cityNameValue=data.name;
        var tempValue=data.main.temp;
        var temperatureFahrenheit = (tempValue - 273.15) * 1.8 +32;
        var humidityValue=data.main.humidity;
        var windSpeedValue=data.wind.speed;
        var iconValue=data.weather[0].icon;
        console.log("icon ", iconValue); 
        var dtValue=data.dt;
        var displaydate= new Date(dtValue * 1000).toLocaleDateString();
        console.log("date ", displaydate);
        console.log("temp ", temperatureFahrenheit);
        // icon is rendering from https://openweathermap.org/weather-conditions#How-to-get-icon-URL
        iconURL='http://openweathermap.org/img/wn/' + iconValue +'@2x.png'
        console.log("icon ", iconURL);            
      });
  }
  getApi("houston");

