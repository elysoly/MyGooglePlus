<?php
date_default_timezone_set('Asia/Tehran');
session_start();
function MongoConnect() 
{
 // connect to mongodb
   $m = new MongoClient();
   //echo "Connection to database successfully";
   // select a database
   $db = $m->gp;
   //echo "Database mydb selected";
   $collection = $db->createCollection("Login");
   return $collection;
   //echo "Collection created succsessfully";

}


function Login()
{
	if(isset($_SESSION["auth"]) || isset($_COOKIE['username']) )
		{
			$_SESSION['auth']=$_COOKIE['username'];
			if(strcmp("admin",$_SESSION['auth'] )==0)header('Location: htmls/Home - Admin.html?'.$_SESSION['auth']); //redirecting
			else header('Location: htmls/Home.html?'.$_SESSION['auth']); //redirecting
		}

	else
	{ 
	 	if(!empty($_POST['name']) &&  !empty($_POST['Passwd']) )
	 	{
		 	 $name = trim($_POST['name']);
		 	 $pass= trim($_POST['Passwd']);
			 $logincol=MongoConnect();
			 $user = $logincol->find(array('username'=> $name, 'password'=> $pass));
				 if ($user->count() > 0)
		 	 {
		 		$exp=time()+30*60;
		 		if(isset($_POST['rememberme']))
				{
					setcookie("username",$name , $exp);
					$_SESSION["auth"] = $name;
				}
				echo $name;
		 				if(strcmp("admin",$_SESSION['auth'] )==0)header('Location: htmls/Home - Admin.html?admin'); //redirecting
			else header('Location: htmls/Home.html?'.$_SESSION['auth'] ); //redirecting
		 	 }
		    else 
		 		header('Location: htmls/login.html'); 
		 	
	 	}
	 	else
	 		header('Location: htmls/login.html');


	 }

}

function register()
{

	if(!empty($_POST['name']) &&  !empty($_POST['Passwd']) )
	 {
		 $name = trim($_POST['name']);
		 $pass= trim($_POST['Passwd']);
		 $logincol=MongoConnect();
		 $user = $logincol->find(array('username'=> $name));
	 	 if ($user->count() > 0)
		 {
			 header('Location: htmls/signup.html');
		 }
		 else
		 {
		 	 $exp=time()+30*60;
			 $newuser = array('username' => $name , 'password'=> $pass);
			 $logincol->insert($newuser);
			 if(isset($_POST['rememberme']))
			 {
			 	setcookie("username",$name , $exp);
			 	$_SESSION["auth"] = $name;
			 }
			 header('Location: htmls/home.html?'.$_SESSION['auth']);

		 }
				 	
	 }


	 else 
	 	{
	 		header('Location: htmls/signup.html');
	 
	 	}

}

function username_validation($uname)
{

 		if($uname==null){echo '<span class="error">Username cannot be null.</span>';exit;}
 		 $logincol=MongoConnect();
		 $user = $logincol->find(array('username'=> $uname));
	 	 if ($user->count() > 0 )
		 {

			echo '<span class="error">Username already exists.</span>';exit;
		 }
		 else
		 	{echo '<span class="error">Username is valid.</span>';exit;}
//echo '<span class="error">Username already exists.</span>';exit;

// else if(strlen($username) < 6 || strlen($username) > 15){echo '<span class="error">Username must be 6 to 15 characters</span>';}
// else if (preg_match("/^[a-zA-Z1-9]+$/", $username)) 
// {
//        echo '<span class="success">Username is available.</span>';
// } 
// else 
// {
//       echo '<span class="error">Use alphanumeric characters only.</span>';
//}

}

function sortDate( $a, $b ) {
    return -strtotime($a['date']) + strtotime($b['date']);
}

function sortWriter( $a, $b ) {
	  return strcmp($a["owner"], $b["owner"]);
   // return -strtotime($a['date']) + strtotime($b['date']);
}

function sortHot( $a, $b ) {//bycmnumber
	if($a['cmnumber']>$b['cmnumber'])
    return 0;
	else return 1;
}


