// Objet Google Map

function initMap(){
      // Map options
      var options = {
        zoom:13,
        center:{lat:45.764,lng:4.835},
        scrollwheel: true
      }

      // New map
      var map = new google.maps.Map(document.getElementById('map'), options);


      // Array of markers
      var markerstest = [
        {
          coords: {lat:45.788,lng:4.83},
          iconImage:'http://webagency.kevincadier.fr/images/marker.png',
          content:'<h1>Test</h1>'
        },
        {
          coords:{lat:45.758,lng:4.8},
          iconImage:'http://webagency.kevincadier.fr/images/marker.png',
          content:'<h1>Test2</h1>'
        },
      ];

      // Loop through markers
      for(var i = 0;i < markerstest.length;i++){
        // Add marker
        addMarker(markerstest[i]);
      }

      // Add Marker Function
      function addMarker(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          map:map,
          //icon:props.iconImage
        });

        // Check for customicon
        if(props.iconImage){
          // Set icon image
          marker.setIcon(props.iconImage);
        }

        // Check content
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });
        }
      }
    }


    // Objet API JCDECEAUX



    window.onload = function(){

      var http = new XMLHttpRequest();
      var data;

      // je m'assure d'utiliser que les données qui sont prêtes et valides

      http.onreadystatechange = function(){
        if(http.readyState == 4 && http.status == 200){
          data = JSON.parse(http.response);
          console.log('résultat de la requête XHR');
          console.log(data);
          
          data.forEach(function(station){
            console.log(station);

          })
          


        }
      };

      console.log('début de la page');

      // Requête XHR asynchrone

      http.open("GET", "https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=fa9832e5de05b90c18bbf6cd5ccb0f24676f2fa7", true);
      http.send();

      console.log('fin de la page');

    }

  