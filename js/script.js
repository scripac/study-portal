
// Preloader
$(window).on('load', function () {
    setTimeout(function () {
        $('.mesh-loader').fadeOut(400);
        $('body').css('overflow', 'visible');
        new WOW().init();
    }, 1500)
});

// hero Slider
(function() {
    let $$ = function(selector, context) {
        var context = context || document;
        let elements = context.querySelectorAll(selector);
        return [].slice.call(elements);
    };

    function _fncSliderInit($slider, options) {
        let prefix = '.fnc-';

        var $slider = $slider;
        let $slidesCont = $slider.querySelector(prefix + 'slider__slides');
        let $slides = $$(prefix + 'slide', $slider);
        let $controls = $$(prefix + 'nav__control', $slider);
        let $controlsBgs = $$(prefix + 'nav__bg', $slider);
        let $progressAS = $$(prefix + 'nav__control-progress', $slider);

        let numOfSlides = $slides.length;
        let curSlide = 1;
        let sliding = false;
        let slidingAT = +parseFloat(getComputedStyle($slidesCont)['transition-duration']) * 1000;
        let slidingDelay = +parseFloat(getComputedStyle($slidesCont)['transition-delay']) * 1000;

        let autoSlidingActive = false;
        let autoSlidingTO;
        let autoSlidingDelay = 5000; // default autosliding delay value
        let autoSlidingBlocked = false;

        let $activeSlide;
        let $activeControlsBg;
        let $prevControl;

        function setIDs() {
            $slides.forEach(function($slide, index) {
                $slide.classList.add('fnc-slide-' + (index + 1));
            });

            $controls.forEach(function($control, index) {
                $control.setAttribute('data-slide', index + 1);
                $control.classList.add('fnc-nav__control-' + (index + 1));
            });

            $controlsBgs.forEach(function($bg, index) {
                $bg.classList.add('fnc-nav__bg-' + (index + 1));
            });
        }

        setIDs();

        function afterSlidingHandler() {
            $slider.querySelector('.m--previous-slide').classList.remove('m--active-slide', 'm--previous-slide');
            $slider.querySelector('.m--previous-nav-bg').classList.remove('m--active-nav-bg', 'm--previous-nav-bg');

            $activeSlide.classList.remove('m--before-sliding');
            $activeControlsBg.classList.remove('m--nav-bg-before');
            $prevControl.classList.remove('m--prev-control');
            $prevControl.classList.add('m--reset-progress');
            let triggerLayout = $prevControl.offsetTop;
            $prevControl.classList.remove('m--reset-progress');

            sliding = false;
            let layoutTrigger = $slider.offsetTop;

            if (autoSlidingActive && !autoSlidingBlocked) {
                setAutoslidingTO();
            }
        }

        function performSliding(slideID) {
            if (sliding) return;
            sliding = true;
            window.clearTimeout(autoSlidingTO);
            curSlide = slideID;

            $prevControl = $slider.querySelector('.m--active-control');
            $prevControl.classList.remove('m--active-control');
            $prevControl.classList.add('m--prev-control');
            $slider.querySelector(prefix + "nav__control-" + slideID).classList.add('m--active-control');

            $activeSlide = $slider.querySelector(prefix + 'slide-' + slideID);
            $activeControlsBg = $slider.querySelector(prefix + 'nav__bg-' + slideID);

            $slider.querySelector('.m--active-slide').classList.add('m--previous-slide');
            $slider.querySelector('.m--active-nav-bg').classList.add('m--previous-nav-bg');

            $activeSlide.classList.add('m--before-sliding');
            $activeControlsBg.classList.add('m--nav-bg-before');

            let layoutTrigger = $activeSlide.offsetTop;

            $activeSlide.classList.add('m--active-slide');
            $activeControlsBg.classList.add('m--active-nav-bg');

            setTimeout(afterSlidingHandler, slidingAT + slidingDelay);
        }

        function controlClickHandler() {
            if (sliding) return;
            if (this.classList.contains("m--active-control")) return;
            if (options.blockASafterClick) {
                autoSlidingBlocked = true;
                $slider.classList.add('m--autosliding-blocked');
            }

            let slideID = +this.getAttribute('data-slide');

            performSliding(slideID);
        }

        $controls.forEach(function($control) {
            $control.addEventListener('click', controlClickHandler);
        });

        function setAutoslidingTO() {
            window.clearTimeout(autoSlidingTO);
            let delay = +options.autoSlidingDelay || autoSlidingDelay;
            curSlide++;
            if (curSlide > numOfSlides) curSlide = 1;

            autoSlidingTO = setTimeout(function() {
                performSliding(curSlide);
            }, delay);
        }

        if (options.autoSliding || +options.autoSlidingDelay > 0) {
            if (options.autoSliding === false) return;

            autoSlidingActive = true;
            setAutoslidingTO();

            $slider.classList.add('m--with-autosliding');
            let triggerLayout = $slider.offsetTop;

            let delay = +options.autoSlidingDelay || autoSlidingDelay;
            delay += slidingDelay + slidingAT;

            $progressAS.forEach(function($progress) {
                $progress.style.transition = 'transform ' + (delay / 1000) + 's';
            });
        }

        $slider.querySelector('.fnc-nav__control:first-child').classList.add('m--active-control');

    }

    let fncSlider = function(sliderSelector, options) {
        let $sliders = $$(sliderSelector);

        $sliders.forEach(function($slider) {
            _fncSliderInit($slider, options);
        });
    };

    window.fncSlider = fncSlider;
}());
fncSlider('.fnc-slider', {autoSlidingDelay: 4000});

