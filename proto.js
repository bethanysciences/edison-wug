/* jslint node:true */
"use strict";
var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({ io: new Edison() });
var moment = require("moment");

var wind;
var windspd = [0x7E, 0x0A, 0xB6, 0x9E, 0xCA, 0xDC, 0xFC, 0x0E, 0xFE, 0xDE];
var winddir = [0x40, 0x02, 0x60, 0x20, 0x10, 0x08, 0x04, 0x01];
var i = 0;

board.on("ready", function () {
    wind = new five.ShiftRegister({ size: 3, 
                                   pins: { data: "J18-1", clock: "J18-7", latch: "J18-8", reset: "J17-5" }
                                  });
    // wind.send(winddir[0x00], windspd[0], windspd[0]);
    wind.send(winddir[0x10], windspd[5], windspd[2]);
});


/*
    var value = 0;
    var fdirection = "East";
    if (fdirection == "East")          {dir = [0x20];}
    else if (fdirection == "ENE")      {dir = [0x30];}
    else if (fdirection == "ESE")      {dir = [0x18];}
    else if (fdirection == "NE")       {dir = [0x40];}
    else if (fdirection == "NW")       {dir = [0x02];}
    else if (fdirection == "NNE")      {dir = [0xc0];}
    else if (fdirection == "NNW")      {dir = [0x81];}
    else if (fdirection == "North")    {dir = [0x80];}
    else if (fdirection == "SE")       {dir = [0x10];}
    else if (fdirection == "South")    {dir = [0x08];}
    else if (fdirection == "SSE")      {dir = [0x18];}
    else if (fdirection == "SSW")      {dir = [0x0c];}
    else if (fdirection == "SW")       {dir = [0x04];}
    else if (fdirection == "Variable") {dir = [0x00];}
    else if (fdirection == "West")     {dir = [0x02];}
    else if (fdirection == "WNW")      {dir = [0x03];}
    else if (fdirection == "WSW")      {dir = [0x06];}                  

    //          0  1   2   3  4   5  6  7  
    var dir = [96, 64, 1, 32, 16, 2, 4, 0];
           
    setInterval(function() {
        // wind.send(0x00, 0x00, 0x00);
        wind.send(dir[i], windspd[i], windspd[i]);
        console.log(" i " + i + " | value " + dir[i]);
        if (i < 7) i++;
        else i = 0;
    }, 1000);
});
*/


t().minutes() % 10],
                    clockseg[parseInt(moment().minutes() / 10)],
                    clockseg[moment().hours() % 10],
                    clockseg[parseInt(moment().hours() / 10)]
        );
    board.digitalWrite(0, 0);
}

