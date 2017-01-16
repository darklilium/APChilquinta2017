function login(user, pass, app, callback){


  const url = myLayers.read_generateTokenURL();

  const data = {
    username: user,
    password: pass,
    client: 'requestip',
    expiration: 1440,
    format: 'jsonp'
  };

  $.ajax({
    method: 'POST',
    url: url,
    data: data,
    dataType: 'html'
  })
  .done(myToken => {
    let json = JSON.parse(d);

    if(_.has(json,'Exception')) {
      return callback(false);
    }
    else{
      return callback(true);
    }

  })
  .fail(error => {
    console.log("You are not authorized ):", error);
    return callback(false, error)

  });
}