$(document).ready(function () {

    // Change device orientation
    window.addEventListener('orientationchange', function () {
        location.reload();
    }, false);

    // Hamburger
    function hamburgerClose() {
        $('.header__hamburger').removeClass('js-open');
        $('html, body').removeClass('js-overflow');
        $('.burger-menu').removeClass('open');
        $('.overlay').removeClass('active');
    }

    $('.header__hamburger').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('js-open');
        $('html, body').toggleClass('js-overflow');
        $('.burger-menu').toggleClass('open');
        $('.overlay').toggleClass('active');

        $('.overlay').click(function (e) {
            e.preventDefault();
            hamburgerClose();
        });

        if ($(this).hasClass('js-open')) {
            document.onkeydown = function (e) {
                if (e.keyCode === 27) {
                    hamburgerClose();
                    return false;
                }
            };
        } else {
            hamburgerClose();
        }
    });

    // Header
    window.addEventListener('scroll', () => {
        if ($(window).scrollTop() > 50) {
            $('.header').addClass('js-header-fixed');
        } else {
            $('.header').removeClass('js-header-fixed');
        }
    });

    // Header Navbar Settings
    function headerNavbarSettings() {
        $('.navbar .nav-item').find('.drop-list').siblings('.nav-link').addClass('isDropList');
        $('.navbar .nav-link.isDropList').removeClass('hover-line');
    }
    headerNavbarSettings();

    // Collapse toggler custom
    $('a[data-toggle="collapse"]').on('click', function (e) {
        e.preventDefault();

        $(this).toggleClass('open');
        $(this).siblings('.collapse').slideToggle(300);
    });

    // form Search
    function searchClose() {
        $('.search-link').removeClass('active');
        $('.search-field-block').removeClass('active');
        $('html, body').removeClass('js-overflow');
        $('.overlay').removeClass('active');
    }

    $('.search-link').on('click', function (e) {
        e.preventDefault();

        $(this).addClass('active');
        $('html, body').addClass('js-overflow');
        $('.overlay').addClass('active');
        $('.search-field-block').addClass('active').css('top', $('.header').height() + 20);
        if ($(window).width() <= 991) {
            $('.search-field-block').css('top', $('.header').height() + 2);
        }
        $('.search-field-block input').focus();

        $('.close-btn, .overlay').click(function (event) {
            event.preventDefault();

            searchClose();
        });

        if ($(this).hasClass('active')) {
            document.onkeydown = function (e) {
                if (e.keyCode === 27) {
                    searchClose();

                    return false;
                }
            };

        } else {
            searchClose();
        }
    });

    // Statistics Numbers
    $('.counter').each(function () {
        let $this = $(this),
            countTo = $this.attr('data-count');
        $({countNum: $this.text()}).animate({
                countNum: countTo
            },
            {
                duration: 750,
                easing: 'linear',
                step: function () {
                    $this.text(Math.floor(this.countNum))
                },
                complete: function () {
                    $this.text(this.countNum)
                }
            })
    });

    // LightGallery
    $('.lightgallery-awards').lightGallery();

    // b24 widget
    function b24WidgetClose() {
        $('.b24-widget .b24-widget__button').removeClass('active')
        $('.b24-widget').removeClass('open');
        $('.overlay').removeClass('active');
        $('html, body').removeClass('js-overflow');
    }

    $('.b24-widget .b24-widget__button').on('click', function (e) {
        e.preventDefault();

        $(this).toggleClass('active');
        $('.b24-widget').toggleClass('open');
        $('.overlay').toggleClass('active');
        $('html, body').toggleClass('js-overflow');

        $('.overlay').click(function (event) {
            event.preventDefault();
            b24WidgetClose();
        })
        if ($(this).hasClass('active')) {
            document.onkeydown = function (e) {
                if (e.keyCode === 27) {
                    b24WidgetClose();
                    return false;
                }
            };
        } else {
            b24WidgetClose();
        }
    });

    // Swipers
    new Swiper('.feedback-swiper', {
        autoplay: {
            delay: 2000
        },
        breakpoints: {
            0: {
                slidesPerView: 1.1,
                spaceBetween: 8
            },
            576: {
                slidesPerView: 1.2,
            },
            767: {
                slidesPerView: 1.5,
            },
            992: {
                slidesPerView: 2.5,
                spaceBetween: 0
            }
        }
    });
    if (window.innerWidth <= 991) {
        new Swiper('.ambassador-swiper', {
            spaceBetween: 30,
            pagination: {
                el: '.ambassador-swiper .swiper-pagination',
            },
            breakpoints: {
                0: {
                    slidesPerView: 1
                },
                576: {
                    slidesPerView: 2
                }
            }
        });
    }
    new Swiper('.awards-swiper', {
        autoplay: {
            delay: 1500
        },
        pagination: {
            el: '.awards-swiper .swiper-pagination',
            dynamicBullets: true
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2
            },
            992: {
                slidesPerView: 4,
                spaceBetween: 50
            }
        }
    });
    if (window.innerWidth <= 991) {
        new Swiper('.partners-swiper', {
            spaceBetween: 20,
            autoplay: {
                delay: 1500
            },
            pagination: {
                el: '.partners-swiper .swiper-pagination',
                dynamicBullets: true
            },
            breakpoints: {
                0: {
                    slidesPerView: 1
                },
                415: {
                    slidesPerView: 2
                },
                576: {
                    slidesPerView: 3
                }
            }
        })
    }
    new Swiper('.steps-swiper', {
        autoplay: {
            delay: 1500
        },
        pagination: {
            el: '.steps-swiper .swiper-pagination',
            dynamicBullets: true
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 30
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 40
            }
        }
    });

    new Swiper('.video-swiper', {
        simulateTouch: false,
        allowTouchMove: false,
    });
    new Swiper('.video-swiper-thumbs', {
        breakpoints: {
            0: {
                slidesPerView: 2.2,
                spaceBetween: 10
            },
            576: {
                slidesPerView: 2.5,
                spaceBetween: 15
            },
            992: {
                slidesPerView: 3.5,
                spaceBetween: 20
            }
        }
    });

    $('.video-swiper-thumbs__item').on('click', function () {
        let currentAttr = $(this).attr('data-url')
        $('.video-swiper .video-swiper__item iframe').attr('src', currentAttr)
    });

});