var posts = {};
var post_index = 0;
var BigItemNumber =0;
var ColNumber=0;
var PLNO =1;
var isliked={};
var realcm=0 ,reallikenumber=0;
var CLC,CRC,CCC;
//post attr
var author="";//string
var tags = {},proPicURL="",date="";
var imageRef="",share= 0,text="",cmnumber=0,cmlinks="",likenumber=0;//liker
var imageLikers={};
//cm attr
var cmImage={},cmtext={},cmdate={},
    cmreply={},cmname={};
var pageOwner="guest";

$(document).ready( Loading(PLNO));

function hideResult() 
{
	console.log("blur");
	$('.search-result').remove();


}

setInterval(function()
{ 
	//alert("hh");
	var temp_posts={};
    $.ajax({
        type: "GET",
        url: "../index.php?UpdatePost=1",
        cache: false,
        async:false,
      // dataType: "xml",
        success: function (xml) 
        {
        	var index=0;
            $(xml).find("post").each(
                function () 
                {
                  temp_posts[index]=$(this);
    			  index++;                         
                }  
            );
            post_index+=index;
            PLNO=post_index;
            // console.log(post_index + "!!!");
            if(index>0)shift_posts(index , temp_posts);
            
        }

           
        });
    

}, 30002);

function shift_posts(d , shift)
{
	console.log(d+"hh");
	for (var i = post_index-1 ; i >= d ; i--)
	 {
	   posts[i]=posts[i-d];
	   // console.log($(posts[i]).html());
	};
	for (var i = 0; i < d; i++)
	 {
	   posts[i]=shift[i];//b tartib awal jadida mian 

	   // console.log($(posts[i]).html());
	};
 $('.base').empty();
	buildPost(PLNO);
	
}

function Loading(num){
	
	var URL = $(location).attr('href');
	var x=URL.split('?');
	if(x[1]) pageOwner=x[1];
	else if(getCookie("username")) pageOwner=getCookie("username");
	console.log(pageOwner);
	$('#pageowner').html(pageOwner);
        $.ajax({
            type: "GET",
            url: "../index.php?postXML=1",
            cache: false,
            async:false,
          //  dataType: "xml",

            success: function (xml) {

                   		console.log((xml));
	                    $(xml).find("post").each(
	                        function () {

	                            if (post_index <= PLNO)
	                            {

	                              posts[post_index]=$(this);
				    			  post_index++;
	                            }

	                            if (post_index == PLNO)  buildPost(PLNO);
	                            

	                        }  
	                    );
					
            }

            ,error: function(jqXHR, textStatus, errorThrown)
			 {
			 // Handle errors here
			 console.log('ERRORS: ' + textStatus);
			 // STOP LOADING SPINNER
			 }
        });


}

function getpost(posturl , i)
{
  //  fetchPostInfo(i);
  if(localStorage.getItem(i)==null)
  {
      $.ajax({
          type: "GET",
          url: "reader.php?address=" + posturl,
          cache: false,
          async:false,
          dataType: "xml",
          success: function (xml) {

              localStorage.setItem(i,xmlToString(xml));
              posts[i]=xml;
			  post_index++;

          }
      });

  }
  else
  {

      var xmlDoc = jQuery.parseXML(localStorage.getItem(i));
      posts[i]=xmlDoc;
	  post_index++;


  }


};

