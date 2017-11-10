function Review(id, root) {
    this.id = id;
    this.root = root;   // id родительского элемента
    this.comments = []; // отзывы
    this.getReviews();  // получение отзывов с сервера
}


//--- Получение отзывов -----------------------------------------------------------------
Review.prototype.getReviews = function () {

    $.get({
        url: './reviews.json',
        dataType: 'json',
        context: this,
        success: function (data) {
            this.comments = data.comments;
            this.render(true);
        },
        error: function (error) {
            console.log('Ошибка получения отзывов', error.status, error.statusText)
        }
    });
};

//--- Создание и отрисовка блока отзывов ------------------------------------------------
Review.prototype.render = function (all) { //all = true (весь список), false (посл.элемент)

    var self = this;                // сохраняем контекст
    var parentDiv = $(this.root);   // div для списка

    var i;                          // стартовый индекс для массива комментариев
    (all) ? i = 0                           // рендерим весь список
          : i = this.comments.length - 1;   // только последний комментарий

    for (i; i < this.comments.length; i++) {
        var commentDiv = this.makeComment(this.comments[i]); //создание отзыва

        commentDiv.appendTo(parentDiv);    //добавляем отзыв в список
        $(commentDiv).slideDown();         //добавляем эффект

        //--- обработка нажатий ссылок ---
        $(".submit" ,commentDiv).on("click", function () { // Одобрить
            self.submit(this);
        });

        $(".delete" ,commentDiv).on("click", function () { // Удлить
            self.delete(this);
        });
    }
};
//--- Добавление отзыва -----------------------------------------------------------------
Review.prototype.addComment = function () {
    var newItem = {};

    newItem["id_comment"] = Date.now();
    newItem["id_user"] = $("#name").val();
    newItem["text"] = $("#comment").val();

    this.comments.push(newItem);
    this.render(false);
};
//--- Одобрить комментарий --------------------------------------------------------------
Review.prototype.submit = function (link) {
    $(link).parent().parent().toggleClass("submitted"); // меняем класс выбранного div
};

//--- Удалить комментарий --------------------------------------------------------------
Review.prototype.delete = function (link) {
    var targetDiv = $(link).parent().parent();  //находим родительский div
    var targetId = parseInt(targetDiv[0].id);   //сохраняем его id

    for(var i = 0; i<this.comments.length; i++) {   //находим в массиве элемент с targetID
        if (this.comments[i]["id_comment"] === targetId) {
            this.comments.splice(i,1);                          // вырезаем его
            break;
        }
    }

    targetDiv.slideUp(300, function () {        // прячем div и удаляем его из DOM
        this.remove();
    });
};

//--- Создание одного отзыва ------------------------------------------------------------
Review.prototype.makeComment = function (item) {

    var idComm = item["id_comment"];
    var idUser = item["id_user"];
    var text = item["text"];

    var itemDiv = $('<div />', { //div для комментария
        id: idComm,
        class: "comment ui-widget-content ui-corner-all",
        style: "display: none;"
    });

    $('<div />', {          //блок с именем пользователя
        class: "user",
        text: idUser
    }).appendTo(itemDiv);

    $('<div />', {          //блок с сообщением
        class: "mess",
        text: text
    }).appendTo(itemDiv);

    var messCtrl = $('<div />', { //блок с кнопками одобрить и удалить
        class: "control"
    });

    $('<span />', {         //ссылка одобрить
        class: "submit",
        text: "Одобрить"
    }).appendTo(messCtrl);

    $('<br />').appendTo(messCtrl);

    $('<span />', {         //ссылка удалить
        class: "delete",
        text: "Удалить"
    }).appendTo(messCtrl);

    messCtrl.appendTo(itemDiv);
    return itemDiv;
};
//---------------------------------------------------------------------------------------
