var app = app || {};

app.articleController = function () {
    var _this;

    function ArticleController(model) {
        this.model = model;
        _this = this;
    }


    ArticleController.prototype.getArticlePage = function (selector) {
        this.model.getArticles('articles')
            .then(function (articlesData) {
                app.homeView.load(selector, articlesData);
            })
    };

    ArticleController.prototype.getAdminPage = function (selector) {
        this.model.getArticles('articles')
            .then(function (articles) {
                app.adminView.load(selector, articles);
            })
    };

    ArticleController.prototype.getCreateArticlePage = function (selector) {
        //if (sessionStorage['id']) {
        //    this.model.userModel.isAdmin(sessionStorage['id'])
        //        .then(function (success) {
        //            console.log(success);
        app.createArticleView.load(selector);
        //}, function (error) {
        //    console.log('You do not have Administrator access!');
        //    window.location.replace('#/');
        //})
        //} else {
        //    console.log('Yoy must login first!');
        //    window.location.replace('#/');
        //}

    };

    Sammy(function () {
        var SammyObj;

        this.bind('add-article-event', function (e, data) {
            this.redirect('#/create-article');
        });

        this.bind('post-article-event', function (e, data) {
            SammyObj = this;
            if (data.title && data.content) {
                _this.model.addArticle('articles', data)
                    .then(function (success) {
                        SammyObj.redirect('#/');
                    }, function (error) {
                        console.error(error);
                    })
            } else {
                poppy.pop('warning', 'Invalid title or content', '')
            }
        });
    });

    function bindArticle(article) {
        article.contentSummery = article.content.length > 100 ? article.content.slice(0, 100) : article.content;
        article.tags = article.tags.split(/[\s+|,]+/);
        article.rating = 0;
    }

    return {
        load: function (model) {
            return new ArticleController(model);
        }
    }
}();