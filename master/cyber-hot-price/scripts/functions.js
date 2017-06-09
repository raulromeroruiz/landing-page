$(document).ready(function() {
	//event.preventDefault()
	app.init();
});

//Global vars 
var move = false, 
	slider_active = "ofertas-hot", 
	CATEGORIAS = [
		'ofertas-hot', 
		'tv-y-audio', 
		'laptops-y-tablets', 
		'tecnologia', 
		'electrohogar', 
		'muebles', 
		'dormitorio', 
		'decohogar', 
		'calzado-y-zapatillas', 
		'relojes-y-accesorios',
		'maquinas-y-bicicletas', 
		'juguetes-y-bebes', 
	],

	URL_PAGES = (location.host.indexOf('ripley')>-1) ? "http://www.ripley.com.pe/minisitios/campana/cyber-mama-4/":"",
	BASE = "cyber-mama",

	filters_created = false, 
	MARKETING_RIBBON = $('.marketing-ribbon');
console.log(URL_PAGES);
var app = {
	filters: null, 
	init: function(){

		console.log(isMobile);
		console.log(':: Ress::');

		$('.arrow-scroll').click(function(event) {
			//event.preventDefault();
			app.scrolling( $.attr(this, 'href'), 750);
			return false;
		});

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
				console.log("fromTop", fromTop, "sector_filtros", _top_filtros);
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
					console.log("fromTop", fromTop, "sector_filtros", _top_filtros);
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
						return;
						// $('.stickIt').addClass("fixed");
					} else {
						$('.sector_filtros')
						.removeClass('fixed')
						.removeAttr('style');
						$('#sector_productos .stickIt')
						.removeClass('fixed')
						.removeAttr('style');
						return;
						// $('.stickIt').removeClass('fixed');
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
					_top_filtros = $('#sector_productos').offset().top;
					offset_filtros = _top_filtros - MARKETING_RIBBON.height() - $('.nav-bar').height();
					$(window).scroll(function () {
						var fromTop = $(this).scrollTop();
						console.log("fromTop", fromTop, "sector_filtros", _top_filtros);
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

			_top_nav = $('.nav-bar').offset().top;
			offset_nav = _top_nav - MARKETING_RIBBON.height();
			$(window).scroll(function(event) {
				var fromTop = $(this).scrollTop();
				
				console.log("fromTop", fromTop);
				console.log("nav-bar", $('.nav-bar').offset().top);
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
			_sticky2 = $('#sector_productos .stickIt');
			_posSector = _sticky2.offset();
			//console.log($('.ripley-footer').offset().top);
			//console.log(_posSector.top + _sticky2.height());
			if ($('.ripley-footer').offset().top <= (_posSector.top + _sticky2.height())) {
				$('#sector_productos').fadeOut();
				console.log('Esconder')
			}
			else {
				$('#sector_productos').fadeIn();
				console.log('Mostrar')
			}
		});

		window.onresize = function() {
			console.log('resize');
			if ($(window).width()<=768) {
				// app.slider();
				return false;
			}
		}

		path = location.pathname;
		var search = path.match(/hot-price\/(.*)\//);
		//console.log(search[1]);
		console.log(search);
		// uri = path[path.length-2];
		uri = Array.isArray(search) ? search[1].replace(/\//g, ""):"";
		// console.log(path);
		// console.log(search);

		console.log("URI",uri);
		uri = (uri=="") ? CATEGORIAS[0]:uri;
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
		console.log(uri);
		params = {
			'categoria': uri
		}
		/*
		$('#sponsor').load(URL_PAGES + 'data/'+uri+'.html', function(){
			app.slider(params);
			console.log('complete');
		});
		*/
		$('#sliders').attr('src', URL_PAGES + 'data/'+uri+'.html');

	},

	slider: function(_params) {
		console.log(_params);
		//console.log('active index ', CATEGORIAS.indexOf(slider_active));
		index = CATEGORIAS.indexOf(_params.categoria);
		_ACTIVE_SLIDER = CATEGORIAS[index];

		// $('.slider-banner').fadeOut(500);
		$('#slider-'+ _ACTIVE_SLIDER).fadeIn(1000);
		console.log(_ACTIVE_SLIDER);
		var slider = $('#slider-'+ _ACTIVE_SLIDER +' .banner').bxSlider({
			mode: 'fade', 
			auto: true, 
			infiniteLoop: true,
			//autoControls: true,
			//autoControlsCombine: true,
			nextSelector: '#slider-' + _ACTIVE_SLIDER + ' .slider-next',
			prevSelector: '#slider-' + _ACTIVE_SLIDER + ' .slider-prev',
			onSliderLoad: function() {
				var btn = $('<span></span>')
				.addClass('bx-pause');
				var control = $('<div></div>')
				.addClass('bx-control');
				control.append(btn);
				$('#slider-' + _ACTIVE_SLIDER + ' .bx-default-pager').append(control);
			}
		});

		var restart = null;
		var playing = true;
		$('#slider-' + _ACTIVE_SLIDER + ' .bx-pager-item a').click(function(e){
		  //current = slider.getCurrentSlide();
		    var i = $('.bx-pager-item a').index(this);
		    console.log(i);
		    slider.goToSlide(i);
		    slider.stopAuto();
		    clearTimeout(restart);
		    if (playing) {
		      restart=setTimeout(function(){
		        slider.goToSlide(i+1);
		        slider.startAuto();
		        console.log('Go pager item');
		      }, 7500);
		    }

		    return false;
		});

		$('#slider-' + _ACTIVE_SLIDER + ' .slider-next a').click(function(event) {
		    i = slider.getCurrentSlide(); console.log(i);
		    slider.goToSlide(i);
		    slider.stopAuto();
		    clearTimeout(restart);
		    if (playing) {
		      restart=setTimeout(function(){
		        slider.goToSlide(i+1);
		        slider.startAuto();
		        console.log('Go next');
		      }, 7500);
		    }

		    return false;
		});
		$('#slider-' + _ACTIVE_SLIDER +  '.slider-prev a').click(function(event) {
		    i = slider.getCurrentSlide(); console.log(i);
		    slider.goToSlide(i);
		    slider.stopAuto();
		    clearTimeout(restart);
		    if (playing) {
		      restart=setTimeout(function(){
		        slider.goToSlide(i+1);
		        slider.startAuto();
		        console.log('Go prev');
		      }, 7500);
		    }

		    return false;
		});

		$(document).on('click', '#slider-' + _ACTIVE_SLIDER + ' .bx-control span', function(event) {
		  //console.log(playing);
		  if (playing) {
		    $(this).addClass('bx-play');
		    slider.stopAuto();
		    playing = false;
		  }
		  else {
		    $(this).removeClass('bx-play');
		    slider.startAuto();
		    playing = true;
		  }
		});

		$(document).on('click', '#slider-' + _ACTIVE_SLIDER + ' .bx-controls-auto-item a', function(event) {
		  event.preventDefault();
		  console.log($(event.currentTarget).hasClass('bx-start'));
		  if ($(this).hasClass('bx-start')) {
		    playing = true;
		  }
		  else {
		    playing = false;
		  }
		  /* Act on the event */
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
	$('#container').animate({opacity:1}, 500);
	//alert($(window).width());
	//alert($(window).height());
}