function createBigItem(n){
					
    var bigdiv=
		"<div class='clmbig'> " +
			"<div class='inside' id="+ n+">"+
				"<span class='picturebox bigbox'>"+
					" <span class='bigpic'> <img  class='picture'  src='"+imageRef +"' />  </span>"+
				"</span>"+
				"<div class=' postowner bigbox' style='width:35% ' >"+
					"<div style='margin-bottom: 0.5%; border:groove 1px azure''> "+
						"   <img  class='postownerimage' src='" + proPicURL +"' />"+
						"<b style='margin-bottom:5%;'>"+author+"</b>"+
					
						"<div class='time' style='margin-bottom:2%'><!--TimeStamp-->"+date+ " </div>"+

					"</div>"+

					"<div class='bigtext '>"+text;
				if(tags!=null)
				{
					tags=tags.split('#');
					for(var z=1;z< $(tags).length ;z++)
					{
						var t=$(tags).get(z);
						t=t.toString();
							bigdiv= bigdiv+ "<span class='tag' onclick=showtag('"+t+"')> #" + t + "</span>" ;
					}
				}
			
					bigdiv=bigdiv+"</div>"+
					"<div id='mybigcm'>"+
					"<div class='commentbox ' >";

					if(cmnumber!=0)
					{
						var size=1;
		bigdiv=bigdiv+ "<div class='commentcount' onclick=showcomment("+n+","+size+")>"+cmnumber+" commnets <img src='../images/Home%20Pic/13.PNG' /> </div>";
						for(var i=0 ; i<= Math.min(realcm-1 ,1);i++) {
							bigdiv = bigdiv +
							"<div class='acomment'>" +
								"<div class='acommentpicturebox'>" +
									"<img class='acommentpicture' src='" + $((cmImage)[i]).text() + "' />" +
								"</div>" +

								"<div class='acommenttext'>" +
									"<span class='text'>" +$((cmname)[i]).text()+ "</span>" +
									"<br />" +
									"<span class='text'>" + $((cmdate)[i]).text() + "</span>" +
									"<p class='ws' style='margin:0px' >" + $((cmtext)[i]).text() + "</p>"
								"</div>";
						}
					}
					bigdiv=bigdiv+"<input style='margin'   class='anewcomment' id='anewcomment"+n+"' onkeypress=enter(event,"+ n +") placeholder='Add a comment...' />"+
							"</div>"+
						"</div>"+
					"</div>"+
					"</div>"+
				"</div>" ;

	
	
    return bigdiv;

};


function createOrdinaryItem(number){

    if(cmnumber==null)cmnumber=0;
    if(share==null)share=0;
    if(likenumber==null)likenumber=0;


    var div=
        " <div class='item' id="+ number+">" +
			"<div class='inside'>"+
				"<div class='postowner'>"+
					"<div class='postownerdetail postownerdetail1'>"+
						"<img class='postownerimage' src='" +proPicURL+ "'/>"+
					"</div>"+

					"<div class='postownerdetail postownerdetail2'> <b><!--SomeCoolName:-->"+author+ " </b> <br />"+
					"<span class='time'>"+date+"</span>"+
					"</div>"+

					"<div class='postownerdetail postownerdetail3'>"+
						" <div class='addbox' onclick=report("+number+") ><img src='../images/Home%20Pic/report.jpg' /></div>" +
					"</div>"+

				"</div>"+//end of postowner

				"<p><span class='text' >"+"<input type='text' class='posttext' onclick=editPost("+number+") readonly value='"+text+"'>";
				if(tags!=null)
				{
					tags=tags.split('#');
					for(var z=1;z< $(tags).length ;z++)
					{
						var t=$(tags).get(z);
						t=t.toString();
							div= div+ "<span class='tag' onclick=showtag('"+t+"')> #" + t + "</span>" ;
					}
				}
				div+="</span></p>";
				if(imageRef!="") div+="<div class='picturebox'>"+"<img class='picture' src='"+imageRef+"'/>"+"</div>";
				div+="<div class='footer2'>"+
					"<div class='footerdetail' onclick='like("+number+")'>"+
						"<div class='footerplus'>"+
							"<div class='footerpic' id="+-1*(number+1)+" style='cursor:pointer' >"+
								"<img src='../images/Home%20Pic/8.png'/>"+likenumber+
							"</div>"+
						"</div>"+
					"</div>"+

					"<div class='footerdetail'>"+
						"<div class='footerplus'>"+
							"<div  style='cursor:pointer' class='footerpic' id="+ (number+100)+" onclick=shareplus("+number+")>"+
								"<img src='../images/Home%20Pic/7.png' />"+share+
							"</div>"+
						"</div>"+
					"</div>"+

					"<div class='footerphotos' style='width:auto'></div>";

   
					for(var i=0 ; i<reallikenumber ;i++)	
					{

	
						var x=	$($($($(posts[number]).find('like')).find('likers')).find('name')).attr('image');

			div=div+"<div class='footerphotos'> <img src='"+ x +"' /> </div>";
					}

			div=div+
				"</div>"+//footer2

			"</div>"+//postownerdetail3


			"<div class='commentbox'>";
		div=div+ "<div class='commentcount'"+ 
					"onclick=showcomment("+number+") > "+
				cmnumber + "commnets <img src='../images/Home%20Pic/13.PNG' /> </div>";
			if(cmnumber!=0)
			{
	
        for(var i=0 ; i<=  Math.min(realcm ,0); i++)
        {
            div = div +
                "<div class='acomment'>" +
                "<div class='acommentpicturebox'>" +
                "<img class='acommentpicture' src='" +
                    //../images/Home%20Pic/photo (1).jpg
                $((cmImage)[i]).text()+
                "' />" +
                "</div>" +
                "<div class='acommenttext'>" +
                "<span class='text'>"+//name
                $((cmname)[i]).text()
                + "</span>" +
                "<br />" +
                "<span class='text'>" +  $((cmdate)[i]).text()+
 				"<span class='ws'>"+
                $((cmtext)[i]).text()  +"</span>"+
                "</span>" +
               
                "</div>";

        }
    }

    div=div+"<input class='anewcomment' id='anewcomment"+number+"'  onkeypress=enter(event,"+ number+") placeholder='Add a comment...' />"+
        "</div>" +
        " </div>"+
        "</div>" ;

    return div;
    //$('clm').append($(div));


}
function buildPost(num)
{
    CLC=$("<div class='clm' id='left'> </div>");//clmleft
    CCC=$("<div class='clm' id='center'> </div>");//clmcenter
    CRC=$("<div class='clm' id='right'> </div>");//
    $('.base').append($(CLC));
    $('.base').append($(CCC));
    $('.base').append($(CRC));


    var postapost=  "<div class='item postapost' onclick=compose()>"+
    "<br/>"+
    "<input class='whatsinyourmind'  />"+

    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/1.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/2.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/3.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/4.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/5.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/6.png' /></div>"+
    "</div>";
	$(CLC).append($(postapost));
	
	




    for(var number=0 ; number<num ;number++)
    {

        fetchPostInfo (number);

			
		
        if (  $($(posts[number]).find('post')).attr('hot')  == 'yes')
        {
            var bpost=createBigItem(number);
            $('.base').append($(bpost));


            CLC=$("<div class='clm' id='left'> </div>");//clmleft
            CCC=$("<div class='clm' id='center'> </div>");//clmcenter
            CRC=$("<div class='clm' id='right'> </div>");//
            $('.base').append($(CLC));

            $('.base').append($(CCC));

            $('.base').append($(CRC));

        }
        else {
            var post = createOrdinaryItem(number);//colno
            if ((number) % 3 == 0)$(CRC).append($(post));
            if ((number) % 3 == 1)$(CLC).append($(post));
            if ((number) % 3 == 2)$(CCC).append($(post));

        }
    }
    var btn="<div class='btn' onclick='viewmore()'>  <button type='button'>View more</button></div>";
	$('.base').append($(btn));
	

};


