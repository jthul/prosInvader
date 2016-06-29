
setInterval(function(){
	getScore();
}, 5000);
getScore();


function getScore(){
	 $.ajax({
	       url : 'scoreboard_ajax.php',
	       type : 'GET',
	       success : function(code_html, statut){ 
	           $("#listScore").empty().append(code_html);
	       }
	    });
}