function searchAbuddy($someone)
{
	if(strcmp($someone, $_SESSION["auth"])==0) 
		{
			echo '<div class="search-result"  >It is you!</div>';
	 		exit;
		}
	$logincol=MongoConnect();
	$user = $logincol->find(array('username'=> $someone));
	if ($user->count() < 1 )
	{
		echo '<div class="search-result"  >Username not exist.</div>';
		exit;
	}	

	else
	{
		$buddies="";
		foreach ($user as $buddy) 
		{
			$where=array( '$and' => array( array('username' =>$_SESSION["auth"]), array('friends'=> $buddy["username"]) ) );
			$cursor=$logincol->find($where);
			if( $cursor->count() > 0 )
				$buddies=$buddies. '<div class="search-result" >'.$buddy["username"].'<button type="button" class="addbtn" onclick="unfriend()" >friend</button></div>';
			else 
			$buddies=$buddies. '<div class="search-result"  >'. $buddy["username"] .'
				<button type="button" class="addbtn" onclick="addAsfriend()" >Add</button> </div>';//
		}
		echo $buddies;
	}

}

function addAfriend($friend)
{
	if(isset($_SESSION["auth"]))
	{

		$logincol=MongoConnect();
		$uname=$_SESSION["auth"] ;
		$filter=array("username" => $uname);
		$update=array('$push'=>array('friends'=>$friend));
		$logincol->update( $filter, $update, array("upsert" => true));

	

	}
}



function LogOut()
{
	$exp=(time())*-1;
	setcookie("username",$name , $exp);
	session_destroy();
	header("Location: /HW3/htmls/login.html");
}


function saveImage()
{

	if(isset($_FILES["myfile"]))
	{
		   // echo date('Y-m-d H:i:s');

		if($_FILES["myfile"]["error"] ==4)
		{
			return "noImage";
		   // return  $_FILES["myfile"]["error"] ;
		}
		else
		{
			// echo "Upload: " . $_FILES["myfile"]["name"] . "<br />";
			// echo "Type: " . $_FILES["myfile"]["type"] . "<br />";
			// echo "Size: " . ($_FILES["myfile"]["size"] / 1024) . " Kb<br />";
			// echo "Temp Store: " . $_FILES["myfile"]["tmp_name"] ."<br />";
	
			if (file_exists("Server/upload/" .$_SESSION["auth"]. $_FILES["myfile"]["name"])) unlink( "Server/upload/" .$_SESSION["auth"]. $_FILES["myfile"]["name"] );
			else 
				move_uploaded_file($_FILES["myfile"]["tmp_name"],	"Server/upload/" .$_SESSION["auth"]. $_FILES["myfile"]["name"]);
			
			$path="Server/upload/" .$_SESSION["auth"]. $_FILES["myfile"]["name"];
			return $path;
		}
	}

	else 
		return "";

}


function creatApost()
{

	$image_path = saveImage();
	$postText= $_POST['text'];

	$date=date('Y-m-d H:i:s');
	$owner = $_SESSION['auth'];
	$comment = array('writer' =>"" ,'date'=>'' ,'text'=>'');

	//extract hashtags:
	 preg_match_all("/#(\\w+)/", $postText, $matches);
	 $hash = $matches[0];
	 $hashtag_number=(sizeof($hash));
	 $tags="";
	for ($i=0; $i <$hashtag_number ; $i++) 
	{ 
		$tags= $tags.$hash[$i];
	}
	echo $tags;

	//insert a post to database
	$logincol=MongoConnect(); 
	$newpost=array("text" => $postText , "tag"=>$tags , "date"=> $date , "share"=> 0 , "like"=>0 , "image" => $image_path , "comments"=> array($comment) , "cmnumber"=>0);//"comments"=> array($comment));

 	$filter=array("username" => $owner);
 	$update=array('$push'=>array('posts'=>$newpost));
 	$logincol->update( $filter, $update, array("upsert" => true));
header('Location: htmls/home.html?'.$_SESSION['auth']);

	 

}


