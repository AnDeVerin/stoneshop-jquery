$(function () {

    var goodsData = [
        {
            name: 'Sapphire',
            imgSrc: 'small/img1.jpg',
            description: 'Etiam libero neque, luctus a, eleifend nec, semper at, lorem. Sed pede. Nulla lorem metus, adipiscing ut, luctus sed, hendrerit vitae, mi.',
        },
        {
            name: 'Bismuth',
            imgSrc: 'small/img2.jpg',
            description: 'Accusamus ducimus expedita id impedit in praesentium quis tenetur! Accusamus aliquid asperiores aspernatur culpa debitis, facilis, laudantium natus porro quisquam quos soluta!',
        },
        {
            name: 'Tanzanite',
            imgSrc: 'small/img3.jpg',
            description: 'Architecto earum harum in ratione reiciendis reprehenderit sunt. Esse ipsa natus quam suscipit. Ab accusantiumtiis corporis ducimus, earum enim.',
        },
        {
            name: 'Emerald',
            imgSrc: 'small/img4.jpg',
            description: 'Beatae blanditiis consequatur consequuntur cum cupiditate dolore doloribus eaque eligendi expedita facere fuga harum illo illum maxime molestiae voluptates.',
        },
        {
            name: 'Fluorite',
            imgSrc: 'small/img5.jpg',
            description: 'Consectetur error est eveniet impedit nesciunt qui! Assumenda beatae blanditiis, eius et eum fugiat ipsa libero non  numquam odit optio perferendis quaerat quia ratione sequi, sit sunt suscipit vel vero.',
        }
    ];
    var slides = makeSlides(goodsData);
    var activeSlide = 0;
    var itemsInCart = 0;

    slides.forEach(function (good) {                // вывод товаров
        var tempGood = good.clone();
        tempGood.css('position', 'static')          // сброс свойства position
                .addClass('drag');                  // возможность таскать
        $('#goods').append(tempGood);
    });

    $('#slider').append(slides[activeSlide]);       // добавляем первый слайд в карусель

                                                    //--- включаем карусель -----------------
    var timer = setInterval(function () {

        slides[activeSlide].css('z-index', '1');    // текущий слайд выводим на передний план
        var movingSlide = slides[activeSlide];      // сохраняем его для сдвига

        activeSlide++;                              // перемещаемся на след слайд в массиве
        if (activeSlide === slides.length ) activeSlide = 0;

        $('#slider').append(slides[activeSlide]);   // добавляем его под текущий

        movingSlide.hide('slide', 700, function () { // сдвигаем верхний слайд
            movingSlide.remove()                     // удалаем его из DOM
                       .css({                        // подправляем свойства CSS
                           'display': 'block',
                           'z-index': '0'});
        });

    }, 5000);

    $('.drag').draggable({ opacity: 0.7, helper: "clone" });  // можно перетаскивать товары
    $('.header').droppable({
        drop: function( event, ui ) {
            itemsInCart++;
            $('#num').text(itemsInCart);
            $('.cart').effect( "bounce" );
            console.log(this);
        }
    });
    //--- создаём div для слайдера -------------------------------------------------
    function makeSlides(goods) {
                                    // создаём массив div'ов для вывода в карусель
        return goods.map(function (item) {

            var div = $('<div/>').addClass('slider-content ui-widget-content ui-corner-all')
                                 .css('position', 'absolute');
            var img = $('<img/>', {
                        src: item.imgSrc,
                        alt: item.name,
                        'class': 'ui-corner-all slider-image'
                        });
            var divName = $('<div/>').addClass('slider-name').text(item.name);
            var divText = $('<span/>').text(item.description);

            return div.append(img)
                      .append(divName)
                      .append(divText);
        });
    }
});