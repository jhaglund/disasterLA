 
addOptions = ""

$('#add-a-resource').on 'click', (e) ->
  addOptions = "add a resource"


  $('.control_button').on 'click', (e) ->
    addOptions = ""
    $('.control_button').off 'click'

$('#add-a-concern').on 'click', (e) ->
  addOptions = "add a concern"

  $('.control_button').on 'click', (e) ->
    addOptions = ""
    $('.control_button').off 'click'




Meteor.startup ->
  console.log "client startup"

  Template.map.rendered = () ->
    map = L.map('map').setView([34.073546, -118.236773], 10)

    L.tileLayer 'http://{s}.tile.cloudmade.com/'+ leaflet + '/997/256/{z}/{x}/{y}.png', 
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
    .addTo(map)

    map.on 'click', (e) ->
      if addOptions == "add a resource"
        alert "add a resource"

      else if addOptions == "add a concern"
        alert "add a concern"
      else
        console.log "zoom"
    #  alert e.latlng 