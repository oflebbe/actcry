"use strict";

// Define constants

var touchInteractionEnabled = false;
var isPortrait = window.matchMedia('(orientation: portrait)').matches;

// Define getter and setters for saving and retrieving local storage variables or default variables

if (inEditMode && isPortrait) {
  // Override zoom when editing grid in portrait mode
  // we may need it later
}

if (!inEditMode) {
  // we may need it later
}

// Hook onto event that triggers on value change
function subscribeGridItem(definition) {
  var formatter = definition.formatter;
  var type = definition.type;

  definition.subscribe(function(value) {
      if ($.isNumeric(value)) {
          updateGridItem(definition, formatter(value));
      } else {
          updatePoiItem(definition, formatter(value.numberOfPois), value.lastPoi);

		  COBI.app.textToSpeech.write({content : "Grab a 🍺 in " + value.lastPoi, language : "en-US"});
		  presentSnackbar(value.lastPoi);
		  //var toast = value.lastPoi;
		  //M.toast({html: toast, displayLength: 5000, classes: "rounded"});
      }
  });
}

function updatePoiItem( definition, value, poiname) {
   $('#' + definition.id + ' .value').html(`${value}`);
   //$('#' + definition.id + ' .unit').html(`${poiname}`);
   definition.value = value;
  //  update_crystal(group, definitions);
}

function linkDefinition( definition) {
    $('#' + definition.id + " .label").html(definition.name);
    $('#' + definition.id + " .unit").html(definition.unit);
    $('#' + definition.id + " .value").html(definition.defaultValue);
    subscribeGridItem(definition);
}

function hookDefinitions() {
    linkDefinition(definitions[0]);
    linkDefinition(definitions[4]);
    linkDefinition(definitions[8]);
    linkDefinition(definitions[6]);
    linkDefinition(definitions[1]);
    linkDefinition(definitions[2]);
    linkDefinition(definitions[3]);

    var container = $('#tamagochi')
}

// Update dom element with values for item
function updateGridItem(definition, value) {
  $('#' + definition.id + ' .value').html(`${value}`);
   // update_crystal(group, definitions);

  definition.value = value;
}

function presentSnackbar(poi) {
    var x = document.getElementById("snackbar");
	x.innerHTML = "Grab a 🍺 in " + poi;

	x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
}

$(window).on('load', function(e) {

   var first_fix = false;
   /* var value = localStorage.getItem("testkey");
   if (value === null) {
       alert("setting");
       localStorage.setItem("testkey", "124823587295872958729857257295729857298752983579287592879879872958729358792587928759287592875928735927539257928735928759879879879879879879");
       alert("set");
   } else {
       alert(value);
   }
*/
   hookDefinitions();
   COBI.mobile.location.subscribe(function(value, timestamp) {
        if (!first_fix) {
            console.log( "FIX:", value.coordinate.latitude, value.coordinate.longitude)
            window.biergarten.init(value.coordinate.latitude, value.coordinate.longitude, 10000);
            first_fix = true;
        }
       window.biergarten.add_position(value.coordinate.latitude, value.coordinate.longitude)
    });

  crystal_init(definitions);
  crystal_animate();
    window.setInterval(function() {
        update_crystal(group, definitions);
    }, 1000);


});
