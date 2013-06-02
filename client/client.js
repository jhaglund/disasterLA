Meteor.startup(function(){
  var map, resources, concerns;
  Template.map.rendered = function(){
    map = L.map('map').setView([34.073546, -118.236773], 10)
    L.tileLayer('http://{s}.tile.cloudmade.com/'+ leaflet + '/997/256/{z}/{x}/{y}.png'
      , {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
          +'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © '
          +'<a href="http://cloudmade.com">CloudMade</a>'
        , maxZoom: 18}
    ).addTo(map)
  };//end Template.map.rendered

  //initialize the map with resources, continue watching for changes
  resources = Resource.find().observe(
    {
      added:function(doc){
        var latlng = new L.LatLng(doc.lat, doc.lng)
          , marker = L.marker(latlng, {title:doc.resource});
        marker.addTo(map)
        marker.bindPopup('<b>resource:</b> '+doc.resource)
        console.log('added resource', doc);
      }
      , changed:function(doc){
        //Do we need to cache the markers in an array to find and modify them?
        console.log('changed resource', doc);
      }
      , removed:function(doc){
        //Do we need to cache the markers in an array to find and remove them?
        console.log('removed resource', doc);
      }
    }
  );

  //initialize the map with resources, continue watching for changes
  concerns = Disaster.find().observe(
    {
      added:function(doc){
        var latlng = new L.LatLng(doc.lat, doc.lng)
          , marker = L.marker(latlng, {title:doc.concern});
        marker.addTo(map)
        marker.bindPopup('<b>concern:</b> '+doc.concern)
        console.log('added concern', doc);
      }
      , changed:function(doc){
        //Do we need to cache the markers in an array to find and modify them?
        console.log('changed concern', doc);
      }
      , removed:function(doc){
        //Do we need to cache the markers in an array to find and remove them?
        console.log('removed concern', doc);
      }
    }
  );
  
  
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
  var addpopup = function( content, latlon){
  }
  
  //this function generically handles resources or concerns
  map_resource_concern = function( res_o_con, address, thing){
    //build the address (hard coded city), and the get request data
    //FIXME doc is the document that will be saved to mongodb, so probs needs some schema work
    //i've read that the keys should be kept short, so maybe find/replace those at some point?
    var doc = {'address':''+ address+ ' Los Angeles, CA'
                , 'user':Meteor.user()
                }
      , data={'address':doc.address, 'sensor':'false'};
    doc[res_o_con] = thing;
    console.log('data',data);
    
    //retrieve latitude and longitude, zoom the map to there
    $.get('http://maps.googleapis.com/maps/api/geocode/json', data, function(data, status, xhr){
      var latlng, marker
        , popupcontent=''
        , markeropts={'title':doc[res_o_con]};
      if(data.status !== 'OK'){
        console.error(data, status, xhr);
        return;
      }
      //successfully looked up the address with google, put it on the map
      doc.lat = data.results[0].geometry.location.lat;
      doc.lng = data.results[0].geometry.location.lng;
      latlng = new L.LatLng(doc.lat, doc.lng);
      console.log('latlng', latlng);
      map.setView(latlng, 15);
      
      //FIXME -- client injection (doc[res_o_con] is unsafe user input)
      popupcontent='<b>'+res_o_con+':</b> '+doc[res_o_con]+'<div id="'+res_o_con+'-save-status"><div class="btn btn-info" id="'+res_o_con+'-save">Save</div></div>';
      marker = L.marker(latlng, markeropts)
      marker.addTo(map)
      marker.bindPopup(popupcontent).openPopup();
      
      //map now shows the resource on the map, with a 'save' button
      //handle the save click by writing it to the Resource collection
      $('#'+res_o_con+'-save').click(function(){
        //push the doc to the server
        if('resource' == res_o_con){
          Resource.insert( doc, function(e,id){ //callback
            console.log('inserted resource', e, id); 
          });
        }else{
          Disaster.insert( doc, function(e,id){ //callback
            console.log('inserted concern', e, id); 
          });
        }
        $('#'+res_o_con+'-save-status').html('Saved!');
      });
    }, 'json');
  }


  $('#geocode-resource').click(function(){
    map_resource_concern('resource', $('#resource-address')[0].value, $('#resource-name')[0].value);
  });//end geocode-resource click handler
  
  $('#geocode-concern').click(function(){
    map_resource_concern('concern', $('#concern-address')[0].value, $('#concern-name')[0].value);
  });//end geocode-concern click handler
  
});//end Meteor.startup

