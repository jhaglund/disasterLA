Meteor.startup(function(){
  var map;
  Template.map.rendered = function(){
    map = L.map('map').setView([34.073546, -118.236773], 10)
    L.tileLayer('http://{s}.tile.cloudmade.com/'+ leaflet + '/997/256/{z}/{x}/{y}.png'
      , {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
          +'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © '
          +'<a href="http://cloudmade.com">CloudMade</a>'
        , maxZoom: 18}
    ).addTo(map)
  };//end Template.map.rendered
  
  //click handlers for add add-a-resource or add-a-concern
  //hide the other input, show the input whose button was clicked
  $('#add-a-resource').click(function(){
    $('#concern-input').hide();
    $('#resource-input').show();
  });
  $('#add-a-concern').click(function(){
    $('#resource-input').hide();
    $('#concern-input').show();
  });
  
  $('#geocode-resource').click(function(){
    //build the address (hard coded city), and the get request data
    var res = {'address':''+ $('#resource-address')[0].value+ ' Los Angeles, CA'
                , 'resource':''+ $('#resource-name')[0].value}
      , data={'address':res.address, 'sensor':'false'};
    console.log('data',data);
    
    //retrieve latitude and longitude, zoom the map to there
    $.get('http://maps.googleapis.com/maps/api/geocode/json', data, function(data, status, xhr){
      var latlng, marker
        , popupcontent=''
        , markeropts={'title':res.resource};
      if(data.status !== 'OK'){
        console.error(data, status, xhr);
        return;
      }
      //successfully looked up the address with google, put it on the map
      latlng = new L.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
      console.log('latlng', latlng);
      map.setView(latlng, 15);
      
      //FIXME -- client injection (res.resource is unsafe user input)
      popupcontent='<b>Resource:</b> '+res.resource+'<div id="resource-save-status"><div class="btn btn-info" id="resource-save">Save</div></div>';
      marker = L.marker(latlng, markeropts)
      marker.addTo(map)
      marker.bindPopup(popupcontent).openPopup();
      
      //map now shows the resource on the map, with a 'save' button
      //handle the save click by writing it to the Resource collection
      $('#resource-save').click(function(){
        //push the resource to the server
        Resource.insert( res, function(e,id){ //callback
          console.log('inserted', e, id); 
        });
      });
    }, 'json');
  });//end geocode-resource click handler
  
});//end Meteor.startup

