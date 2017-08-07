<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>

	<body>

	 <div class="nav-container">
			<div class="nav">
			<ul>
			<li><a href="Home.html">Home</a></li>
			<li><a href="Profile.html">Profile</a></li>
			<li><a href="View more.html">View more</a></li>
			<li></li>
			</ul>
			
		   </div> 
	</div> 
	

		
	 <div class = "base">
		
		 	 <div class="up"> 
		 <div id="picture" >
			<form action="../index.php" method="post" name="postform" id="postform" enctype="multipart/form-data"> 
		 	<input type="file" id="p_submit" class="p_submit" name="p_submit" />
			
			<img class="contact_img" onclick="pickapicture()">
									
			 <xsl:attribute name="src">
						<img src=" " alt=""/>
						<xsl:value-of select="/profile/profilePic"/>
			  </xsl:attribute>
			</img>
			 <div class="desc">
			 <p id="topic" > 	
				<input type="submit"   id="p_submit"  name="submit_p" value="{profile/name}" /> </p> 
				<p id="myfont" >  <xsl:value-of select="profile/about"/> </p>
			 </div>
			 </form>
		</div>
		 <div id="coverPhoto"> 
			<img src="http://ceit.aut.ac.ir/~bakhshis/IE/S94-HW-3/Profile_files/%25C2%25A9+Dave+Cohen_IMG_7573-Edit-2.jpg" /> 
		</div>
	
	 </div>   
		 
		 <div class="clm">
			 <div class="pcontainer">  
				<div class="people">
				 <p id="topic">Poeple</p>
				 <p id="inUrCircle">In your circles<span class="contact_num">
				 <xsl:value-of select="//people/followers"/> people</span></p>
				 <div class="pic1">
				 <xsl:for-each select="/profile/people/followersPics/image">
					 <a href=" ">
						<img class="contact_img">
						
							 <xsl:attribute name="src">
										<img src=" " alt=""/>
										<xsl:value-of select="."/>
							  </xsl:attribute>
							</img>
					 </a>
				 </xsl:for-each>
				 </div>
				 
				 <p class="edit">Edit</p>
			 </div>
			 </div> 	 
			  
			 <div class="workcontainer"> 
				 <div class="work">
					 <p id="topic">Work</p>
					 <p id="heading">Occupation</p>
					 <span class="text"><xsl:value-of select="profile/work/occupation"/></span>
					 <p id="heading">Skills</p>
					 <span class="text"><xsl:value-of select="profile/work/skills"/><xsl:value-of select="profile/work/employment"/></span>
					 <p class="edit">Edit</p>
				 </div>
			 </div> 
			
			 <div class="Basiccontainer">
				 <div class="BasicInformation">
					<p id="topic">Basic information</p>
					<p id="heading">Gender <span class="answer"> <xsl:value-of select="profile/basicInfo/gender"/> </span></p>
					<p id="heading">Looking for<span class="answer"><xsl:value-of select="profile/basicInfo/lookingFor"/></span></p>
					<p id="heading">Birthday<span class="answer"><xsl:value-of select="profile/basicInfo/Birthday"/></span></p>
					<p id="heading">Relationship<span class="answer"><xsl:value-of select="profile/basicInfo/RelationShip"/></span></p>	
					<p class="edit">Edit</p>
				 </div>
			 </div>
			
		 </div>
		
		 <div class="clm">
			 <div class="storycontainer">  
				<div class="story">
				 <p id="topic">Story</p>
				 <p id="heading">Tagline</p>
				 <span class="text"><xsl:value-of select="profile/story/tagline"/></span>
				 <p id="heading">Introduction</p>
				 
				 <span class="text">  <xsl:value-of select="profile/story/introduction"/></span>
				 <p id="heading">Bragging rights</p>
				 <span class="text"><xsl:value-of select="profile/story/braggingRights"/></span>
				 <p class="edit">Edit</p>
			 </div>
			 </div> 
			 
			 <div class="educontainer">
				 <div class="education">
					 <p id="topic">Education</p> 
					 <p id="heading"> 
					 	 <input type="text"  class="heading"  name="education-now" onclick="edit()" >
					 	 	<xsl:attribute name="value"> 
					 	 		 <xsl:value-of select="profile/education/now"/>
	                 		</xsl:attribute>

	                 		 <xsl:attribute name="readonly">readonly</xsl:attribute>
					 	 		 
	                 		
	             		 </input>   
	                 </p>   
					 <span class="text">present</span>
					

					 <p id="heading">
						<input type="text"  class="heading"  name="education-past" onclick="edit()" >
				 	 		<xsl:attribute name="value"> 
				 	 			 <xsl:value-of select="profile/education/past"/>
                 			</xsl:attribute>
                 		 <xsl:attribute name="readonly">readonly</xsl:attribute>		 
                 		
             		 </input>

					 </p>
					 

					 <span class="text">past</span>
					 <p class="linkedit">Edit</p>
				 </div>
			 </div>
			 
			 <div class="cinfoContainer">
				 <div class="Cinfo">
					<p id="topic">Contact information</p>
					<p id="heading">Home</p>
					<hr></hr>
					<p id="heading">Phone<span class="answer"><xsl:value-of select="profile/contacts/phone"/></span></p>
					<p id="heading">Work</p>
					<hr></hr>
					<p id="heading">Email<span class="answer"><xsl:value-of select="profile/contacts/email"/></span></p>
					<p class="edit">Edit</p>
				 </div>
			 </div>
		
		 </div>
			 	 
		 <div class="clm">
		 <div class="plcontainer">  
			<div class="places">
				 <p id="topic">Places</p>
				 <div id="map-canvas"></div>
				 <p class="edit"></p>
		
				 <p id="heading">Currently </p>
				 <span class="text" id="address"><xsl:value-of select="profile/places/place"/></span>
				 <p class="edit">Edit</p>
			 </div>
		 </div> 
     
		 <div class="linkscontainer">
			 <div class="links">
				 <p id="topic">Links</p>

				 <p id="heading">Other profiles</p>
				 <hr></hr>
				 <span class="text"><xsl:value-of select="profile/links/link[3]"/></span>
				 <p id="heading">Contributor to</p>
				 <hr></hr>
				 <span class="text"><xsl:value-of select="profile/links/link[2]"/></span>
				 <p id="heading">Links</p>
				 <hr></hr>
				 <span class="text"><xsl:value-of select="profile/links/link[1]"/></span>
				 <p class="linkedit"> Edit</p>
			 </div>
		 </div>	
	 
	 </div>
	 
	 
	</div>

	
	</body>

	
	
	
</html>

</xsl:template>
</xsl:stylesheet>