function retrivePost()
{
	$propic="Server/upload/profilePic/nophoto.jpg";
	if(!isset($_SESSION['auth'])){ retrivePublicPosts(); exit();}
	 $owner=$_SESSION['auth'];
	 $posts=null;
	 $apost=array("owner"=>$owner , "text"=>"" , "date"=>"" ,  "share"=> 0 , "like"=>0 ,"image"=>"" );
	 $logincol=MongoConnect();
	
	 
	 $y=0;
	 $user_posts = $logincol->find(array('username'=> $owner) , array("posts" => 1));
	 $friends = $logincol->find(array('username'=> $owner), array("friends" => 1) );
	 $tempPic=$logincol->find(array('username'=> $owner), array("profilePic" => 1) );
	  foreach ($tempPic as $tpic )
			  {
			 	if( array_key_exists("profilePic", $tpic) ) $propic=$tpic['profilePic'];
				 else $propic="Server/upload/profilePic/nophoto.jpg";
			 }
	 $x=0;

    foreach ($user_posts as $p) 
   	{
   		if(isset($p['posts']))
   		{
    	$y=	sizeof($p['posts']);
		 for ($x = 0; $x<$y ; $x++)
		{
			
			 $apost= array("owner"=>$owner ,"profilePic"=>$propic , "text"=>$p['posts'][$x]['text'], "tag"=>$p['posts'][$x]['tag']  , "date"=>$p['posts'][$x]['date'] ,  "share"=> $p['posts'][$x]['share'] ,
			  "like"=>$p['posts'][$x]['like'] ,"image"=>$p['posts'][$x]['image'] ,"comments"=>$p['posts'][$x]['comments']  , "cmnumber" => $p['posts'][$x]['cmnumber'] );
		 	$posts[$x]=$apost;

	 		 
		}
		}
	
  	}	
 	
  	foreach ($friends as $fris) 
   	{


   		if(isset($fris['friends']))
   		for($j=0; $j < sizeof($fris['friends']); $j++) 
   		{ 

   			$owner= $fris['friends'][$j];
   			$friend_posts = $logincol->find(array('username'=> $owner) , array("posts" => 1));		
   			 $tempPic=$logincol->find(array('username'=> $owner), array("posts" => 0) );
	
			 foreach ($tempPic as $tpic )
			  {
			 	if( array_key_exists("profilePic", $tpic) ) $propic=$tpic['profilePic'];
				 else $propic="Server/upload/profilePic/".$owner;
			 }
		    foreach ($friend_posts as $fp) 
		   	{
		   		
		    	$y=	sizeof($fp['posts']);
				 for ($i = 0; $i<$y ; $i++)
				{
					
					 $apost= array("owner"=>$owner, "profilePic"=>$propic , "text"=>$fp['posts'][$i]['text'], "tag"=>$fp['posts'][$i]['tag']  ,
					  "date"=>$fp['posts'][$i]['date'] ,  "share"=> $fp['posts'][$i]['share'] , "like"=>$fp['posts'][$i]['like'] ,
					  "image"=>$fp['posts'][$i]['image'] ,"comments"=>$fp['posts'][$i]['comments']  , "cmnumber" => $fp['posts'][$i]['cmnumber'] );
				 	 $posts[$x+$i]=$apost;
			 		 
				}
				$x=$x+$i;
		  	}

   		}

   		
	}

	// echo $posts[5]['owner'];

	if($posts==null)
	{

		$date=date('Y-m-d H:i:s');
		header("Content-type: text/xml");
		echo "<?xml version='1.0' encoding='UTF-8'?>";
		echo "<posts>";
		echo "<post> ".
		 "<author> Google </author>".
		  "<proofilepic>logo_2x.png</proofilepic>".
		  "<date>".$date."</date>".
		  "<text> welcome!</text>";
		 echo "</post> </posts>";
		 exit();

	}

	
	if(isset($_SESSION['selected_Order'])) usort($posts, $_SESSION['selected_Order']);  
	else usort($posts, "sortDate");  

	
	CreateXML($posts);

}


