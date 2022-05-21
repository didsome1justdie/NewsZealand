angular.module('NewsWebsiteApp', [])
    // Controller
    .controller('WebsiteController', [
        'HttpHandlerService',
        '$q',
        function(
                HttpHandlerService,
                $q) {
        var articles = this;
        articles.articleIdList = [];
        articles.currentIndex = 1;

        articles.getPageArticles = function() {
                articles.currentPageArticles = [];
                let array = angular.copy(articles.articleIdList);
                let currentPageIds = array.splice((articles.currentIndex - 1), 9);
                // console.log('getPageArticles - currentPageIds: ', currentPageIds);
                var promises = [];
                for (let i = 0; i < currentPageIds.length; i++) {
                       promises.push(HttpHandlerService.getArticleById(currentPageIds[i]));
                }
                $q.all(promises)
                    .then(function(response) {
                        // console.log('getPageArticles - response: ', response);
                        articles.currentPageArticles = response;
                    })
                    .catch(function(err) {
                        console.error('getPageArticles - error: ', err);
                    });
        };
        articles.getAllArticleIds = function() {
                return HttpHandlerService.getAllArticleIds().then(function(response) {
                        console.log('articlesResponse: ', response?.data);
                        articles.articleIdList = response?.data;
                });
        };
        articles.getAllArticleIds().then(function() {
                articles.getPageArticles();
        });
        articles.getPreviousArticles = function() {
                articles.currentIndex -= 9;
                articles.getPageArticles();
        };
        articles.getNextArticles = function() {
                articles.currentIndex += 9;
                articles.getPageArticles();
        };
        articles.buildDate = function(epochDate) {
                var d = new Date(0);
                d.setUTCSeconds(epochDate);
                return d.toDateString();
        };
    }])
    // Services
    .service('HttpHandlerService', function($http) {
            this.getArticleById = function(id) {
                    return $http.get('https://hacker-news.firebaseio.com/v0/item/' + id + '.json').then(function(response) {
                            // console.log('getArticleById - articleData(' + id + '): ', response?.data);
                            return response?.data;
                    }).catch(function(err) {
                            console.error('getArticleById - error(' + id + '): ', err);
                    });
            };

            this.getAllArticleIds = function() {
                    return $http.get('https://hacker-news.firebaseio.com/v0/topstories.json').then(function(response) {
                            // console.log('getAllArticleIds - response: ', response);
                            return response;
                    }).catch(function(err) {
                            console.error('getAllArticleIds - error: ', err);
                    });
            };
    });
