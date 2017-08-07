$(document).ready( displayResult);


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
            url: "../index.php?viewmore=1",
            cache: false,
            async:false,
            // dataType: "xml",
            success: function (data) 
            {

             xml = loadXMLString(data);
             xsl = loadXMLDoc("../XSL/VeiwMore.xsl");
             console.log($(xml).text());
             if (document.implementation && document.implementation.createDocument) 
             {       

                xsltProcessor = new XSLTProcessor();
                xsltProcessor.importStylesheet(xsl);
                resultDocument = xsltProcessor.transformToFragment(xml, document);
                console.log(resultDocument);
                $('body').append(resultDocument);
             }

                console.log("test");




            }

        });
	
   
	
	}


 function advancedSearch()
 {
 
  var user =$('.search-bar').val();
  if(user!="")
  $.post("../index.php", { AdvancedsearchAbuddy: user} , function(data)
  {     
         
    console.log(data);  
    $('.search-result').remove();
      $( data).insertAfter('.nav' );
     var w= $('.search-bar').width();
     console.log(w);
     w+=(0.02 *w);
     $('.search-result').width(w);

    });


 }


 function hideResult() 
{
  console.log("blur");
  $('.search-result').remove();


}