function retrivePublicPosts()
{
	echo "<shouldLogin> you are guess! you should login :) </shouldLogin>";
	exit();

}

function CreateXML($postsData)
{


	//header("Content-type: text/xml");
	echo "<?xml version='1.0' encoding='UTF-8'?>";
	echo "<posts>";


	 for ($x = 0; $x < sizeof($postsData); $x++)
	{
		echo "<post> ".
			 "<author>".$postsData[$x]['owner']."</author>";
	    echo  "<proofilepic>../".$postsData[$x]['profilePic']."</proofilepic>";
	    echo "<date>".$postsData[$x]['date']."</date>";
	    if(strcmp($postsData[$x]['image'], "noImage")!=0 ) echo "<imageP> ../".$postsData[$x]['image']."</imageP>";
		 echo  "<share>".$postsData[$x]['share']."</share>".
	  	"<text> ".strip_tags($postsData[$x]['text'])."</text>";
	  	 echo "<tag>". $postsData[$x]['tag']."</tag>";

	 	 echo " <comments commentNumber='". $postsData[$x]['cmnumber']."' >";
	 if( !empty($postsData[$x]['comments'][1] ) ) 
	 	for ($i=1; $i < sizeof($postsData[$x]['comments']); $i++)
	 	 { 
	 	 	$d=$postsData[$x]['comments'][$i]['date'];
	 	 	$old_date_timestamp = strtotime($d);
			$new_date = date('M-d H:i', $old_date_timestamp);   
	 		echo  "<comment>".
			"<text>" . $postsData[$x]['comments'][$i]['text']. " </text>
			<cmimage>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/POSTS_files/Photo 5.jpg</cmimage>
			<date>".$new_date."</date>
			<name>".$postsData[$x]['comments'][$i]['writer']."</name>
			</comment>";
	 	}
		
	 echo "</comments>";

	 echo " <like likeNumber='". $postsData[$x]['like']."'>".
		// <likers>
		// 	<name image="http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/POSTS_files/photo(2).jpg">Keylo</name>
		// 	<name image="http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/POSTS_files/photo(3).jpg">Laksham</name>
		// 	<name image="http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/POSTS_files/photo(4).jpg">News</name>
		// 	<name image="http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/POSTS_files/photo(5).jpg">Hank</name>
		// 	<name image="http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/POSTS_files/Photo 4.jpg">Farid</name>
		// 	<name image="http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/POSTS_files/Photo 5.jpg">Saman</name>
		// </likers>
	 "</like>";
	 echo "</post>";

}
	
	echo "</posts>";


}


function sharePluse()
{


	$s = $_POST['shareplus'];
	$x=date("Y-m-d H:i:s", strtotime($s) );
	$logincol=MongoConnect();


	$condition=array("posts.date"=> $x);
	$data=array('$inc'=>array("posts.$.share"=> 1));
 	$res=$logincol->update($condition,$data);
	var_dump($res);


}


function like()
{
	$s = $_POST['likeplus'];//$_GET['likeState']

	$x=date("Y-m-d H:i:s", strtotime($s));
	$state=1;	
	$A_liker=$_SESSION['auth'];
	

	$logincol = MongoConnect();
 	 $q = array( 'posts' => array(
       '$elemMatch' => array(
           'date' => $x
       )
    ));
 	

	$likers_List = $logincol->find(array('posts.date' => $x ) ,array("posts" => 1) );
	foreach ($likers_List as $like_list)
	{
	// 	var_dump($like_list);
	// if(!empty($like_list))
	// {
	// 	var_dump($like_list['posts']);
	// 	// for($i=0 ; i< sizeof($like_list['posts']) ; $i++)
	// 	{
			// if($like_list['posts'][$i]['date']==$x) echo "nn";
	// 	// if(in_array("ahmad", $like_list['posts'][$i]['likers'])  && $like_list['posts'][$i]['date']==$x) echo "yes";//$state=-1;
	// 	// else $state=1;//makoos;	
		
	// 	}	
	// }
	// else $state=1;

	$condition=array("posts.date"=> $x);
	$data=array('$inc'=>array("posts.$.like"=> $state ));
	$res=$logincol->update($condition,$data);
	// if($state==1) $data=array('$push'=>array("posts.$.likers"=>$A_liker ));
	// elseif($state==-1) $data=array('$pull'=>array("posts.$.likers"=>$A_liker ));
	// $res=$logincol->update($condition,$data);
	// var_dump($res);	
	echo	$state;
	
	}
	
	

}


