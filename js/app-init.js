/**
 * Created by garden on 17-4-13.
 */
//set loading page whilte loading the page
// setTimeout("$('#loading').attr('style','display:none');$('#mainView').attr('style','');",2000);

var app = angular.module("myApp",['ngRoute']);

    app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
        $locationProvider.hashPrefix('');
        $routeProvider
            .when('/',{templateUrl:'../html/overview.html'})
            .when('/DHT网络热点图', {templateUrl:'../html/map.html'})
            .when('/实时分析', {templateUrl:'../html/message.html'})
            .when('/报表导出', {templateUrl:'../html/log.html'})
            .when('/屏蔽历史', {templateUrl:'../html/blockhistory.html'})
            .when('/结点屏蔽', {templateUrl:'../html/nodeblock.html'})
            .when('/直播举报',{templateUrl:'../html/livereport.html'})
            .when('/系统统置',{templateUrl:'../html/interests.html'})
            .otherwise({redirectTo:'/'});
        // $httpProvider.defaults.headers.common['X-CSRFToken'] = '{{ csrf_token|escapejs }}';
    }]);
app.service('ramdonlabelclasspicker', function() {
    this.pick = function () {
        var classsets = ["label label-danger","label label-info","label label-warning","label label-success"];
        var index = Math.floor(Math.random()*(classsets.length));
        return classsets[index];
    }
});

 var resourcemarklist= [];
 var nodemarklist = [];
 var cancelResourceMarkList=[];
 var cancelNodeMarkList = [];
//Angular command
app.directive("marksource",function () {
    return{
        restrict:"A",
        link: function ($scope,elem,attrs) {
            var index;
            $(elem).click(function () {
                index = $.inArray(attrs.tag,resourcemarklist);
                //当前资源存在标记列表中
                if(index != -1){
                    $(this).parent().parent().parent().parent().removeClass("resourcemark");
                    resourcemarklist.splice(index,1);
                }else{
                    //当前资源不存在标记列表中
                    $(this).parent().parent().parent().parent().addClass("resourcemark");
                    resourcemarklist.push(attrs.tag);
                }
            })
        }
    }
});
app.directive("marknode",function () {
    return{
        restrict:"A",
        link:function ($scope,elem,attrs) {
            var index;
            $(elem).click(function () {
               index = $.inArray(attrs.tag,nodemarklist);
                //当前结点存在标记列表中
               if(index != -1){
                   $(this).parent().parent().parent().parent().removeClass("nodemark");
                   nodemarklist.splice(index,1);
               }else{
                   //当前结点不在标记列表中
                   $(this).parent().parent().parent().parent().addClass("nodemark");
                   nodemarklist.push(attrs.tag);
               }
            })
        }
    }
});
app.directive("cancelMarkReource",function () {
    return{
        restrict:"A",
        link: function ($scope,elem,attrs) {
            var index;
            $(elem).click(function () {
                index = $.inArray(attrs.tag,cancelResourceMarkList);
                //当前资源存在标记列表中
                if(index != -1){
                    $(this).parent().parent().parent().parent().removeClass("cancelresourcemark");
                    cancelResourceMarkList.splice(index,1);
                }else{
                    //当前资源不存在标记列表中
                    $(this).parent().parent().parent().parent().addClass("cancelresourcemark");
                    cancelResourceMarkList.push(attrs.tag);
                }
            })
        }
    }
});
app.directive("cancelMarkNode",function () {
    return{
        restrict:"A",
        link:function ($scope,elem,attrs) {
            var index;
            $(elem).click(function () {
                index = $.inArray(attrs.tag,cancelNodeMarkList);
                //当前结点存在标记列表中
                if(index != -1){
                    $(this).parent().parent().parent().parent().removeClass("cancelnodemark");
                    cancelNodeMarkList.splice(index,1);
                }else{
                    //当前结点不在标记列表中
                    $(this).parent().parent().parent().parent().addClass("cancelnodemark");
                    cancelNodeMarkList.push(attrs.tag);
                }
            })
        }
    }
});

// Global array list
