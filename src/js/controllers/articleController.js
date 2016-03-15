var app = app || {};

app.articleController = function () {
    var _this;

    function ArticleController(model) {
        this.model = model;
        _this = this;
    }


    ArticleController.prototype.getAllArticlesPage = function (selector) {
        this.model.getArticles('articles')
            .then(function (data) {
                var articlesData = {
                    articles: data
                };
                app.homeView.load(selector, articlesData);
            })
    };

    ArticleController.prototype.getArticleByIdPage = function (id, selector, isAdmin) {
        this.model.getArticles('articles/' + id)
            .then(function (data) {
                var dataO = [];
                data.tags.forEach(function (tag) {
                    dataO.push({tag: tag});
                });
                data.tags = dataO;
                var articlesData = {
                    articles: data,
                    isAdmin: isAdmin
                };
                //if (isAdmin) {
                app.articleView.load(selector, articlesData);
                //} else {
                //    app.articleView.load(selector, articlesData);
                //}
            }, function (error) {
                console.log(error);
            })
    };

    ArticleController.prototype.getAdminPage = function (selector) {
        this.model.getArticles('articles')
            .then(function (articles) {
                app.adminView.load(selector, articles);
            })
    };

    ArticleController.prototype.deleteArticleById = function (id) {
        return this.model.deleteArticleById(id);
    };

    ArticleController.prototype.editArticleById = function (id, article) {
        return this.model.editArticle(id, article);
    };

    ArticleController.prototype.getCreateArticlePage = function (selector) {
        app.createArticleView.load(selector, {});
    };

    ArticleController.prototype.getEditArticlePage = function (selector, articleId) {
        this.model.getArticles('articles/' + articleId)
            .then(function (success) {
                app.createArticleView.load(selector, success);
            })
    };

    Sammy(function () {
        var SammyObj;

        this.bind('add-article-event', function (e, data) {
            this.redirect('#/create-article');
        });

        this.bind('delete-article-event', function (e, data) {
            SammyObj = this;
            _this.deleteArticleById(data.id)
                .then(function (success) {
                    SammyObj.redirect('#/');
                })
        });

        this.bind('save-article-event', function (e, data) {
            SammyObj = this;
            _this.editArticleById(data.id, data.article)
                .then(function (success) {
                    SammyObj.redirect('#/');
                }).done();
        });

        this.bind('edit-article-event', function (e, data) {
            _this.getEditArticlePage('#articles', data.id);
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
                poppy.pop('info', 'Invalid title or content', '')
            }
        });
    });

    return {
        load: function (model) {
            return new ArticleController(model);
        }
    }
}();