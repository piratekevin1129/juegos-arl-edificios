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
	setPersonaje('c1')
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

function setCuerda(key){
	switch(key){
		case 'c':
		//
		break;
		case 'c1':
		//
		break;
		case 'c2':
		//
		break;
		case 's1':
		//
		break;
		case 's2':
		//
		break;
	}
}

function setPersonaje(key){
	getE('personaje_camina_1').style.display = 'none'
	getE('personaje_camina_2').style.display = 'none'
	getE('personaje_salto_1').style.display = 'none'
	getE('personaje_salto_2').style.display = 'none'
	getE('personaje_caida').style.display = 'none'

	switch(key){
		case 'c':
		getE('personaje_caida').style.display = 'block'
		break;
		case 'c1':
		getE('personaje_camina_1').style.display = 'block'
		break;
		case 'c2':
		getE('personaje_camina_2').style.display = 'block'
		break;
		case 's1':
		getE('personaje_salto_1').style.display = 'block'
		break;
		case 's2':
		getE('personaje_salto_2').style.display = 'block'
		break;
	}
}

function startGame(){
	getE('game-wrapper').classList.remove('game-wrapper-zoom-in')
	getE('game-wrapper').classList.add('game-wrapper-zoom-out')
	animacion_entrada = setTimeout(function(){
		clearTimeout(animacion_entrada)
		animacion_entrada = null

		setParte()
		
	},500)
	
}

function setParte(){
	if(actual_parte==1){
		getE('fondo-1').className = 'fondo-parte1'
		getE('personaje_mc').className = 'personaje-parte1'
		
		spdPlayMovieclip({frame:1,stop:74,loop:false,end:function(){
			
			console.log("pregunta")
	        setPregunta()
	    }},1)
	}
	
}

function setCaida(){
	setPersonaje('c')
	getE('personaje_mc').className = 'personaje-caida'
	spdPlayMovieclip({frame:1,stop:39,loop:false,end:function(){
		
		console.log("cayó")
		setModal({
			content:'<p>Has perdido, inténtalo de nuevo</p>',
			button:true,
			value:'continuar',
			action:'intentarNuevamente'
	    })
    }},0)
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
	}else{
		unsetModal(function(){
			setCaida()
		})
		
	}
}

function intentarNuevamente(){
	unsetModal(function(){
		//setCaida()
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