function report($s)
{


	$x=date("Y-m-d H:i:s", strtotime($s) );
	$logincol=MongoConnect();


	$condition=array("posts.date"=> $x);
	$data=array('$inc'=>array("posts.$.reported"=> 1));
 	$res=$logincol->update($condition,$data);
	var_dump($res);



}

function rememberme()
{
 	 if(isset($_SESSION["auth"]) || isset($_COOKIE['username']) )
		{
			$_SESSION['auth']=$_COOKIE['username'];
			echo 1;//header('Location: htmls/Home.html'); //redirecting
		}

}


function addAcomment()
{

	$s = $_GET['postdate'];
	$x=date("Y-m-d H:i:s", strtotime($s) );


	$commentText= $_POST['comment'];

	$date=date('Y-m-d H:i:s');
	$writer = $_SESSION['auth'];
	//$comment = array('writer' =>"" ,'date'=>'' );


	//insert a post to database
	$logincol=MongoConnect(); 
	$newcomment=array('writer' =>$writer ,'date'=>$date , 'text'=> $_POST['comment']);

	$condition=array("posts.date"=> $x);
	$data=array('$push'=>array("posts.$.comments"=> $newcomment));
 	$res=$logincol->update($condition,$data);
	$data=array('$inc'=>array("posts.$.cmnumber"=> 1));
 	$res=$logincol->update($condition,$data);
 	echo $writer;
	//var_dump($res);


}

function AdminPannel()
{
	if(!isset($_SESSION['auth'])){ retrivePublicPosts(); exit();} 
	 $posts=null;
	 $logincol=MongoConnect();
  	 $q = array( 'posts' => array(
	       '$elemMatch' => array(
	           'reported' => array('$gt'=>0)
	       )
	    )
	 );
	 $x=0;
	$temp = $logincol->find( $q );
	if(!empty($temp))  
		foreach ($temp as $t)
		{	
			

			for ($i=0; $i <sizeof($t['posts']) ; $i++) 
			{ 
			 if(isset($t['posts'][$i]['reported'])) 
				 	{

				 	 $posts[$x]=$t['posts'][$i];
				 	 $posts[$x]['owner']=$t['username'];
				 	 $tempPic=$logincol->find(array('username'=> $t['username'] ), array("profilePic" => 1) );
					foreach ($tempPic as $tpic )
					 {
					 	if( array_key_exists("profilePic", $tpic) ) $posts[$x]['profilePic']=$tpic['profilePic'];
						 else $posts[$x]['profilePic']="Server/upload/profilePic/nophoto.jpg";
					 }

				 	 $x++;
				 	}
			}

		
		}	


	if($posts==null)
	{

		$date=date('Y-m-d H:i:s');
		header("Content-type: text/xml");//age gand zad cm kon
		echo "<?xml version='1.0' encoding='UTF-8'?>";
		echo "<posts>";
		echo "<post> ".
		 "<author> Admin </author>".
		  "<proofilepic>logo_2x.png</proofilepic>".
		  "<date>".$date."</date>".
		  "<text> No reported post!</text>";
		 echo "</post> </posts>";
		 exit();

	}

	
	if(isset($_SESSION['selected_Order'])) usort($posts, $_SESSION['selected_Order']);  
	else usort($posts, "sortDate");  

	
	CreateXML($posts);		 
	
}
 

