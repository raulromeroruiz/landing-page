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
		console.log('::Cierra Puertas::');

		var sticky = $('.stickIt');
		_top = sticky.position().top;
		_height = sticky.height();
		_heightHeader = $('.ripley-header').outerHeight(true);
		_heighCatalog = $('.catalog-header-event').outerHeight(true);
		if (!isMobile.any) {
			//Functions for desktop
			_top_filtros = $('.sector_filtros').offset().top;
			offset_filtros = _top_filtros - MARKETING_RIBBON.height();
			$(window).scroll(function () {
				var fromTop = $(this).scrollTop();
				// console.log("fromTop", fromTop, "sector_filtros", _top_filtros);
				if (fromTop > offset_filtros) {
					$('.sector_filtros')
					.addClass("fixed")
					.css({
						top: MARKETING_RIBBON.height()
					});
					$('#sector_productos .stickIt')
					.addClass("fixed")
					.css({
						top: MARKETING_RIBBON.height() + $('.sector_filtros').height()
					})
					// $('.stickIt').addClass("fixed");
				} else {
					$('.sector_filtros')
					.removeClass('fixed')
					.removeAttr('style');
					$('#sector_productos .stickIt')
					.removeClass('fixed')
					.removeAttr('style');
					// $('.stickIt').removeClass('fixed');
				}
			});
		}
		else {
			console.log('isMobile');
			_top_filtros = $('.sector_filtros').offset().top;
			offset_filtros = _top_filtros - MARKETING_RIBBON.height();
			if (isMobile.any && $(window).width()>=992) {
				$(window).scroll(function () {
					var fromTop = $(this).scrollTop();
					// console.log("fromTop", fromTop, "sector_filtros", _top_filtros);
					//if ($(this).scrollTop() > (_heighCatalog + _heightHeader)) {
					if (fromTop > offset_filtros) {
						$('.sector_filtros')
						.addClass("fixed")
						.css({
							top: MARKETING_RIBBON.height()
						});
						$('#sector_productos .stickIt')
						.addClass("fixed")
						.css({
							top: MARKETING_RIBBON.height() + $('.sector_filtros').height()
						})
					} else {
						$('.sector_filtros')
						.removeClass('fixed')
						.removeAttr('style');
						$('#sector_productos .stickIt')
						.removeClass('fixed')
						.removeAttr('style');
					}
				});
			}

			if ($(window).width()<992) {
				$('#btn-mobile').click(function(event) {
					$('.nav-bar').toggleClass("collapse-movil");
				});

				$('#main-menu li a').click(function(event) {
					$('.nav-bar').toggleClass("collapse-movil");
				});
				if(isMobile.tablet) {
					if ($('#sector_productos').length) {
						_top_filtros = $('#sector_productos').offset().top;
						offset_filtros = _top_filtros - MARKETING_RIBBON.height() - $('.nav-bar').height();
						$(window).scroll(function () {
							var fromTop = $(this).scrollTop();
							// console.log("fromTop", fromTop, "sector_filtros", _top_filtros);
							//if ($(this).scrollTop() > (_heighCatalog + _heightHeader)) {
							if (fromTop > offset_filtros) {
								$('#sector_productos .stickIt')
								.addClass("fixed")
								.css({
									top: MARKETING_RIBBON.height() + $('.nav-bar').height()
								})
							} else {
								$('#sector_productos .stickIt')
								.removeClass('fixed')
								.removeAttr('style');
							}
						});
					}
				}
			}

			_top_nav = $('.nav-bar').offset().top;
			offset_nav = _top_nav - MARKETING_RIBBON.height();
			$(window).scroll(function(event) {
				var fromTop = $(this).scrollTop();

				// console.log("fromTop", fromTop);
				// console.log("nav-bar", $('.nav-bar').offset().top);
				//if (fromTop > $('.ripley-header').innerHeight() ) {
				if ( fromTop > offset_nav ) {
					$('.nav-bar')
					.addClass("fixed")
					.css({
						top: MARKETING_RIBBON.height()
					});
					//$('.nav-bar').addClass('fixed');
				} else {
					$('.nav-bar')
					.removeClass('fixed')
					.removeAttr('style');
					//$('.nav-bar').removeClass('fixed');
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

		// path = location.pathname.split('/');
		path = location.pathname;
		var search = path.match(/cierra-puertas-(.*)\//);
		// console.log(path);
		// console.log(search);
		// uri = path[path.length-2];
		uri = Array.isArray(search) ? search[1]:"";
		console.log("URI",uri);

		// uri = (uri=="") ? CATEGORIAS[0]:uri;
		//console.log(uri);
		$('.sector_filtros .filter').each(function(index, el) {

			if($(el).attr('class').indexOf(uri)>0) {
				$('.sector_filtros .filter').removeClass('active');
				$(el).addClass('active');
				//$('.current-category').text($(el).find('.text').text());
				console.log('current ->', $('#main-menu li a').eq(index).text());
				$('.current-category').text($('#main-menu li a').eq(index).text());
				//return;
			}
		});
		params = {
			'categoria': uri
		}

		this.slider();

		$.ajax({
			url: '//cdm.blogr.oo.gd/ripley/ventamillon/dates.php',
			cache: false,
			contentType: false,
			processData: false,
			success: function(data){
				console.log(data);
				path_logo =  PATH + 'assets/logo-campaign-7.png';
				if (data>1) {
					path_logo =  PATH + 'assets/logo-campaign-8-9.png';
				}
				$('.logo-campaign').find('img').attr('src', path_logo);
			},
			error: function(XHR, textStatus, errorThrown){
			}
		});
	},

	slider: function(_params) {
		// console.log(_params);
		//console.log('active index ', CATEGORIAS.indexOf(slider_active));
		$("#slider-bc").slick({
			dots: true,
			infinite: true,
			speed: 1000,
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