function fetchPostInfo(number)
{
    author=$(posts[number]).find('author').html();
    tags=$(posts[number]).find('tag').html();
	date=$($(posts[number]).find('date')[0]).html();
    proPicURL=$(posts[number]).find('proofilepic').html();
    imageRef=$(posts[number]).find('imageP')[0];
    imageRef=$(imageRef).text();
    // console.log($(posts[number]).html()+ "  " +number);
    share=$(posts[number]).find('share').html();
    text=    $(   $(posts[number]).find('text')   ) ;
    text=$($(text)[0]).text();

    likenumber=$($(posts[number]).find('like')).attr('likeNumber');
	var p=$($($(posts[number]).find('like')).find('likers')).find('name');


    cmnumber=$($(posts[number]).find('comments')).attr('commentNumber');
    cmlinks=$($(posts[number]).find('comments')).attr('allCommentsLink');
 	
	var comments=new Array();
    comments =$($(posts[number]).find('comments')).find('comment');
    cmtext=$(comments).find('text');
	
    // realcm=$($($($(posts[number]).find('comments'))).find('comment'));
    // realcm=$(realcm).length;
    realcm=cmnumber;
    cmImage=$(comments).find('cmimage');
    cmdate=$(comments).find('date');// console.log($(cmdate[0]).text());
    cmreply=$(comments).find('reply');// console.log($(cmreply[0]).text());
    cmname=$(comments).find('name');//console.log($(cmname[0]).text());


}


function report(number)
{
	var date=$($(posts[number]).find('date')[0]).html();
	console.log(date);
	$.post("../index.php?report=1", { reportedPost: date} , function(data)
	{			
			 console.log(data);	 
			//  var noLike=parseInt(m)+parseInt(data);
			// $(y).append("<img src='../images/Home%20Pic/8.png'/>"+ noLike ) ;

    });
}

