var i = 0
var j = 0
var k = 0

function getRand(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function unorderArray(lon){
	var unorder_array = []
	while(unorder_array.length<lon){
		var n = getRand(0,(lon-1))
		if(!unorder_array.includes(n)){
			unorder_array.push(n)
		}
	}
	return unorder_array
}

var game = getE('game')
var game_scene = getE('game-scene')
game_scene.style.visibility = 'hidden'
var game_rect = game.getBoundingClientRect()

function setInstrucciones(start){
	var html = ''
	/*if(ismobile){
		html+='<div class="modal-instrucciones-gif"><div onclick="setVideoInstrucciones(this)"><video loop><source type="video/mp4" src="assets/images/instrucciones_sp.mp4" /></video><button></button></div></div>'
	}else{
		html+='<div class="modal-instrucciones-gif"><div onclick="setVideoInstrucciones(this)"><video loop><source type="video/mp4" src="assets/images/instrucciones_pc.mp4" /></video><button></button></div></div>'
	}*/
	
	html+='<p>Responde todas las preguntas que aparezcan en tu camino para ganar el juego.</p>'
	html+='<p>Evita responder de forma incorrecta o <span>Juan</span> se caerá de los edificios.</p>'
	
    if(start){
    	setModal({
			content:html,
			button:true,
			value:'jugar',
			action:'empezarJuego'
	    })
    }else{
    	setModal({
			content:html,
			button:true,
			value:'aceptar',
			action:'seguirJuego'
	    })
    }
}

var animacion_swipe = null
function empezarJuego(){
	getE('cargador').className = 'cargador-on'
	getE('cargador_txt').innerHTML = 'Iniciando'
	unsetModal(function(){
		game_scene.style.visibility = 'visible'
		getE('home-scene').style.display = 'none'

		/*setTooltip({
			content:'<p><span>¡Viste a Juan para '+oficios[actual_job].name+'!</span><br />Haz clic en las puertas de los casilleros y arrastra  la prenda hacia Juan.</p>',
			delay:4000
		})*/
		
		getE('cargador').className = 'cargador-off'

		startGame()		
	})
}

var animacion_entrada = null
var preguntas_data = []
var orden_preguntas = []
var orden_opciones = []
var actual_pregunta = 0
var actual_parte = 1

function setGame(){
	orden_preguntas = unorderArray(preguntas.length)
	//poner personaje y fondos en 0
	setPersonaje('r')
	getE('camara').className = 'camara-init'
	////////AQUI EMPIEZA TODOO///////
		
	animation_start = setTimeout(function(){
		clearTimeout(animation_start)
		animation_start = null

		getE('cargador').className = 'cargador-off'	
		setInstrucciones(true)
	},1000)

	//spdPlayMovieclip({frame:1,stop:0,loop:true},0)
	//spdStopMovieclip(0)
	//spdSetMovieclip({id:3,f:1})
}

function setPersonaje(key){
	getE('personaje_recorrido').style.display = 'none'
	getE('personaje_salto').style.display = 'none'
	getE('personaje_balancea').style.display = 'none'

	switch(key){
		case 'r':
		getE('personaje_recorrido').style.display = 'block'
		break;
		case 's':
		getE('personaje_salto').style.display = 'block'
		break;
		case 'b':
		getE('personaje_balancea').style.display = 'block'
		break;
	}
}

function startGame(){
	getE('game-wrapper').classList.remove('game-wrapper-zoom-in')
	getE('game-wrapper').classList.add('game-wrapper-zoom-out')
	animacion_entrada = setTimeout(function(){
		clearTimeout(animacion_entrada)
		animacion_entrada = null

		//llamar la parte
		setParte()
	},1000)
}

function nextParte(){
	if(actual_parte==1){
		actual_parte = 2
	}else if(actual_parte==2){
		actual_parte = 3
	}
}

function setParte(){
	setPersonaje('r')
	getE('camara').className = 'camara-parte'+actual_parte
	getE('fondo-2').className = 'fondo-2-start fondo-2-play'

	if(actual_parte==1){
		spdPlayMovieclip({frame:1,stop:62,loop:false,end:function(){
			
			//console.log("pregunta")
			getE('fondo-2').classList.remove('fondo-2-play')
			getE('fondo-2').classList.add('fondo-2-stop')
	        setPregunta()
	    }},0)
	    /*var animacion_fake = setTimeout(function(){
	    	clearTimeout(animacion_fake)
	    	animacion_fake = null
	    	spdStopMovieclip(1)

	    },3000)*/
	}else if(actual_parte==2){
		spdPlayMovieclip({frame:63,stop:128,loop:false,end:function(){
			
			//console.log("pregunta")
			getE('fondo-2').classList.remove('fondo-2-play')
			getE('fondo-2').classList.add('fondo-2-stop')
	        setPregunta()
	    }},0)
	}else if(actual_parte==3){
		spdPlayMovieclip({frame:129,stop:150,loop:false,end:function(){
			
			//volver a empezar
			actual_parte = 1
			getE('camara').className = 'camara-init'
			setParte()
	    }},0)
	}
	
}

var letras = ['a','b','c','d']
function setPregunta(){
	orden_opciones = unorderArray(preguntas[actual_pregunta].respuestas)
	var h = '<h1>'+(actual_pregunta+1)+' - '+preguntas[actual_pregunta].pregunta+'</h1>'
	for(i = 0;i<preguntas[actual_pregunta].respuestas.length;i++){
		h+='<h6 onclick="clickRespuesta('+i+')"><span>'+letras[i]+')</span> '+preguntas[actual_pregunta].respuestas[i].respuesta+'</h6>'
	}

	setModal({
		content:h,
		button:false
    })
}

function clickRespuesta(r){
	if((r+1)==preguntas[actual_pregunta].correcta){
		//bien, seguir
		actual_pregunta++
		console.log("sumó: "+actual_pregunta)
		unsetModal(function(){
			setPasa()
		})
	}else{
		unsetModal(function(){
			setCaida()
		})
	}
}

function setPasa(){
	if(actual_parte==1){
		nextParte()
		setParte()
	}else if(actual_parte==2){
		nextParte()
		setParte()
	}
}

function setCaida(){
	setPersonaje('s')
	getE('personaje_salto').className = 'spd_movieclip personaje-salto-'+actual_parte

	spdPlayMovieclip({frame:1,stop:23,loop:false,end:function(){
		setPersonaje('b')
		getE('personaje_balancea').className = 'personaje-balancea-start personaje-salto-'+actual_parte
		
		setModal({
			content:'<p>Has perdido, inténtalo de nuevo</p>',
			button:true,
			value:'continuar',
			action:'intentarNuevamente'
	    })
    }},1)
}

var animacion_alfa = null
function intentarNuevamente(){
	getE('alpha').className = 'alpha-on'
	
	unsetModal(function(){
		//limpiar todo

		getE('camara').className = 'camara-parte'+actual_parte+'-fixed'
		animacion_alfa = setTimeout(function(){
			clearTimeout(animacion_alfa)
			animacion_alfa = null
			getE('alpha').className = 'alpha-off'
			setParte()
		},100)
		
	})
}

////////////////GAME FUNCTIONS///////////////////////

function endGame(){
	
}

function repeatGame(){//repetir por ganar el juego
	location.reload()
	//unsetModal(function(){
		
	//})
}

function reiniciarJuego(){//reiniciar, por acabarse el tiempo
	
}

function continuarJuego(){
	
}
function seguirJuego(){//funcion para el modal
	unsetModal(function(){
		continuarJuego()
	})
}

function getE(idname){
	return document.getElementById(idname)
}

function clickAudio(btn){
	if(btn.className=='music-on'){
		//cronometro_mp3.volume = 0
		btn.className = 'music-off'
	}else{
		//cronometro_mp3.volume = 1
		btn.className = 'music-on'
	}
}