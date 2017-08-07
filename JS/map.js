<script src="http://maps.googleapis.com/maps/api/js"></script>
 <script>
 var geocoder;
 var map;
 function initialize() 
 {
	 geocoder = new google.maps.Geocoder();
	 var latlng = new google.maps.LatLng(-34.397, 150.644);
	 var mapOptions = { zoom: 8, center: latlng }
	 map = new google.maps.Map(document.getElementById("MAP"), mapOptions);
	 codeAddress();
 }

 function codeAddress() 
 {
		 var address = $("#address").text();
		 geocoder.geocode( { 'address': address}, function(results, status) 
		 {
			 if (status == google.maps.GeocoderStatus.OK) 
			 {
				 map.setCenter(results[0].geometry.location);
				 var marker = new google.maps.Marker({ map: map,position: results[0].geometry.location});
			 } 
			 else 
			 {
				alert("Geocode was not successful for the following reason: " + status);
			 }
		});
 }