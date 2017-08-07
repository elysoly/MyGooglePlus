$(".us").blur(function(){

var tempUsername=$(".us").val();
console.log(tempUsername);
 	
$('.usval').html('<img src="../images/ajax-loader.gif" />');
$.post("../index.php", {username_validation: tempUsername} , function(data)
	{			
			   if (data != '' || data != undefined || data != null) 
			   {				   
			   	 $('#Email').css("margin-bottom",0);
				  $('.usval').html(data);
				  console.log(data);	
			   }
          });



});


