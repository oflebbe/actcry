"use strict";

var makeBiergarten = function (pwd) {
    var BIERGARTEN_URI = "/bier";
    var gastro_list = [];

    function store_biergarten_list(lat, lon, rad) {
        return function () {
            // alert(window.location.hostname)

            fetch(BIERGARTEN_URI + "?longitude=" + lon + "&latitude=" + lat + "&radius=" + rad , {

            }).then( function( val) {
                return val.json();
            })
            .then(consume_list).catch(function (error) {
                console.log("error");
            });
        }
    }

    function consume_list(result, status) {
        for (var i = 0; i < result.TotalResults; i++) {
            var gastro = result.Items[i];
            if (gastro !== undefined) {
                console.log("Gastro", gastro.Latitude, gastro.Longitude, gastro.Shortname);
                gastro_list.push({'lat': gastro.Latitude, 'lon': gastro.Longitude, 'sn': gastro.Shortname, 'visited': false});
            }
        }
    }

    function coordinateDistance(cord1, cord2) {
        // https://www.movable-type.co.uk/scripts/latlong.html
        var R = 6371e3; // metres
        var φ1 = cord1.latitude * Math.PI / 180;
        var φ2 = cord2.latitude * Math.PI / 180;
        var Δφ = (cord2.latitude - cord1.latitude) * Math.PI / 180;
        var Δλ = (cord2.longitude - cord1.longitude) * Math.PI / 180;

        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = R * c;

        return d;
    }

    var numberOfPois = 0;
    var my_callback = undefined;


    var thus = {
        init: function (lat, lon, rad) {
            store_biergarten_list(lat, lon, rad)();
        },

        subscribe: function (callback) {
            my_callback = callback;
        },

        unsubscribe: function (callback) {
            my_callback = undefined;
        },

        add_position: function (lat, lon) {
            for (var i = 0; i < gastro_list.length; i++) {
                var d = coordinateDistance({'latitude': lat, 'longitude': lon},
                    {'latitude': gastro_list[i].lat, 'longitude': gastro_list[i].lon})

                if ((d < 100) && (gastro_list[i].visited === false)) {
                    numberOfPois += 1;
                    gastro_list[i].visited = true;
                    var value = {numberOfPois: numberOfPois, lastPoi: gastro_list[i].sn};
                    if (!(my_callback === undefined)) {
                        my_callback(value);
                    }
                }
            }
        }
    };
    return thus;
}