function like(x)
{
   z=-(x+1);
   y="#"+z;
   var m =$(y).text();
   isliked[x]=1;
   console.log(y);
	$(y).text("");
	var key = $($(posts[x]).find('date')[0]).html();
	$.post("../index.php?likeState=1", { likeplus: key} , function(data)
	{			
		 console.log(data);	 
		 var noLike=parseInt(m)+parseInt(data);
		$(y).append("<img src='../images/Home%20Pic/8.png'/>"+ noLike ) ;

    });
	
  }

function shareplus(x)
{
   z=x+100;  
   y="#"+z;
   var m =$(y).text();
		$(y).text("");
	$(y).append("<img src='../images/Home%20Pic/7.png'/>"+(parseInt(m)+1));
	
	var key = $($(posts[x]).find('date')[0]).html();
	//console.log(key);
	$.post("../index.php", { shareplus: key} , function(data)
	{			
			 console.log(data);	 

    });
	
}

function viewmore()
{

	PLNO+=1;
	if(PLNO>post_index)
	{ 
	  PLNO=post_index;
	  post_index=0;
	  $('.base').empty();
	  Loading(PLNO);
	  $('.btn').remove();
	}

	else
	{
		 post_index=0;
	       $('.base').empty();
	       Loading(PLNO);
	}
       		
}

function xmlToString(xmlData) {

    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}


function likerimageset(number)
{
	var xx={};
	for(var temp=0; temp<reallikenumber ;temp++)
	{
		var x=	$($($($(posts[number]).find('like')).find('likers')).find('name')).attr('image');
		imageLikers[temp]=x;
	}
	return xx;	
}


function compose()
{
	
	
  var postapost= 
    "<div class='bigCompose'> " +
	    "<div class='item postapost RTE'> "+
		    "<br/>"+
	 		"<form action='../index.php' method='post' name='postform' id='postform' enctype='multipart/form-data'> "+
				 "<input type='text' length='20' name='text' class='whatsinyourmind richTE'  />"+
				 "<div class='whatsinyourmindboxs' onclick='pickfile()' >  <img src='../images/Home%20Pic/2.jpg' /></div>"+
				 //"<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/3.png' /></div>"+
				// "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/4.png' /></div>"+
			     //"<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/5.png' /></div>"+
				 "<input type='file' name='myfile'  id='myfile'  class='hiddenfrom'/>"+
				 "<div class='whatsinyourmindboxs' > "+
				 	 "<input type='submit' class='submit' name='submit' id='submit' value='Submit' />"+
				 "</div>"+
				 "<div class='whatsinyourmindboxs' > "+
				 	"<button type='button' id='cancelit' onclick='cancelcompose()''>cancel!</button>"+
				 "</div>"+
			"</form>"+
		"</div>" +
	"</div>";


  $('.postapost').fadeOut(400,"linear",null);
  
  $('.base').prepend($(postapost).fadeIn('slow'));



  tinymce.init({
        selector: ".richTE",
        plugins: "autoresize",
        theme: "modern",
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons template paste textcolor colorpicker textpattern imagetools"
        ],
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor emoticons",
        image_advtab: true,
        templates: [
            {title: 'Test template 1', content: 'Test 1'},
            {title: 'Test template 2', content: 'Test 2'}
        ],
        

    });
 	
 	var h=$('.mce-panel').css.height();
 	alert(h);
$('.RTE').css('min-height', h);

}

function cancelcompose()
{
	
	var postapost=  "<div class='item postapost' onclick=compose()>"+
    "<br/>"+
    "<input class='whatsinyourmind'  />"+

    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/1.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/2.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/3.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/4.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/5.png' /></div>"+
    "<div class='whatsinyourmindboxs'>  <img src='../images/Home%20Pic/6.png' /></div>"+
    "</div>";
	
  $('.bigCompose').fadeOut();
  $('#left').prepend($(postapost).fadeIn());
}


