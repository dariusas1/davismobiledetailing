$('.owl-carousel').owlCarousel({
    loop: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: false
        },
        650: {
            items: 2,
            nav: true
        },
        1000: {
            items: 3,
            nav: true,
            loop: false
        }
    }
})