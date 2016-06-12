//Recuperation de la taille de l'ecran


var keysPressed = [];
var bgPosition = 0;
var shipYPosition = 10;
var shipImgCpt = 1;

$(document).ready(function() {
	$("#board").css({
		height : $( window ).height() + "px"
	});
	 $( window ).resize(function() {
		$("#board").css({
				height : $( window ).height() + "px"
		});
	 });
	$(document).keydown(function(e) {
		// console.log("keyPressed ! " + e.keyCode);
		
		if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault();
		else keysPressed[e.keyCode] = true;
			
	});
	$(document).keyup(function(e) {
		
		if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault();
		else if (e.keyCode == 32) shot();
		else keysPressed[e.keyCode] = false;
	});
});

setInterval(function() {
	if (keysPressed[81])
		goLeft();
	if (keysPressed[68])
		goRight();
}, 5);

setInterval(function() {
	bgPosition += 3;
	$("#board").css({
		"background-position": ("center " + bgPosition + "px")
	}, function() {
		if(bgPosition == 2560){
			bgPosition=0;
		}
	});
}, 50);

setInterval(function() {
	
	$("#ship").animate({
		"bottom": shipYPosition + "px"
	},400, function() {
		if(shipYPosition == 10){
			shipYPosition = 20;
		} else{
			shipYPosition = 10;
		}
	});
}, 400);

setInterval(function() {
	if(shipImgCpt == 4){
		shipImgCpt = 0;
	}
	shipImgCpt++;
	$("#ship").css({
		"background-image": "url('data/css/ship_" + shipImgCpt + ".png')"
	}, function() {
		
	});
}, 100);


function shot(){
	var wShot = $("#ship").css("left").replace("px","");
	
	$('<div></div>')
	.addClass('bullet')
	.css({
		left: (parseInt(wShot) + 27) + "px",
		bottom: 98
	})
	.appendTo($('#board'))
	.animate({
		top: -20
	},1000,function() {
	});
	
}

function goLeft() {
	if($("#ship").css("left").replace("px","") >0){
		$("#ship").css({
			left : "-=3"
		});
	}
}

function goRight() {
	if($("#ship").css("left").replace("px","") <1200){
		$("#ship").css({
			left : "+=3"
		});
	}
}