function showcomment(postID,size)
{
	
	
	fetchPostInfo(postID);
		if(size==1)
		{
			
			bigdiv=	"<div id='mybigcm'>"+"<div class='commentbox' >";
			var size="big";
			bigdiv=bigdiv+ "<div class='commentcount' onclick=hidecomment("+postID+","+size+")>"+cmnumber+" commnets <img src='../images/Home%20Pic/13.PNG' /> </div>";
				
			if(cmnumber!=0)
			{
				for(var i=0 ; i<= realcm;i++) 
				{
					bigdiv = bigdiv +
					"<div class='acomment'>" +
						"<div class='acommentpicturebox'>" +
							"<img class='acommentpicture' src='" + $((cmImage)[i]).text() + "' />" +
						"</div>" +

						"<div class='acommenttext'>" +
							"<span class='text'>" +$((cmname)[i]).text()+ "</span>" + 
							"<br />" +
							"<span class='text'>" + $((cmdate)[i]).text() +
							"<span class='ws'>" +$((cmtext)[i]).text() +"<span>"+
							 "</span>" +
							
						"</div>";
				}
			}
			bigdiv=bigdiv+"<input class='anewcomment' id='anewcomment"+postID+"'  onkeypress=enter(event,"+ postID+")  placeholder='Add a comment...' />"+
					"</div>"+
				"</div>"+"</div>"+
			"</div>";
			
			($("#"+postID).find('.commentbox')).remove();
			var base=$("#"+postID);
			base=$(base).find('.postowner');
			$(base).append(bigdiv);
				
			
		}	
		else
		{
			div="<div class='commentbox'>";
			div=div+ "<div class='commentcount'"+ 
						"onclick=hidecomment("+postID+") > "+
					cmnumber + "commnets <img src='../images/Home%20Pic/13-up.PNG' /> </div>";
				
				if(cmnumber!=0)
				{
			for(var i=0 ; i< realcm ; i++)
			{
				div = div +
					"<div class='acomment'>" +
					"<div class='acommentpicturebox'>" +
					"<img class='acommentpicture' src='" +
						//../images/Home%20Pic/photo (1).jpg
					$((cmImage)[i]).text()+
					"' />" +
					"</div>" +
					"<div class='acommenttext'>" +
					"<span class='text'>"+//name
					$((cmname)[i]).text()
					+ "</span>" +
					"<br />" +
					"<span class='text'>" +  $((cmdate)[i]).text()+
					"<span class='ws'>"+
					$((cmtext)[i]).text()  +"</span>"+
					"</span>" +
					"</div>"+
					"</div>" ;

					console.log("!!! "+ $((cmtext)[i]).text());

			}
		}

		div=div+"<input class='anewcomment' id='anewcomment"+postID+"' onkeypress=enter(event,"+ postID+") placeholder='Add a comment...' />"+
			
			" </div>";
		
		($("#"+postID).find('.commentbox')).remove();

		($("#"+postID).append(div).fadeIn());

		
	}

}

function hidecomment(postID,size)
{
	fetchPostInfo(postID);
	
		div="<div class='commentbox'>";
		div=div+ "<div class='commentcount'"+ 
					"onclick=showcomment("+postID+") > "+
				cmnumber + "commnets <img src='../images/Home%20Pic/13.PNG' /> </div>";
			if(cmnumber!=0)
			{
		
        for(var i=0 ; i< Math.min(realcm,1) ; i++)
        {
            div = div +
                "<div class='acomment'>" +
	                "<div class='acommentpicturebox'>" +
		                "<img class='acommentpicture' src='" +
		                    //../images/Home%20Pic/photo (1).jpg
		                $((cmImage)[i]).text()+
		                "' />" +
	                "</div>" +
	                "<div class='acommenttext'>" +
		                "<span class='text'>"+//name
		                $((cmname)[i]).text()
		                + "</span>" +
		                "<br />" +
		                "<span class='text'>" +  $((cmdate)[i]).text()+
						"<span class='ws'>"+
		                $((cmtext)[i]).text()  +"</span>"+
		                "</span>" +
		                
	                "</div>"+
	                "</div>" ;
        }
    }

    div=div+"<input class='anewcomment' id='anewcomment"+postID+"' onkeypress=enter(event,"+ postID+") placeholder='Add a comment...' />"+
        
        " </div>";
	
	($("#"+postID).find('.commentbox')).remove();
	($("#"+postID).append(div));

}

function showtag(tagname)
{
	getpost(33);
	$('.base').empty();
	CLC=$("<div class='clm' id='left'> </div>");//clmleft
    CCC=$("<div class='clm' id='center'> </div>");//clmcenter
    CRC=$("<div class='clm' id='right'> </div>");//
    $('.base').append($(CLC));
    $('.base').append($(CCC));
    $('.base').append($(CRC));
	
	
	for(var i=0 ; i<PLNO ;i++)
	{
		//console.log($($(posts[i]).find('tag')).text());
		var temp=$($(posts[i]).find('tag')).text();
		if(    temp.indexOf(tagname)>-1  )
			{
				
				singlePost(i);
				console.log("find");
				
			 }
		
	}
			
}

