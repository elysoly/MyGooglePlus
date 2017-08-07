$(document).ready( displayResult);

var geocoder;
var map;
function initialize() {
	console.log("initialize");
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(-34.397, 150.644);
	var mapOptions = {
		zoom: 8,
		center: latlng
	}
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
	codeAddress();
}

function codeAddress() {
	var address = $('#address').text(); // $("#city").text();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
			console.log("success");
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

function loadXMLString(txt) 
{
if (window.DOMParser)
  {
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(txt,"text/xml");
  }
else // code for IE
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async=false;
  xmlDoc.loadXML(txt); 
  }
return xmlDoc;
}


function loadXMLDoc(filename)
{
if (window.XMLHttpRequest)
  {
  xhttp=new XMLHttpRequest();
  }
else // code for IE5 and IE6
  {
  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xhttp.open("GET",filename,false);
xhttp.send();
return xhttp.responseXML;
}

function displayResult() {
 $.ajax({
            type: "GET",
            url: "../index.php?profile=1",
            cache: false,
            async:false,
            // dataType: "xml",
            success: function (data) 
            {

             xml = loadXMLString(data);
             xsl = loadXMLDoc("../XSL/profile.xsl");
             console.log($(xml).text());
             if (document.implementation && document.implementation.createDocument) 
             {       

                xsltProcessor = new XSLTProcessor();
                xsltProcessor.importStylesheet(xsl);
                resultDocument = xsltProcessor.transformToFragment(xml, document);
                console.log(resultDocument);
                $('body').append(resultDocument);
                initialize();
             }

                console.log("test");




            }

        });
	
   
}




// $('.heading').click(
function edit()
{


$('input[readonly]').click(function () 
 {

  
     $(this).removeAttr('readonly');
  
 });



  $('input[readonly]').focusout(function()
   {
      var update=$(this).val();
      var x= $(this).attr("name");
     $(this).attr('readonly',true);
     $.post("../index.php?ProfileFeild="+x, { new_info:update } , function(data)
     {      
         console.log(data);  

       });

   }
   );



}



function pickapicture()
{

  console.log("testttt");
  $('#p_submit').click();
}