/* jslint node:true */
"use strict";
var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({ io: new Edison() });
var moment = require("moment");

var wind;
var windspd =  [0x7E, 0x0A, 0xB6, 0x9E, 0xCA, 0xDC, 0xFC, 0x0E, 0xFE, 0xDE];
var i = 0;

board.on("ready", function () {
    wind = new five.ShiftRegister({ size: 3, 
                                   pins: { data: "J18-1", clock: "J18-7", latch: "J18-8", reset: "J17-5" }
                                  });
    
/*
    var value = 0;
    var fdirection = "East";
    if (fdirection == "East")          {dir = [0b11100000];}   // [0b00100000] [0x20]
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
*/                  
    var dir = [0b10000000,      // 0
               0b01000000,      // 1
               0b00100000,      // 2
               0b00010000,      // 3
               0b00001000,      // 4
               0b00000100,      // 5
               0b00000010,      // 6
               0b00000001];     // 7
    // var dir = [0xFF, 0xFE, 0xFC, 0xF8, 0xF0, 0xE0, 0xC0, 0x80];
    
    setInterval(function() {
        wind.send(dir[i], windspd[i], windspd[i]);
        console.log(" i " + i + " | value " + dir[i]);
        if (i < 7) i++;
        else i = 0;
    }, 1000);
});
