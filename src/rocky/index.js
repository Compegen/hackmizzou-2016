// Rocky.js
var rocky = require('rocky');

// Global object to store weather data
var weather;

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

  // -20 so we're inset 10px on each side
  var maxLength = (Math.min(w, h) - 20) / 2;

  // Calculate the minute hand angle
  var minuteFraction = (d.getMinutes()) / 60;
  var minuteAngle = fractionToRadian(minuteFraction);

  // Draw the minute hand
  drawHand(ctx, cx, cy, minuteAngle, maxLength, 'white');

  // Calculate the hour hand angle
  var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
  var hourAngle = fractionToRadian(hourFraction);

  // Draw the hour hand
  drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, 'red');
});

function drawWeather(ctx, weather) {
  // Create a string describing the weather
  //var weatherString = weather.celcius + 'ºC, ' + weather.desc;
  var weatherString = weather.fahrenheit + 'ºF, ' + weather.desc;
  var clothingString;
  // Draw the text, top center
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '20px Gothic';
  ctx.fillText(weatherString, ctx.canvas.unobstructedWidth / 2, 2);

  var bounds = [ -15, 10, 35, 55, 65, 80, 95, 105, 115 ];
          //       0   1   2   3   4   5   6    7    8
   
  if (weather.fahrenheit<=bounds[0]) {
    clothingString="Stay Inside";
  }
  else if (weather.fahrenheit>bounds[0]&&weather.fahrenheit<=bounds[1]) {
    clothingString="Bundle Up";
  }
  else if (weather.fahrenheit>bounds[1]&&weather.fahrenheit<=bounds[2]) {
    clothingString="Winter Coat";
  }
  else if (weather.fahrenheit>bounds[2]&&weather.fahrenheit<=bounds[3]) {
    clothingString="Jeans & Hoodie";
  }
  else if (weather.fahrenheit>bounds[3]&&weather.fahrenheit<=bounds[4]) {
    clothingString="Jeans & T-Shirt";
  }
  else if (weather.fahrenheit>bounds[4]&&weather.fahrenheit<=bounds[5]) {
    clothingString="Shorts & T-Shirt";
  }
  else if (weather.fahrenheit>bounds[5]&&weather.fahrenheit<=bounds[6]) {
    clothingString="Shorts & Tank Top";
  }
  else if (weather.fahrenheit>bounds[6]&&weather.fahrenheit<=bounds[7]) {
    clothingString="Swimsuit";
  }
  else if (weather.fahrenheit>bounds[7]) {
    clothingString="Good Luck";
  }
  
  if (weather.desc=="Thunderstorm") {
    clothingString="Rain Jacket";
  }
  else if (weather.desc=="Drizzle") {
    clothingString="Rain Jacket";
  }
  else if (weather.desc=="Rain") {
    clothingString="Rain Jacket";
  }
  else if (weather.desc=="Snow") {
    clothingString="Winter Jacket";
  }
  else if (weather.desc=="Atmosphere") {
    
  }
  else if (weather.desc=="Clear"){
    
  }
  else if (weather.desc=="Extreme"){
    clothingString="Extreme Weather Alert";
  }
  
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