function singlePost(number)
{
	fetchPostInfo (number);

			
		
        if (  $($(posts[number]).find('post')).attr('hot')  == 'yes')
        {
            var bpost=createBigItem(number);
            $('.base').append($(bpost));


            CLC=$("<div class='clm' id='left'> </div>");//clmleft
            CCC=$("<div class='clm' id='center'> </div>");//clmcenter
            CRC=$("<div class='clm' id='right'> </div>");//
            $('.base').append($(CLC));

            $('.base').append($(CCC));

            $('.base').append($(CRC));

        }
        else {
            var post = createOrdinaryItem(number);//colno
            if ((number) % 3 == 0)$(CRC).append($(post));
            if ((number) % 3 == 1)$(CLC).append($(post));
            if ((number) % 3 == 2)$(CCC).append($(post));

        }
		
}

function notloading(s)
{
	
	 $('.base').empty();

	 PLNO=Math.min(10,post_index-1);
	 post_index=0;
	Loading(PLNO);
	
	
}



function search()
{
	
	var user =$('.search-bar').val();
	if(user!="")
	$.post("../index.php", { searchAbuddy: user} , function(data)
	{			
			   
		console.log(data);	
		$('.search-result').remove();
	   	$( data).insertAfter('.nav' );
	   var w=	$('.search-bar').width();
	   console.log(w);
	   w+=(0.02 *w);
	   $('.search-result').width(w);

    });


}



function addAsfriend()
{
	
	$('.search-result').remove();
	var user= $('.search-bar').val();
	$.post("../index.php", { addAfriend: user} , function(data)
	{  
		console.log("add");
    });
}

function LogOut()
{
	
	console.log("logout");
	$.post("../index.php", { logout: "logout"} , function(data)
	{  
		console.log(data);
		window.location.replace("../htmls/login.html");
    });

}


function unfriend()
{
	$('.search-result').remove();

}


function postApost()
{
	console.log("&&&&&");
	//if($('#submit')==null) alert("jjj");
	//$('#submit').click(); //submit post to server
	$("#postform").ajaxForm({url: '../index.php', type: 'post'})
	
}

function makeAdate(d)
{

	
	var month = d.getMonth()+1;
	var day = d.getDate();
	var time = d.getFullYear() + '/' +
	    (month<10 ? '0' : '') + month + '/' +
	    (day<10 ? '0' : '') + day +'  '+ d.getHours() + ':'+ d.getMinutes();
}



function pickfile()
{

$('#myfile').click();

}



   $('.Order').change(function() 
   {
   	var key=$(this).find('option:selected').val();
   	// console.log();

    $.post("../index.php", { order: key } , function(data)
	{  
		console.log(data);

		notloading(PLNO);//location.reload();
    });
   });


function enter(e, n )
 {
    if(e.which == 13) 
    {
      
	    var cm=$('#anewcomment'+n).val();
	    	console.log($(this).text() + " (*(* ");
	    $('#anewcomment'+n).val("");       
	    var key = $($(posts[n]).find('date')[0]).html();
	    $.post("../index.php?postdate="+key , { comment: cm } , function(data)
		{  		

			var now	= new Date();
			var currentDate = now.getHours() + ":" + now.getMinutes();
			var noCM=$($(posts[n]).find('comments')).attr('commentNumber');

			$($(posts[n]).find('comments')).attr('commentNumber' , parseInt(noCM)+1);
			var newcm="<comment>"+
						"<text>"+cm +"</text>"+
						"<cmimage>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/POSTS_files/Photo 5.jpg</cmimage>"+
						"<date>"+currentDate+"</date>"+
						"<name>"+data +"</name>"+
					   "</comment>";

			$($(posts[n]).find('comments')).append(newcm);
			// console.log(cm + " (*(* ");
			showcomment(n,2);
	    });

    }
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}


function editPost(number)
{
	$('input[readonly]').click(function () 
	{
	var post_author=$(posts[number]).find('author').html();

	if(post_author==pageOwner)
	{
    	$(this).removeAttr('readonly');
	}
	});

	$('input[readonly]').focusout(function()
		{
			$(this).attr('readonly',true);
			var date = $($(posts[number]).find('date')[0]).html();
    		var txt=$(this).val();
    		console.log(txt+";;;;");
			$.post("../index.php?editPost="+date, { newtext: txt} , function(data)
			{			
					 console.log(data);	 

		    });

			console.log("done");
		}
		);
	


	
}


