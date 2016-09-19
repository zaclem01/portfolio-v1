const $ = require('jquery');
const slick = require('./slick.js');
const d3 = require('d3');

const $siteNav = $('.siteNav');
let lastScroll = 0;
let timedNavHide;

// Hiding functionality for Nav
// Only hide on non-mobile screens
$(window).on('scroll', function() {
    if ($(this).width() > 640) {
        let thisScroll = $(this).scrollTop();
        // Always show Nav when at the top of the page
        if (thisScroll < 100) {
            clearTimeout(timedNavHide);
            $siteNav.show();
        // Hide Nav on scroll down
        } else if (thisScroll > lastScroll) {
            $siteNav.slideUp('fast');
        // Show Nav on scroll up, but hide again after 2 seconds
        } else {
            $siteNav.slideDown('fast');
            clearTimeout(timedNavHide);
            timedNavHide = setTimeout(hideNav, 2000);
        }
        lastScroll = thisScroll;
    // Hide menu if open on mobile scroll
    } else {
        if ($siteNav.hasClass('js-responsive')) {
            $siteNav.removeClass('js-responsive');
        }
    }
});

// Don't hide the Nav while hovering over
$siteNav.on('mouseenter', function() {
    clearTimeout(timedNavHide);
});

// If not at top, hide the Nav again on mouse out
$siteNav.on('mouseleave', function() {
    let thisScroll = $(this).scrollTop();
    if (thisScroll > 100) {
        timedNavHide = setTimeout(hideNav, 2000);
    }
});

const hideNav = () => $siteNav.slideUp('fast');

$('.siteNav_menuBtn').on('click', function() {
    $siteNav.toggleClass('js-responsive');
});

// Highlight active section and scroll animation
var $navItem = $('.siteNav_nav_item > a');

$navItem.click(function(event) {
	// Stop the default link navigation
	event.preventDefault();

	$('html, body').animate({
		scrollTop: $('#' + $(this).text().toLowerCase() + 'Section').offset().top // Adjust for Top Bar
	}, 500);
});

$('.work_content').slick({
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    adaptiveHeight: true,
    responsive: [
        {
            breakpoint: 420,
            settings: {
                slidesToShow: 1
            }
        }
    ]
});