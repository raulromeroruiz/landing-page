$(document).ready(function() {
	//event.preventDefault()
	app.init();
});
var move = false,
	MARKETING_RIBBON = $('.marketing-ribbon');
var app = {
	inputFile: $('#foto').clone(),
	init: function(){
		console.log(isMobile);
		console.log('Samsung');

		$('.arrow-scroll').click(function(event) {
			//event.preventDefault();
			app.scrolling( $.attr(this, 'href'), 750);
			return false;
		});

		if (!isMobile.any) {
			//Functions for desktop
			_top_filtros = $('#mainmenu').offset().top;
			offset_filtros = _top_filtros - MARKETING_RIBBON.height();
			$(window).scroll(function () {
				var fromTop = $(this).scrollTop();
				if (fromTop > offset_filtros) {
					$('#mainmenu')
					.addClass("fixed")
					.css({
						top: MARKETING_RIBBON.height()
					});
				} else {
					$('#mainmenu')
					.removeClass('fixed')
					.removeAttr('style');
				}
			});
		}
		else {
			console.log('isMobile');
			$('#menu-mobile').click(function(event) {
				if ($('.cont-burger').height()==0){
					$('.cont-burger').height(180);
				}
				else {
					$('.cont-burger').height(0);
				}
			});

			if ($(window).width()<768) {
				$('#btn-mobile').click(function(event) {
					$('.nav-bar').toggleClass("collapse-movil");
				});

				$('#main-menu li a').click(function(event) {
					$('.nav-bar').toggleClass("collapse-movil");
				});

				$('.title-menu').click(function(event) {
					event.preventDefault();
					i = $('.title-menu').index(this);
					if ($(this).parent().parent().parent().hasClass('expand')) {
						$('.menu-mobile').eq(i).removeClass('expand');
					}
					else {
						$('.menu-mobile').eq(i).addClass('expand');
					}
				});

				this.sliders();
			}

			_top_filtros = $('#mainmenu').offset().top;
			offset_filtros = _top_filtros - MARKETING_RIBBON.height();
			$(window).scroll(function () {
				var fromTop = $(this).scrollTop();
				if (fromTop > offset_filtros) {
					$('#mainmenu')
					.addClass("fixed")
					.css({
						top: MARKETING_RIBBON.height()
					});
				} else {
					$('#mainmenu')
					.removeClass('fixed')
					.removeAttr('style');
				}
			});

			_top_nav = $('.nav-bar').offset().top;
			offset_nav = _top_nav - MARKETING_RIBBON.height();
			$(window).scroll(function(event) {
				var fromTop = $(this).scrollTop();
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

		$('.lnk-menu').click(function(event) {
			event.preventDefault();
			app.scrolling($.attr(this, 'href'), 750);
			event.stopPropagation();
		});

		window.onresize = function() {
			console.log('resize');
			if ($(window).width()==app.myWidth) {
				return false;
			}
		}

		// this.playVideo();
		// this.sliders();
	},

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

	sliders: function(){
		console.log('sliders');
		
		$('#slider-homes').slick({
			dots: true,
			infinite: true,
			speed: 300,
			slidesToShow: 1
		});

        $("#slider-tv").slick({
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: false,
            variableWidth: false,
            autoplay: false
        });
	},

	changeItem: function(_params) {
		console.log(_params);
		$(_params.slider + ' .section-features .features').fadeOut(_params.speed);
		$(_params.slider + ' .section-features .features').eq(_params.index).fadeIn(_params.speed);
		$(_params.slider + ' .submenu li a').removeClass('active');
		$(_params.slider + ' .submenu li a').eq(_params.index).addClass('active');
		if (_params.slider=="#mochilas" || _params.slider=="#calzadoo") {
			$(_params.slider + ' .link-section .link').fadeOut();
			$(_params.slider + ' .link-section .link').eq(_params.index).fadeIn(0);
		}
	},

	playVideo: function() {
		console.log('PLAYING...!')
		var myplayer;
		myplayer = document.getElementById('myplayer');

		myplayer.addEventListener('playing', function(event){
			console.log('playing');
			if ($(event.target).attr('src').indexOf('sala')>0) {
				console.log('Estas en Sala')
			}
			if ($(event.target).attr('src').indexOf('comedor')>0) {
				console.log('Estas en comedor')
			}
			if ($(event.target).attr('src').indexOf('dormitorio')>0) {
				console.log('Estas en dormitorio')
			}
			//event.target.play();
		});
		myplayer.addEventListener('pause', function(event){
			console.log("pause");
			console.log(event);
		});
		myplayer.addEventListener('timeupdate', function(event){
			//console.log("time");
			_current = parseInt(event.target.currentTime);
			_duration = parseInt(event.target.duration) - 1;
			console.log(_current);
			console.log(_duration);
			//console.log($(event.target).attr('src'));
			if (_current == _duration) {
				//$('#player').fadeOut('fast');
				myplayer.pause();
				myplayer.currentTime = 1;
				myplayer.play();
				//$('#player').fadeIn('fast');
			}
			if ($(event.target).attr('src').indexOf('sala')>0) {

			}
			if ($(event.target).attr('src').indexOf('comedor')>0) {

			}
			if ($(event.target).attr('src').indexOf('dormitorio')>0) {

			}
		});
	}
}

window.onload = function() {
	$('#container').animate({opacity:1}, 500);
	$('.loader').remove();
}