function AdminDelete()
{

	$s = $_POST['deletePost'] ;
	$x=date("Y-m-d H:i:s", strtotime($s) );
	$owner=$_GET['author'];
	$logincol=MongoConnect();


	$condition=array("username"=> $owner);
	$data= array('$pull'=> array('posts'=> array('date' => $x)) );
	         
 	$res=$logincol->update($condition,$data);
	var_dump($res);


}

function editPost()
{
	$s = $_GET['editPost'] ;
	$x=date("Y-m-d H:i:s", strtotime($s) );
	$logincol=MongoConnect(); 
	$condition=array("posts.date"=> $x);
	$data=array('$set' =>array("posts.$.text"=> $_POST['newtext']));
 	$res=$logincol->update($condition,$data);


	$condition=array("posts.date"=> $x);
	$data=array('$set' =>array("posts.$.date"=> $date=date('Y-m-d H:i:s') ));
 	$res=$logincol->update($condition,$data);
	//echo $_POST['newtext'];
	var_dump($res);

}

function checkupdate()
{

	$logincol=MongoConnect();
	$posts=null;
	$friends = $logincol->find(array('username'=> $_SESSION['auth']), array("friends" => 1) );
	$tempPic=$logincol->find(array('username'=> $_SESSION['auth'] ), array("profilePic" => 1) );
	 if( array_key_exists("profilePic", $tempPic) ) $propic=$tempPic['profilePic'];
	 else $propic="Server/upload/profilePic/nophoto.jpg";
	foreach ($friends as $fris) 
   	{

   		$now = date("Y-m-d H:i:s");
		$time = strtotime($now);
		$time = $time - (0.5 * 60);
		$lastmin = date("Y-m-d H:i:s", $time);
		$x=0;
   		if(isset($fris['friends']))
   		for($j=0; $j < sizeof($fris['friends']); $j++) 
   		{ 
   			//echo $fris['friends'][$j];
   			$owner= $fris['friends'][$j];
   			$condition=array('posts.date'=>array('$gt' => $lastmin) , 'username'=>$owner);
   			$friend_posts = $logincol->find( $condition , array("posts" => 1));	

		    foreach ($friend_posts as $fp) 
		   	{
		   				

		    	$y=	sizeof($fp['posts']);
				 for ($i = 0; $i<$y ; $i++)
				{

					if($fp['posts'][$i]['date'] > $lastmin)
					{	
					 // echo $fp['posts'][$i]['text']."  &&&      ";
					 $apost= array("owner"=>$owner ,"profilePic"=>$propic , "text"=>$fp['posts'][$i]['text'], "tag"=>$fp['posts'][$i]['tag']  ,
					  "date"=>$fp['posts'][$i]['date'] ,  "share"=> $fp['posts'][$i]['share'] , "like"=>$fp['posts'][$i]['like'] ,
					  "image"=>$fp['posts'][$i]['image'] ,"comments"=>$fp['posts'][$i]['comments']  , "cmnumber" => $fp['posts'][$i]['cmnumber'] );
				 	 $posts[$x+$i]=$apost;

			 		 }
				}
				$x=$x+$i;
		  	}

		  

   		}

   			if($posts!==null)
		  	{
			  	if(isset($_SESSION['selected_Order'])) usort($posts, $_SESSION['selected_Order']);  
				else usort($posts, "sortDate");  
				CreateXML($posts);	
			}

   		
	}

}


