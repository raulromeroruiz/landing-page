$(document).ready(function() {
	//event.preventDefault()
	app.init();
});

//Global vars 
var move = false, 
	slider_active = "online", 
	CATEGORIAS = ['online', 'tv-video', 'computo', 'celulares', 'electrohogar', 'muebles', 'dormitorio', 'deco', 'deporte', 'infantil', 'calzado', 'belleza-y-accesorios', 'online'],

	PATH = (location.host.indexOf('ripley')>-1) ? "http://www.ripley.com.pe/minisitios/campana/cyber-mama-4/":"",
	BASE = "cyber-mama",

	filters_created = false, 
	MARKETING_RIBBON = $('.marketing-ribbon');

var app = {
	filters: null, 
	init: function(){

		console.log(isMobile);
		console.log(':: BC ::');

		var  _heightHeader = $('.ripley-header').outerHeight(true),
		_heighCatalog = $('.catalog-header-event').outerHeight(true);
		if (!isMobile.any) {
			//Functions for desktop
			offset_filtros = MARKETING_RIBBON.height();
			$(window).scroll(function () {
				var fromTop = $(this).scrollTop();
				// console.log("fromTop", fromTop, "sector_filtros", _top_filtros);
				if (fromTop > offset_filtros) {

				} else {
					
				}
			});
		}
		else {
			console.log('isMobile');
			if (isMobile.any && $(window).width()>=992) {
				$(window).scroll(function () {
					
				});
			}

			if ($(window).width()<767) {
				$('#btn-mobile').click(function(event) {
					$('.nav').toggleClass("collapse-movil");
				});

				$('#main-menu li a').click(function(event) {
					$('.nav').toggleClass("collapse-movil");
				});

				$('span.text').remove('br');
				console.log('dskjdl');
			}

			_top_nav = $('.nav').offset().top;
			offset_nav = _top_nav - MARKETING_RIBBON.height();
			$(window).scroll(function(event) {
				var fromTop = $(this).scrollTop();

				// console.log("fromTop", fromTop);
				// console.log("nav-bar", $('.nav').offset().top);
				//if (fromTop > $('.ripley-header').innerHeight() ) {
				if ( fromTop > offset_nav ) {
					$('.nav')
					.addClass("fixed")
					.css({
						top: MARKETING_RIBBON.height()
					});
					//$('.nav').addClass('fixed');
				} else {
					$('.nav')
					.removeClass('fixed')
					.removeAttr('style');
					//$('.nav').removeClass('fixed');
				}
			});
		}

		$(window).scroll(function () {
			console.log($('#sector_productos .stickIt').length);
			if ($('#sector_productos .stickIt').length) {
				_sticky2 = $('#sector_productos .stickIt');
				_posSector = _sticky2.offset();
				if ($('.ripley-footer').offset().top <= (_posSector.top + _sticky2.height())) {
					$('#sector_productos').fadeOut();
					console.log('Esconder')
				}
				else {
					$('#sector_productos').fadeIn();
					console.log('Mostrar')
				}
			}
		});

		window.onresize = function() {
			console.log('resize');
			if ($(window).width()<=768) {
				// app.slider();
				return false;
			}
		}

		this.slider({});
	},

	slider: function(_params) {
		console.log(_params);
		//console.log('active index ', CATEGORIAS.indexOf(slider_active));
		$("#slider-bc").slick({
			// fade: true,
			dots: false,
			speed: 1500,
			slidesToShow: 1,
			autoplay: false,
			autoplaySpeed: 1500,
		});
	},

	// Methods for All Sliders

	scrolling: function(_hash, _speed) {
		//console.log(_hash);
		//location.hash = _hash;
		if ($( _hash ).length>0) {
			$('html, body').animate({
				scrollTop: $( _hash ).offset().top
			}, _speed, function(){
				//location.hash = _hash;
				var item = $('.submenu li a').map(function(index, elem) {
					if ($(this).attr('href')==_hash){
						return index;
					}
				});
				$('.submenu li a').removeClass('active');
				$('.submenu li a').eq(item[0]).addClass('active');
			});
		}
		return false;
	},

}

window.onload = function() {
	$('#container')
	.animate({opacity:1}, 500);
	$('.loader').fadeOut('slow', function() {
		$('.loader').remove();
	});
}