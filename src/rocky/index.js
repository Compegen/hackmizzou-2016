// Rocky.js
var rocky = require('rocky');

// Global object to store weather data
var weather;
var clothingString;
var colorScheme = "white";

//var minuteCounter = 0;
rocky.on('hourchange', function(event) {
	rocky.postMessage({'fetch': true});
  // Send a message to fetch the weather information (on startup and every hour)
// 	if(minuteCounter >= 15) {
// 		minuteCounter = 0;
// 		rocky.postMessage({'fetch': true});
	//}
 // minuteCounter++;
});

rocky.on('minutechange', function(event) {
  // Tick every minute
  rocky.requestDraw();
});

rocky.on('message', function(event) {
  // Receive a message from the mobile device (pkjs)
  var message = event.data;
  if (message.weather) {
    // Save the weather data
    weather = message.weather;

    // Request a redraw so we see the information
    rocky.requestDraw();
  }
});

rocky.on('draw', function(event) {
  var ctx = event.context;
  var d = new Date();
  
  d = d.toLocaleTimeString(undefined, {hour12: "false"});
  d = d.split(":");
  console.log(d);
  
  if(d[0] > 12) {
    d[0] = d[0] % 12;
    d[2] = "PM";
  }
  else if(d[0] < 12) {
    d[2] = "AM";
  }
  else {
    d[2] = "PM";
  }
  
  d = d[0] + ":" + d[1] + " " + d[2];

  // Clear the screen
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Draw the conditions (before clock hands, so it's drawn underneath them)
  if (weather) {
    drawWeather(ctx, weather);
  }

  // Determine the width and height of the display
  //var w = ctx.canvas.unobstructedWidth;
  //var h = ctx.canvas.unobstructedHeight;

  // Determine the center point of the display
  // and the max size of watch hands
  //var cx = w / 2;
  //var cy = h / 2;
  
  // Set the time text
  ctx.font = '30px bolder Bitham';
  ctx.fillStyle = 'white';

  // Center align the text
  ctx.textAlign = 'center';

  // Display the time, in the middle of the screen
  ctx.fillText(d, ctx.canvas.unobstructedWidth/2, ctx.canvas.unobstructedHeight/2-26, ctx.canvas.unobstructedWidth);
});

function drawWeather(ctx, weather) {
  
  ctx.fillStyle = colorScheme;
  ctx.textAlign = 'center';
  ctx.font = '24px Gothic';
  
  var bounds = [ -15, 10, 35, 55, 65, 80, 95, 105, 115 ];
          //       0   1   2   3   4   5   6    7    8
  
  //weather.desc = "Atmosphere";
  //weather.fahrenheit = 65;
  
  var temperatureString = weather.fahrenheit + ' ºF, ' + weather.desc;
  var conditionString = weather.desc;
  
  clothingString = checkTemperature(weather.fahrenheit, bounds); //Check temperature function for clothingString
  clothingString = checkCondition(weather.desc);                 //Check conditions function for clothingString
  
  ctx.fillText(clothingString, ctx.canvas.unobstructedWidth/2, ctx.canvas.unobstructedHeight - 50);
  
  ctx.fillText(temperatureString, ctx.canvas.unobstructedWidth / 2, 5);
  //ctx.fillText(conditionString, ctx.canvas.unobstructedWidth / 2, 30);
}

function checkTemperature(temp, bounds) {
  
  if (temp<=bounds[0]) {
    return "Stay Inside";
  }
  else if (temp>bounds[0]&&temp<=bounds[1]) {
    return "Bundle Up";
  }
  else if (temp>bounds[1]&&temp<=bounds[2]) {
    return "Winter Coat";
  }
  else if (temp>bounds[2]&&temp<=bounds[3]) {
    return "Jeans & Hoodie";
  }
  else if (temp>bounds[3]&&temp<=bounds[4]) {
    return "Jeans & T-Shirt";
  }
  else if (temp>bounds[4]&&temp<=bounds[5]) {
    return "Shorts & T-Shirt";
  }
  else if (temp>bounds[5]&&temp<=bounds[6]) {
    return "Shorts & Tank Top";
  }
  else if (temp>bounds[6]&&temp<=bounds[7]) {
    return "Swimsuit";
  }
  else if (temp>bounds[7]) {
    return "Good Luck";
  }
  return clothingString;
}

function checkCondition(desc) {
  
  if (desc=="Thunderstorm") {
    colorScheme ='#FFD800';
	return "Rain Jacket";
  }
  else if (desc=="Drizzle") {
    colorScheme ='#0000FF';
	return "Rain Jacket";
  }
  else if (desc=="Rain") {
    colorScheme ='#0000FF';
	return "Rain Jacket";
  }
  else if (desc=="Snow") {
	colorScheme ='#00FFFF';
    return "Winter Jacket";
  }
  else if (desc=="Atmosphere") {
    colorScheme ='#C1C1C1';
  }
  else if (desc=="Clear"){
	colorScheme ='#FFFFFF';
    
  }
  else if (desc=="Extreme"){
	colorScheme ='#FF0000';
    return "Extreme Weather Alert";
  }
  return clothingString;
}