function viewmore()
{
 $propic="Server/upload/profilePic/nophoto.jpg";
	$showed[0]=$_SESSION['auth'];
	$showed[1]="admin";
	$show_index=2;
	//awali cherte
	echo "
	<people>
		<person>
			<image>logo_2x.png</image>
			<name>Admin</name>
			<about>Cnext, alborz highschool</about>
			<matualFreind>hamidreza ramezani</matualFreind>
		</person>
	<person>
			<image>logo_2x.png</image>
			<name>Admin</name>
			<about>Cnext, alborz highschool</about>
			<matualFreind>hamidreza ramezani</matualFreind>
		</person>";

	$logincol=MongoConnect();
	$friends = $logincol->find(array('username'=> $_SESSION['auth']), array("friends" => 1) );


	foreach ($friends as $fris) 
   	{

   		if(isset($fris['friends']))
   		for($j=0; $j < sizeof($fris['friends']); $j++) 
   		{ 

   			$myfriend= $fris['friends'][$j];
   			$friend_OF_friend = $logincol->find( array(  'username'=> $myfriend),  array("friends" => 1 ) );		
			

		    foreach ($friend_OF_friend as $fOf) 
		   	{

		    	$y=	sizeof($fOf['friends']);
				 for ($i =0; $i < $y ; $i++)
				{

					$tempPic=$logincol->find(array('username'=> $fOf['friends'][$i]), array("posts" => 0) );
				    foreach ($tempPic as $tpic )
					{
					 	if( array_key_exists("profilePic", $tpic) ) $propic=$tpic['profilePic'];
						 else $propic="Server/upload/profilePic/nophoto.jpg";
					}	

					 if (!in_array($fOf['friends'][$i], $fris['friends'])  && $fOf['friends'][$i]!==$_SESSION['auth'])
						{ echo "<person>
									<image>../".$propic."</image>
									<name>".$fOf['friends'][$i]."</name>
									<about>Cnext, alborz highschool</about>
									<matualFreind>hamidreza ramezani</matualFreind>
							  </person>";
							$showed[$show_index]=$fOf['friends'][$i];
							$show_index++;
						}
			 		 
				}
				
		  	}

   		}


   		$all_remain_user = $logincol->find( array('username'=> array('$nin' => $showed) ),  array("username" => 1 ) );
		foreach ($all_remain_user as $suggest )
		 {
		 	$tempPic=$logincol->find(array('username'=> $suggest['username']), array("posts" => 0) );
		 	foreach ($tempPic as $tpic )
					{
					 	if( array_key_exists("profilePic", $tpic) ) $propic=$tpic['profilePic'];
						 else $propic="Server/upload/profilePic/nophoto.jpg";
					}	
		 	if(!in_array($suggest['username'] ,$fris['friends'] ))
		 	{
				echo "<person>
					<image>../". $propic."</image>
					<name>".$suggest['username']."</name>
					<about>Cnext, alborz highschool</about>
					<matualFreind>hamidreza ramezani</matualFreind>
			  </person>";
				$showed[$show_index]=$suggest['username'];
				$show_index++;

			}
		
		}
   		
	}
	echo 	"</people>";

}

function getFeild($feild)
{

	$logincol=MongoConnect(); 
	$condition=array("username"=> $_SESSION['auth']);
	$res=$logincol->find($condition, array($feild => 1));

	foreach ($res as $data)
	{
		if( array_key_exists($feild, $data) ) 
		return $data[$feild];
		else
		{
			if(strcmp($feild , "profilePic")==0 ) return "Server/upload/profilePic/nophoto.jpg";
			else return "not set";
		}
	}

}

function profile()
{

	$edu['past']=getFeild("education-past");
	$edu['now']=getFeild("education-now");
	$propic=getFeild("profilePic");

	echo "
	<profile>
	<basicInfo>
		<gender>Male</gender>
		<lookingFor>Friends, Networking</lookingFor>
		<RelationShip>Single</RelationShip>
		<Birthday>January 7, 1995</Birthday>
	</basicInfo>
	<profilePic>../".$propic."</profilePic>
	<cover>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/%C2%A9+Dave+Cohen_IMG_7573-Edit-2.jpg</cover>
	<slider>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Slider/slides.xml</slider>
	<name>".$_SESSION['auth']."</name>
	<about>Attends Amirkabir University of Technology</about>
	<story>
		<tagline>I'm pooya ,  a technology addict! As much of a geek as you'd expect.</tagline>
		<introduction></introduction>
		<braggingRights></braggingRights>
	</story>
	<education>
		<now>".$edu['now']."</now>
		<past>".$edu['past']."</past>
	</education>
	<places>
		<place>Tehran</place>
	</places>
	<contacts>
		<phone>+989129999999</phone>
		<email>Sombody@gmail.com</email>
	</contacts>
	<links>
		<link>http://www.youtube.com/user/pyapar</link>
		<link>http://pi0.ir/</link>
		<link>http://profile.live.com/cid-3545597cff808ba4</link>
	</links>
	<people>
	<followers>119</followers>
	<followersPics>
		<image>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/photo(1).jpg</image>
		<image>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/photo(2).jpg</image>
		<image>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/photo(3).jpg</image>
		<image>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/photo(4).jpg</image>
		<image>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/photo(5).jpg</image>
		<image>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/photo(6).jpg</image>
		<image>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/photo(7).jpg</image>
		<image>http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/photo(8).jpg</image>
	</followersPics>
	</people>
	<work>
		<occupation>I'm always learning!</occupation>
		<skills>Programming,Net Admin,Web Designing;</skills>
		<employment></employment>
	</work>
	</profile>";

}


