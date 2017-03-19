/* jslint node:true */
"use strict";
var scribe = require('scribe-js')(),
    console = process.console,
    express = require('express'),
    app = express();
var fs = require('fs');
var wugkey = fs.readFileSync('/home/wugapikey');
var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
    io: new Edison()
});
var board = new Edison({
    i2c: {
        bus: 1
    }
});
var moment = require("moment");
var Wunderground = require('wunderground-api');
var client = new Wunderground(wugkey);
var opts = {
    city: 'PDK',
    state: 'GA'
};

app.use('/logs', scribe.webPanel());
app.listen(8080);
console.time().tag('main').log('log at http://radical.local:8080/logs');

var led, temp, low, high, conds;
var digit = [0x7e, 0x0c, 0xb6, 0x9e, 0xcc, 0xda, 0xfa, 0x0e, 0xfe, 0xde, 0x00];

board.on("ready", function () {
    led = new five.ShiftRegister(["J18-2", "J20-7", "J17-1"]);
    //  wind = new five.ShiftRegister ([ "J18-2", "J20-7", "J17-1"]);
    temp = new five.Led.Digits({
        addresses: [0x71],
        controller: "HT16K33",
    });
    low = new five.Led.Digits({
        addresses: [0x72],
        controller: "HT16K33",
    });
    high = new five.Led.Digits({
        addresses: [0x77],
        controller: "HT16K33",
    });
    conds = new five.Led.Matrix({
        addresses: [0x70],
        controller: "HT16K33",
        dims: "8x16",
        rotation: 2
    });
    clckdspy();
    fetchWUG();
});

setInterval(MinuteTick, 1000);
setInterval(HourTick, 1000);

function MinuteTick() {
    var now = new Date().getMinutes();
    if (now > MinuteTick.prevTime) {
        clckdspy();
    }
    MinuteTick.prevTime = now;
}

function HourTick() {
    var now = new Date().getHours();
    if (now > HourTick.prevTime) {
        fetchWUG();
    }
    HourTick.prevTime = now;
}

function clckdspy() {
    board.digitalWrite(0, 1);
    led.send(digit[moment().minutes() % 10],
        digit[parseInt(moment().minutes() / 10)],
        digit[moment().hours() % 10],
        digit[parseInt(moment().hours() / 10)]
    );
    board.digitalWrite(0, 0);
}

function fetchWUG() {
    client.conditions(opts, function (err, now) {
        if (err) {
            console.time().tag('fetchWUG.conditions').log(
                'Error on conditions fetch'
            );
            return;
        } else {
            temp.print(Math.round(now.temp_f) + "F");
            //      board.digitalWrite(0, 1);
            //      wind.send (digit[now.wind_mph%10],
            //                 digit[parseInt(now.wind_mph/10)]);
            //      board.digitalWrite(0, 0);
            var direction;
            var fdirection = now.wind_dir;
            if (fdirection == "East") {
                direction = [0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "ENE") {
                direction = [0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "ESE") {
                direction = [0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "NE") {
                direction = [0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "NW") {
                direction = [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "NNE") {
                direction = [0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "NNW") {
                direction = [0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "North") {
                direction = [0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "SE") {
                direction = [0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "South") {
                direction = [0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "SSE") {
                direction = [0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "SSW") {
                direction = [0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "SW") {
                direction = [0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "Variable") {
                direction = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "West") {
                direction = [0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "WNW") {
                direction = [0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            } else if (fdirection == "WSW") {
                direction = [0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            }
            //      dir.print (now.wind_dir);
            console.time().tag('fetchWUG.conditions').log(
                "Conditions at " + moment().format('HH:mm') +
                " | Curr temp: " + Math.round(now.temp_f) +
                "F | Wind " + now.wind_mph +
                "mph " + fdirection
            );
        }
    });

    client.forecast(opts, function (err, fcst) {
        if (err) {
            console.time().tag('fetchWUG.forecast').log(
                'Error on forecast fetch'
            );
            return;
        } else {
            var dispconds;
            var fconds = fcst.simpleforecast.forecastday[0].icon;
            if (fconds == "chanceflurries") {
                dispconds = [0x0AA0, 0x0440, 0x0AA0, 0x0000, 0x0550, 0x0220, 0x0550, 0x0000];
            } else if (fconds == "chancerain") {
                dispconds = [0x0000, 0x0920, 0x0240, 0x0490, 0x0920, 0x0240, 0x0490, 0x0000];
            } else if (fconds == "chancesleet") {
                dispconds = [0x0AA0, 0x0440, 0x0AA0, 0x0000, 0x0550, 0x0220, 0x0550, 0x0000];
            } else if (fconds == "chancesnow") {
                dispconds = [0x0AA0, 0x0440, 0x0AA0, 0x0000, 0x0550, 0x0220, 0x0550, 0x0000];
            } else if (fconds == "chancetstorms") {
                dispconds = [0x0020, 0x0040, 0x0088, 0x0110, 0x01B0, 0x00A0, 0x0120, 0x0200];
            } else if (fconds == "clear") {
                dispconds = [0x0000, 0x0000, 0x0000, 0x0000, 0xFFFF, 0x0000, 0x0000, 0x0000];
            } else if (fconds == "cloudy") {
                dispconds = [0xAAAA, 0x5555, 0xAAAA, 0x5555, 0xAAAA, 0x5555, 0xAAAA, 0x5555];
            } else if (fconds == "flurries") {
                dispconds = [0xAAAA, 0x4444, 0xAAAA, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];
            } else if (fconds == "fog") {
                dispconds = [0x0000, 0x5554, 0x2AAA, 0x5554, 0x2AAA, 0x5554, 0x2AAA, 0x0000];
            } else if (fconds == "hazy") {
                dispconds = [0x0000, 0x9249, 0x0000, 0x4924, 0x0000, 0x9249, 0x0000, 0x0000];
            } else if (fconds == "mostlycloudy") {
                dispconds = [0x3870, 0x468C, 0x8B14, 0x74E8, 0x1224, 0x0CD2, 0x1109, 0x0CDB];
            } else if (fconds == "mostlysunny") {
                dispconds = [0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];
            } else if (fconds == "partlycloudy") {
                dispconds = [0x383C, 0x4649, 0x8A42, 0x745E, 0x0220, 0x0000, 0x0000, 0x0000];
            } else if (fconds == "partlysunny") {
                dispconds = [0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];
            } else if (fconds == "rain") {
                dispconds = [0x0000, 0x4924, 0x9249, 0x2492, 0x4924, 0x9249, 0x2492, 0x0000];
            } else if (fconds == "sleet") {
                dispconds = [0xAAAA, 0x4444, 0xAAAA, 0x0000, 0x5555, 0x2222, 0x5555, 0x0000];
            } else if (fconds == "snow") {
                dispconds = [0xAAAA, 0x4444, 0xAAAA, 0x0000, 0x5555, 0x2222, 0x5555, 0x0000];
            } else if (fconds == "sunny") {
                dispconds = [0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000];
            } else if (fconds == "tstorms") {
                dispconds = [0x3802, 0xC404, 0x8208, 0x4191, 0x4092, 0x2136, 0x1E24, 0x0048];
            }
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