function fetchWUG() {
    client.conditions(opts, function (err, now) {
        if (err) { console.time().tag('fetchWUG.conditions').log( 'Error on conditions fetch' ); return; } 
        else { 
            temp.print(Math.round(now.temp_f) + "F");
            var fdirection = now.wind_dir;
            if (fdirection == "East")          {dir = [0x20];}   // [00100000] 
            else if (fdirection == "ENE")      {dir = [0x30];}   // [00110000] 
            else if (fdirection == "ESE")      {dir = [0x18];}   // [00011000]
            else if (fdirection == "NE")       {dir = [0x40];}   // [01000000]
            else if (fdirection == "NW")       {dir = [0x02];}   // [00000010]
            else if (fdirection == "NNE")      {dir = [0xc0];}   // [11000000]
            else if (fdirection == "NNW")      {dir = [0x81];}   // [10000001]
            else if (fdirection == "North")    {dir = [0x80];}   // [10000000]
            else if (fdirection == "SE")       {dir = [0x10];}   // [00010000]
            else if (fdirection == "South")    {dir = [0x08];}   // [00001000]
            else if (fdirection == "SSE")      {dir = [0x18];}   // [00011000]
            else if (fdirection == "SSW")      {dir = [0x0c];}   // [00001100] 
            else if (fdirection == "SW")       {dir = [0x04];}   // [00000100] 
            else if (fdirection == "Variable") {dir = [0x00];}   // [00000000] 
            else if (fdirection == "West")     {dir = [0x02];}   // [00000010] 
            else if (fdirection == "WNW")      {dir = [0x03];}   // [00000011] 
            else if (fdirection == "WSW")      {dir = [0x06];}   // [00000110]
    
            wind.send(
                winddir[2],
                windspd[now.wind_mph%10], 
                windspd[parseInt(now.wind_mph/10)]
            );
            
            console.time().tag('fetchWUG.conditions').log(
                "Conditions at " + moment().format('HH:mm') +
                " | Curr temp: " + Math.round(now.temp_f) +
                "F | Wind " + now.wind_mph +
                "mph " + fdirection + " | dir " + dir
            );
        }
    });

    client.forecast(opts, function (err, fcst) {
        if (err) {console.time().tag('fetchWUG.forecast').log('Error on forecast fetch');return; } 
        else {
            var dispconds;
            var fconds = fcst.simpleforecast.forecastday[0].icon;
            if (fconds == "chanceflurries")     {
                dispconds = [0x0AA0, 0x0440, 0x0AA0, 0x0000, 0x0550, 0x0220, 0x0550, 0x0000];} 
            else if (fconds == "chancerain")    {
                dispconds = [0x0000, 0x0920, 0x0240, 0x0490, 0x0920, 0x0240, 0x0490, 0x0000];} 
            else if (fconds == "chancesleet")   {
                dispconds = [0x0AA0, 0x0440, 0x0AA0, 0x0000, 0x0550, 0x0220, 0x0550, 0x0000];} 
            else if (fconds == "chancesnow")    {
                dispconds = [0x0AA0, 0x0440, 0x0AA0, 0x0000, 0x0550, 0x0220, 0x0550, 0x0000];} 
            else if (fconds == "chancetstorms") {
                dispconds = [0x0020, 0x0040, 0x0088, 0x0110, 0x01B0, 0x00A0, 0x0120, 0x0200];} 
            else if (fconds == "clear")         {
                dispconds = [0x0000, 0x0000, 0x0000, 0x0000, 0xFFFF, 0x0000, 0x0000, 0x0000];} 
            else if (fconds == "cloudy")        {
                dispconds = [0xAAAA, 0x5555, 0xAAAA, 0x5555, 0xAAAA, 0x5555, 0xAAAA, 0x5555];} 
            else if (fconds == "flurries")      {
                dispconds = [0xAAAA, 0x4444, 0xAAAA, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];} 
            else if (fconds == "fog")           {
                dispconds = [0x0000, 0x5554, 0x2AAA, 0x5554, 0x2AAA, 0x5554, 0x2AAA, 0x0000];} 
            else if (fconds == "hazy")          {
                dispconds = [0x0000, 0x9249, 0x0000, 0x4924, 0x0000, 0x9249, 0x0000, 0x0000];} 
            else if (fconds == "mostlycloudy")  {
                dispconds = [0x3870, 0x468C, 0x8B14, 0x74E8, 0x1224, 0x0CD2, 0x1109, 0x0CDB];} 
            else if (fconds == "mostlysunny")   {
                dispconds = [0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];} 
            else if (fconds == "partlycloudy")  {
                dispconds = [0x383C, 0x4649, 0x8A42, 0x745E, 0x0220, 0x0000, 0x0000, 0x0000];} 
            else if (fconds == "partlysunny")   {
                dispconds = [0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];} 
            else if (fconds == "rain")          {
                dispconds = [0x0000, 0x4924, 0x9249, 0x2492, 0x4924, 0x9249, 0x2492, 0x0000];} 
            else if (fconds == "sleet")         {
                dispconds = [0xAAAA, 0x4444, 0xAAAA, 0x0000, 0x5555, 0x2222, 0x5555, 0x0000];} 
            else if (fconds == "snow")          {
                dispconds = [0xAAAA, 0x4444, 0xAAAA, 0x0000, 0x5555, 0x2222, 0x5555, 0x0000];} 
            else if (fconds == "sunny")         {
                dispconds = [0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];} 
            else if (fconds == "tstorms")       {
                dispconds = [0x3802, 0xC404, 0x8208, 0x4191, 0x4092, 0x2136, 0x1E24, 0x0048];}
            conds.draw(dispconds);
            low.print(Math.round(fcst.simpleforecast.forecastday[0].low.fahrenheit) + "F");
            high.print(Math.round(fcst.simpleforecast.forecastday[0].high.fahrenheit) + "F");
            console.time().tag('fetchWUG.forecast').log(
                "Forecast at " + moment().format('HH:mm') +
                " | " + fconds +
                " | Low: " + Math.round(fcst.simpleforecast.forecastday[0].low.fahrenheit) +
                "F | High: " + Math.round(fcst.simpleforecast.forecastday[0].high.fahrenheit) + "F"
            );
        }
    });
}