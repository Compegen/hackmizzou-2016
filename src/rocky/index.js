// Rocky.js
var rocky = require('rocky');

// Global object to store weather data
var weather;
var clothingString;

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

  // Clear the screen
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Draw the conditions (before clock hands, so it's drawn underneath them)
  if (weather) {
    drawWeather(ctx, weather);
  }

  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Determine the center point of the display
  // and the max size of watch hands
  var cx = w / 2;
  var cy = h / 2;
  
  // Set the text color
  ctx.fillStyle = 'white';

  // Center align the text
  ctx.textAlign = 'center';

  // Display the time, in the middle of the screen
  ctx.fillText(d.toLocaleTimeString(), cx, cy, w);
});

function drawWeather(ctx, weather) {
  // Create a string describing the weather
  //var weatherString = weather.celcius + 'ºC, ' + weather.desc;
  var weatherString = weather.fahrenheit + 'ºF, ' + weather.desc;
  
  // Draw the text, top center
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '20px Gothic';
  ctx.fillText(weatherString, ctx.canvas.unobstructedWidth / 2, 2);

  var bounds = [ -15, 10, 35, 55, 65, 80, 95, 105, 115 ];
          //       0   1   2   3   4   5   6    7    8
  
  clothingString = checkTemperature(weather.fahrenheit, bounds); //Check temperature function for clothingString
  clothingString = checkCondition(weather.desc);                 //Check conditions function for clothingString
  
  ctx.fillText(clothingString, ctx.canvas.unobstructedWidth/2,20);
}

function drawHand(ctx, cx, cy, angle, length, color) {
  // Find the end points
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  // Configure how we want to draw the hand
  ctx.lineWidth = 8;
  ctx.strokeStyle = color;

  // Begin drawing
  ctx.beginPath();

  // Move to the center point, then draw the line
  ctx.moveTo(cx, cy);
  ctx.lineTo(x2, y2);

  // Stroke the line (output to display)
  ctx.stroke();
}

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
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
    return "Rain Jacket";
  }
  else if (desc=="Drizzle") {
    return "Rain Jacket";
  }
  else if (desc=="Rain") {
    return "Rain Jacket";
  }
  else if (desc=="Snow") {
    return "Winter Jacket";
  }
  else if (desc=="Atmosphere") {
    
  }
  else if (desc=="Clear"){
    
  }
  else if (desc=="Extreme"){
    return "Extreme Weather Alert";
  }
  return clothingString;
}