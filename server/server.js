Meteor.startup(function(){
  Meteor.publish(null, function(){
    return Resource.find().fetch();
  });
  Meteor.publish(null, function(){
    return Disaster.find().fetch();
  });
  //uncomment to purge db (DON'T DO THIS!)
  //Resource.remove({});
  //Disaster.remove({});
});
