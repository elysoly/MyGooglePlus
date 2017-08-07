<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">

  <html>
  <script src="http://maps.googleapis.com/maps/api/js"></script>
  <body>
	
    <div class="nav-container">
		<div class="nav">
			<ul>
			<li><a href="Home.html">Home</a></li>
			<li><a href="Profile.html">Profile</a></li>
			<li><a href="View more.html">View more</a></li>
			<li></li>
			</ul>
			<button type="button" class="logout-btn" onclick="advancedSearch()" > Advanced Search</button>

		</div> 
	</div> 
	
	<div class="base">
		<div id="upside">
		<p id="topic"> More Suggestions</p>
		<div> People you may know in Google+</div>
		</div>
		
	
	
	<xsl:variable name="vNumCols" select="3"/>
   <xsl:for-each select=
     "/people/person[position() mod $vNumCols = 2]">

     <div class="row" >
       <xsl:for-each select=
       ". | following-sibling::*
                 [not(position() >= $vNumCols)]">
        
		 <div class="friend">
		 <div class="vmpiccontainer">
		 <a href=" ">
			<img class="vmpic">
			  <xsl:attribute name="src">
						<img src="" alt=""/>
						<xsl:value-of select="image"/>
			  </xsl:attribute>
			</img>
		 </a>
		 </div>
		 <div class =" pad">
			<p id="name">
				<xsl:value-of select="name"/>
				</p>
			
			
			<div class="ws text">
			<xsl:value-of select="about"/>
			</div>

			<span class="fri ws ">
			<b> <xsl:value-of select="matualFreind"/> </b>
			</span> 
			
			
			<div>
			<button class="btn" type="button">  <img class="fimg" src="../images/Home Pic/12.png" /> Add</button>
            </div>
			
			
			
		</div>

		</div>
		
		
       </xsl:for-each>
     </div>
   </xsl:for-each>
 
	
	
	
		</div>
	 
  
  

	

		

  </body>
  </html>

</xsl:template>
</xsl:stylesheet>