var gameSound = true;
var isPaused = false;

//Usar js puro para evitar incompatibilidade nos navegadores
var somGameover = document.getElementById("somGameover");
var capture = document.getElementById("capture");
var Xplosion = document.getElementById("Xplosion");
var crash = document.getElementById("crash");
var startGame = document.getElementById("startGame");
var energy = document.getElementById("energy");


function controlSound() {
	var div = $( "#som" );

	if (div.hasClass("off")) {
		div.removeClass("off");
		gameSound = true;
	} else {
		div.addClass("off");
		gameSound = false;
	}
}

//Música em loop
// musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
// musica.play();

function start() { // Inicio da função start()

	somGameover.pause();
	somGameover.currentTime = 0;

	if (gameSound === true) {
		startGame.play();
	}

	$("#inicio").addClass("hidden");
	$("#baloon").removeClass("hidden");
	$("#placar").removeClass("hidden");
	$("#energia").removeClass("hidden");	

	setTimeout(
		function() {
			$("#container, #baloon").addClass('ready');		
			$("#fundoGame").append("<div id='jogador' class=''><img src='./img/hipster.png' class='jogador'></div>");	
		}, 1500);

	setTimeout(
		function() {						
			$("#fundoGame").append("<div id='objeto' class='object_falling'><img src='img/hat2.png' tipo='good'></div>");
		}, 
	2500);	

	setTimeout(
		function() {	
			$("#jogador").addClass('ready');			
		}, 
	1600);

	//Principais variáveis do jogo
		
	var jogo = {}

	var velocidade = 6;
	var cont = 0;
	var posicaoY = parseInt(Math.random() * 500);
	var podeAtirar = true;
	var fimdejogo = false;
	var pontos = 0;
	var salvos = 0;
	var energiaAtual = 6;
	var qtdObjetos = 1;
	var move = true;

	var TECLA = {
		lt: 37,
		rt: 39,
		bar: 32
	}

	var imagesArray = [
		{nameImg: "tie1.png", tipoImg: "good"}, 
		{nameImg: "tie2.png", tipoImg: "good"},  
		{nameImg: "tie3.png", tipoImg: "good"},  
		{nameImg: "tie4.png", tipoImg: "good"},
		{nameImg: "tie5.png", tipoImg: "good"}, 
		{nameImg: "tie6.png", tipoImg: "good"},  
		{nameImg: "tie7.png", tipoImg: "good"},  
		{nameImg: "tie8.png", tipoImg: "good"},
		{nameImg: "glass1.png", tipoImg: "good"}, 
		{nameImg: "glass2.png", tipoImg: "good"},  
		{nameImg: "glass3.png", tipoImg: "good"}, 
		{nameImg: "hat1.png", tipoImg: "good"},  
		{nameImg: "hat2.png", tipoImg: "good"},
		{nameImg: "shirt.png", tipoImg: "good"},
		{nameImg: "shirt2.png", tipoImg: "good"},
		{nameImg: "shirt3.png", tipoImg: "good"},
		{nameImg: "shirt4.png", tipoImg: "good"},
		{nameImg: "shirt5.png", tipoImg: "good"}, 
		{nameImg: "sneaker2left.png", tipoImg: "good"},
		{nameImg: "paints.png", tipoImg: "good"},
		{nameImg: "paints2.png", tipoImg: "good"},
		{nameImg: "paints3.png", tipoImg: "good"},
		{nameImg: "paints4.png", tipoImg: "good"},
		{nameImg: "paints5.png", tipoImg: "good"},
		{nameImg: "paints6.png", tipoImg: "good"},
		{nameImg: "banner.png", tipoImg: "bad"}, 		
		{nameImg: "plant1.png", tipoImg: "bad"}, 
		{nameImg: "wine.png", tipoImg: "bad"},  		 
		{nameImg: "bike.png", tipoImg: "bad"}, 
		{nameImg: "umbrella.png", tipoImg: "bad"}
		,  	
		{nameImg: "plant2.png", tipoImg: "bad"},
		{nameImg: "plant2.png", tipoImg: "bad"},
		{nameImg: "bomb1.png", tipoImg: "boom"},
		{nameImg: "bomb2.png", tipoImg: "boom"},
		{nameImg: "bomb3.png", tipoImg: "boom"},
		{nameImg: "bomb4.png", tipoImg: "boom"},
		{nameImg: "bomb5.png", tipoImg: "boom"},
		{nameImg: "bomb6.png", tipoImg: "boom"},
		{nameImg: "bomb7.png", tipoImg: "boom"},
		{nameImg: "bomb8.png", tipoImg: "boom"},
		{nameImg: "heart.png", tipoImg: "life"} 
	];

	// Exibe imagem aleatória

	function displayImage () {
	 	var path = 'img/';
	    var RandomNum = Math.floor(Math.random() * imagesArray.length); 
	    object = path + imagesArray[RandomNum].nameImg;
	    tipoObj = imagesArray[RandomNum].tipoImg;

	    if (tipoObj == "life" && energiaAtual == 6) {
	    	displayImage();
	    }
	}
	// fim da função displayImage()


	if (move == true) {		
		jogo.pressionou = [];

		//Verifica se o usuário pressionou alguma tecla	
		
		$(document).keydown(function(e){
			jogo.pressionou[e.which] = true;
			// $("#jogador img.jogador").attr("src", "./img/hipster3.png");

			if (jogo.pressionou[TECLA.bar]) {			
				if(isPaused === false){
					isPaused = true;
					$('#pause').removeClass('hidden');
				} else {
					isPaused = false;
					$('#pause').addClass('hidden');
				}
			}
		});


		$(document).keyup(function(e){
			jogo.pressionou[e.which] = false;
			// $("#jogador img.jogador").attr("src", "./img/hipster.png");
		});

	}

	//Touch
	
	$("#jogador")
        .hammer({ drag_max_touches:0})
        .on("touch drag", function(ev) {
            var touches = ev.gesture.touches;

            ev.gesture.preventDefault();

            for(var t=0, len=touches.length; t < len; t++) {
                var target = $(touches[t].target);
                target.css({
                    zIndex: 1337,
                    top: touches[t].pageY-50
                });
				
				//Limita movimentação
				
				var topo = parseInt($("#jogador").css("top"));
	
				if (topo <= 0) {				
					$("#jogador").css("top", 0);				
				}
				
				if (topo >= 410) {				
					$("#jogador").css("top", 434);				
				}
        }
    });	

	//Game Loop

	jogo.timer = setInterval(loop, 30);

	function loop() {
		if (!isPaused) {
			movejogador();
			moveObjeto();
			//se for mobile incluir função disparo()
			//disparo();	
			colisao();
			placar();
			energia();
		}
	
	} // Fim da função loop()

	function movejogador() {
		
		if (move == true) {
			if (jogo.pressionou[TECLA.lt]) {
				var left = parseInt($("#jogador").css("left"));
				$("#jogador").css("left", left - 10);

				if (left <= 0) {				
					$("#jogador").css("left", 0);
				}			
			
			}
			
			if (jogo.pressionou[TECLA.rt]) {			
				var left = parseInt($("#jogador").css("left"));
				$("#jogador").css("left", left + 10);

				if (left >= 485) {	
					$("#jogador").css("left", 485);
				}
			}
		}

	} // fim da função movejogador()		

	function moveObjeto() {

		$( ".object_falling" ).each(function(index) {
		  $( this ).css("top", parseInt($(".object_falling").eq(index).css("top")) + velocidade);
		  $( this ).css("left", posicaoY);
		  console.log(index)
		});

		// $("#objeto").css("top", parseInt($("#objeto").css("top")) + velocidade);
		// $("#objeto").css("left", posicaoY);

		if (parseInt($(".object_falling").css("bottom")) <= 0) {
			if ($('.object_falling img').attr('tipo') == 'good') {
				energiaAtual--;		
			}
			posicaoY = parseInt(Math.random() * 500);	
			$( ".object_falling" ).each(function( ) {
				$(this).css("top", - 80);
				$(this).css("left", posicaoY);
				displayImage();
				$( ".object_falling img").attr({src: object, tipo: tipoObj});	
			});		
		}

	} // fim da função moveObjeto()	

	function colisao() {
		var colisao1 = ($("#jogador").collision($("div[id*='objeto']")));


		// jogador com o objeto
			
		if (colisao1.length > 0) {	

			if ($('.object_falling img').attr('tipo') == 'good') {

				if (gameSound === true) {
					capture.play();
				}
				
				cont++;

				if (cont == 4) {
					velocidade = velocidade + 0.4;
					cont = 0;
					qtdObjetos++;
					// $("#fundoGame").append("<div id='objeto" + qtdObjetos +" class='object_falling'><img src='"+ object +"' tipo='"+ tipoObj +"'></div>");
					// console.log('quantidade: ' + qtdObjetos);
				}

				salvos++;
				pontos = pontos + 5;

			} 

			if ($('div[id*="objeto"] img').attr('tipo') == 'life') {

				if (gameSound === true) {
					energy.play();
				}
			
				energiaAtual++;
			}

			if ($('div[id*="objeto"] img').attr('tipo') == 'bad') {

				if (gameSound === true) {
					crash.play();
				}
				
				move = false;

				var gamer = $("#jogador img.jogador")
				gamer.attr("src", "./img/Hipster-dizziness.gif");

				setTimeout(
					function() {	
						$("#jogador img.jogador").attr("src", "./img/hipster.png");					
						move = true;
					}, 
				2500);	

				energiaAtual--;
			}

			if ($('div[id*="objeto"] img').attr('tipo') == 'boom') {
				move = false;
				
				if (gameSound === true) {
					Xplosion.play();
				}
				
				$("#jogador img").attr("src", "./img/explosao.png");
				$("#jogador img").addClass("explosion");

				setTimeout(
					function() {						
						gameOver();
					}, 
				1000);				
			}	

			reposicionaObjeto();
			$("div[id*='objeto']").remove();

		}		


	} //Fim da função colisao()

	


	//Reposiciona reposicionaObjeto
	
	function reposicionaObjeto() {
	
		var tempoAmigo = window.setInterval(reposiciona, 500);
	
		function reposiciona() {
			window.clearInterval(tempoAmigo);
			tempoAmigo = null;
			
			if (fimdejogo == false) {
				displayImage();
				$("#fundoGame").append("<div id='objeto' class='object_falling'><img src='" + object + "' tipo='" + tipoObj + "'/></div>");
				posicaoY = parseInt(Math.random() * 500);
				$(".object_falling").css("top",-100);
				$(".object_falling").css("left",posicaoY);
			
			}
			
		}
		
	} // Fim da função reposicionaObjeto()	

	function placar() {
		
		$("#placar").html("<img src='img/pontos2.png'><span>" + pontos + "</span>");
		
	} //fim da função placar()	

	//Barra de energia

	function energia() {
		if (energiaAtual==6) {
			
			$("#energia").css("background-image", "url(img/energia6.png)");
		}

		if (energiaAtual==5) {
			
			$("#energia").css("background-image", "url(img/energia5.png)");
		}
		if (energiaAtual==4) {
			
			$("#energia").css("background-image", "url(img/energia4.png)");
		}
	
		if (energiaAtual==3) {
			
			$("#energia").css("background-image", "url(img/energia3.png)");
		}
	
		if (energiaAtual==2) {
			
			$("#energia").css("background-image", "url(img/energia2.png)");
		}
	
		if (energiaAtual==1) {
			
			$("#energia").css("background-image", "url(img/energia1.png)");
		}
	
		if (energiaAtual==0) {
			
			$("#energia").css("background-image", "url(img/energia0.png)");
			
			gameOver();

		}
	
	} // Fim da função energia()	

	//Função GAME OVER
	function gameOver() {
		fimdejogo = true;
		//musica.pause();
		if (gameSound === true) {
			somGameover.play();
		}
		
		window.clearInterval(jogo.timer);
		jogo.timer = null;
		
		$("#jogador, div[id^='objeto']").remove();
		$("#energia, #baloon, #placar").addClass('hidden');		
		$("#fim").removeClass('hidden');
		$("#container, #baloon").removeClass('ready');
		$("#fim .qtdPontos").html(pontos);
	} // Fim da função gameOver();	

} // Fim da função start


//Reinicia o Jogo
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").addClass('hidden');
	start();	
} //Fim da função reiniciaJogo	