function editProfile()
{

	$update= $_POST['new_info'];
	$feild=$_GET['ProfileFeild'];
	echo $feild."jjj ";
	$logincol=MongoConnect(); 
	$condition=array("username"=> $_SESSION['auth']);
	$data=array('$set' =>array($feild=> $update));
	$res=$logincol->update($condition,$data , array("upsert" => true));

}

function changeProfilePic()
{

	if(isset($_FILES["p_submit"]))
	{

		if($_FILES["p_submit"]["error"] ==4)
		{
			$path="Server/upload/profilePic/nophoto.jpg";
		}
		else
		{
			//if (!file_exists("Server/upload/profilePic" .$_SESSION["auth"]))
			//{

				if (file_exists("Server/upload/profilePic" .$_SESSION["auth"])) unlink("Server/upload/profilePic" .$_SESSION["auth"]);
				else move_uploaded_file($_FILES["p_submit"]["tmp_name"],	"Server/upload/profilePic/" .$_SESSION["auth"]);
			//}
			$path="Server/upload/profilePic/" .$_SESSION["auth"];
			
		}

		echo $path;
	}


	$update=$path; 
	$feild="profilePic";
	$logincol=MongoConnect(); 
	$condition=array("username"=> $_SESSION['auth']);
	$data=array('$set' =>array($feild=> $update));
	$res=$logincol->update($condition,$data , array("upsert" => true));

}

//****************************************************
	 if(isset($_POST['signIn']))				Login();
	 if(isset($_POST['signUp']))				header('Location: htmls/signup.html');
	 if(isset($_POST['register'])) 				register();
	 if(isset($_POST['username_validation'])) 	username_validation($_POST['username_validation']);
	 if(isset($_POST['order'])) $_SESSION['selected_Order']=$_POST['order'];  	
	 if(isset($_GET ['owner']))					retrivePost();
	 if(isset($_POST['searchAbuddy']))			searchAbuddy($_POST['searchAbuddy']);
	 if(isset($_POST['addAfriend'])) 			addAfriend($_POST['addAfriend']);
	 if(isset($_POST['logout'])) 				LogOut();
	 if(isset($_POST['submit'])) 			    creatApost();//retrivePost();
	 if(isset($_GET['postXML']))				retrivePost();//CreateXML("kjakshakshk");
	 if(isset($_POST['shareplus'])) sharePluse();
	 if(isset($_GET['likeState'])) like();
	 if(isset($_POST['reportedPost'])) report($_POST['reportedPost']);//echo "report ".$_GET['report'];
	 if(isset($_POST['login'])) rememberme();
	 if(isset($_POST['comment'])) addAcomment();
	 if(isset($_GET['ControlPannel']))AdminPannel();
	 if(isset($_GET['delete'])) AdminDelete();
	 if(isset($_GET['editPost']))editPost();
	 if(isset($_GET['UpdatePost']))checkupdate();
	 if(isset($_GET['viewmore']))viewmore();
	 if(isset($_GET['profile']))profile();
	 if(isset($_GET['ProfileFeild']))editprofile();
	 if(isset($_POST['submit_p'])) changeProfilePic();
	  exit();
?>
