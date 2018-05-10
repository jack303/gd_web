/**
 * Created by garden on 17-4-11.
 */
app.controller("navController", function ($scope, $interval, $http, ramdonlabelclasspicker) {
    // added in 7.28
    $scope.order_param = 'time';

    //logresponse default value is false
    $scope.logresponse = true;
    $scope.sidebarflag = true;

    $scope.configureType = 'userinfo';
    $scope.btnflag = -1;
    //filter info initialize
    $scope.toggleshow = function () {
        $scope.isover = true;

    };
    $scope.togglehide = function () {
        $scope.isover = false;
    };
    $scope.dopulse = function () {
        $scope.pulseflag = true;
    };
    $scope.notpulse = function () {
        $scope.pulseflag = false;
    };

    $scope.nUsername = "zdhzzz";
    $scope.nPassword = "";
    $scope.login = function () {
        // main.fun.loadstart();
        $http({
            // method: 'POST',
            method: 'POST',
            url: main.data.url + 'user_login/',
            // url: main.data.url + 'user_login/',
            data: {
                'username': $scope.nUsername,
                'password': $scope.nPassword
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $('#loginmsg').popover({
                title: $scope.loginResponseTitle,
                content: $scope.loginResponseContent,
                placement: "bottom"
            });
            if ($scope.nUsername == 'admin') {
                main.auth.admin();
            }
            $("#nUsername").html($scope.nUsername);
            $("#loginForm").hide();
            $("#logininfo").show();
            main.fun.loadend();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $('#loginmsg').popover({
                title: response.data['detail'],
                content: $scope.data['detail'],
                placement: "bottom"
            });
        });
        $scope.loginResponseTitle = "错误";
        $scope.loginResponseContent = "你的密码不正确，请核对你的账号和密码是否匹配。如果疑问请联系系统管理员";
    };
    $scope.logout = function () {
        $scope.logresponse = false;
    };
    $scope.dashboard = function () {
        if ($scope.sidebarflag == true) {
            $scope.sidebarflag = false;
        } else {
            $scope.sidebarflag = true;
        }
    };
    $scope.btnshow = function (index) {
        $scope.btnflag = index;
    };
    $scope.hideresourceitem = function (index) {
        $scope.realtimeNonLiveRecord.splice(index, 1);
    };
    $scope.hidenodeitem = function (index) {
        $scope.noderecord.splice(index, 1);
    };
    $scope.btnhide = function () {
        $scope.btnflag = -1; //Not matching any media,so hide that button blcok
    };

    //overview pageF
    $scope.overviewSwitch = function (flag) {
        $scope.overviewTypeFlag = flag;
        switch (flag) {
            case 'live':
                $scope.showLiveShowRank();
                break;
            default:

        }
    };

    //realTime Page
    $scope.realtimeSwitch = function (flag) {
        $scope.realtimeTypeFlag = flag;
    };


    $scope.getHistoryTracks = function (extData) {
        $http({
            method: 'GET',
            url: main.data.url + "historyTracks",
            params: {
                'id': extData.name
            }
        }).then(function successCallback(response) {
            $scope.historyTracks = response.data["tracks"];
            showHistoryTrack($scope.historyTracks, true);
        }, function errorCallback(response) {

        });
    };

    $scope.getInterest = function (id) {
        $http({
            method: 'GET',
            url: main.data.url + "interests",
            params: {
                'id': id
            }
        }).then(function successCallback(response) {
            // http request
            $scope.interestList = response.data;
        }, function errorCallback(response) {
            alert("get failed");
        });
    };

    $scope.deleteInterest = function (id) {
        // http delete
        $http({
            method: 'DELETE',
            url: main.data.url + "interests",
            params: {
                'id': id
            }
        }).then(function successCallback(response) {
            $scope.getInterest($scope.nUsername);
        }, function errorCallback(response) {
            alert("delete failed");
        });

    };

    $scope.getFence = function (id) {
        $http({
            method: 'GET',
            url: main.data.url + 'getFence',
            params: {
                'id': id
            }
        }).then(function successCallback(response) {
            $scope.fenceList = response.data["markers"];
            i = $scope.fenceList.length;
            // 初始化
            fenceMarkers = initialize($scope.fenceList, "r");
        }, function errorCallback(response) {

        });
    };

    $scope.updateFence = function (id, list) {
        $http({
            method: 'POST',
            url: main.data.url + 'updateFence/',
            dataType: "json",
            contentType: "application/json",
            // POST data
            data: {
                'id': id,
                'markers': list,
            }
        }).then(function successCallback(response) {
            // alert("上传成功");
        }, function errorCallback(response) {

        });
    };

    $scope.getLastPage = function () {

        if (main.data.messagePage >= 2) {
            main.data.messagePage -= 1;
            $scope.getMessage($scope.nUsername, main.data.messagePage);
        }

    };

    $scope.getNextPage = function () {
        main.data.messagePage += 1;
        $scope.getMessage($scope.nUsername, main.data.messagePage);
    };
    $scope.getMessage = function (id, page) {
        // alert("id:"+id+" page:"+page);
        $http({
            method: 'GET',
            url: main.data.url + 'getMessage',
            params: {
                'id': id,
                'page': page,
            }
        }).then(function successCallback(response) {
            $scope.messageList = response.data["messageList"];
        }, function errorCallback(response) {

        });
    };
    // 屏蔽历史 节点记录
    // TODO
    $scope.refreshHistoryNodeRecord = function () {
        // main.fun.loadstart();
        $http({
            method: 'GET',
            url: main.data.url + 'historyNodeRecord/',
            // params: {
            //   'showPornInfo': $scope.pornInfoFilter,
            //   'showAntiInfo': $scope.antiInfoFilter,
            //   'showViolenceInfo': $scope.violenceFilter,
            //   'showText': $scope.textFilter,
            //   'showImage': $scope.imgaeFilter,
            //   'showVideo': $scope.videoFilter,
            //   'area': $scope.pZone,
            //   'page': $scope.pageFilter,
            //   'time': $scope.timeFilter
            // }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.historyNodeRecord = response.data;
            main.fun.loadend();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    }

    // 资源屏蔽控制台 最新资源请求
    $scope.refreshResourceRecordByTime = function () {
        $scope.order_param = 'time';
        $http({
            method: 'GET',
            url: main.data.url + 'pollAndRoll/',
            params: {
                'showPornInfo': $scope.pornInfoFilter,
                'showAntiInfo': $scope.antiInfoFilter,
                'showViolenceInfo': $scope.violenceFilter,
                'showText': $scope.textFilter,
                'showImage': $scope.imgaeFilter,
                'showVideo': $scope.videoFilter,
                'area': main.fun.country($(".nice-select").find("input").val()),
                'page': $scope.pageFilter,
                'time': $scope.timeFilter,
                'order_param': $scope.order_param
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.realtimeNonLiveRecord = response.data.concat($scope.realtimeNonLiveRecord);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    };

    // 资源屏蔽控制台 下载量最多的资源管理
    $scope.refreshResourceRecordByCount = function () {
        $scope.order_param = 'count'
        // main.fun.loadstart();
        $http({
            method: 'GET',
            url: main.data.url + 'resource_record/',
            params: {
                'showPornInfo': $scope.pornInfoFilter,
                'showAntiInfo': $scope.antiInfoFilter,
                'showViolenceInfo': $scope.violenceFilter,
                'showText': $scope.textFilter,
                'showImage': $scope.imgaeFilter,
                'showVideo': $scope.videoFilter,
                'area': main.fun.country($(".nice-select").find("input").val()),
                'page': $scope.pageFilter,
                'time': $scope.timeFilter,
                'order_param': $scope.order_param
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.resourcerecord = response.data;
            main.fun.loadend();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    };

    // DHT网络热点图 获取中国地区资源信息

    // 节点屏蔽控制台 刷新资源请求
    $scope.refreshNodeRecord = function () {
        main.fun.loadstart();
        $http({
            method: 'GET',
            url: main.data.url + 'nodeRecord/',
            params: {
                'showPornInfo': $scope.pornInfoFilter,
                'showAntiInfo': $scope.antiInfoFilter,
                'showViolenceInfo': $scope.violenceFilter,
                'area': main.fun.country($(".nice-select").find("input").val()),
                'page': $scope.pageFilter,
                'time': $scope.timeFilter
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.noderecord = response.data;
            main.fun.loadend();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    };
    // 直播举报排行
    $scope.refreshLiveRecord = function () {
        main.fun.loadstart();
        $http({
            method: 'GET',
            url: main.data.url + 'liveShowRank/?page=1'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.liveRecord = response.data;
            main.fun.loadend();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    };

    // 直播举报排行
    $scope.liveAnimate = function () {
        $http({
            method: 'GET',
            url: main.data.url + 'live_animate/'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            main.data.img = response.data;
            $scope.realtimeLiveRecord = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    };

    //configure type
    $scope.configureSwitch = function (type) {
        $scope.configureType = type;
    }

    // dash board 资源热度排行榜
    $scope.showResourceRank = function () {
        // alert("hello");
        // main.fun.loadstart();

        /*
        $http({
            method: 'GET',
            url: main.data.url + 'resourceRank/?page=1',
            params: {}
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.overviewNonLiveRecords = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });*/

    };

    // dash board 直播热度排行榜
    $scope.showLiveShowRank = function () {
        $http({
            method: 'GET',
            url: main.data.url + 'liveShowRank/?page=1',
            params: {}
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.overviewLiveRecords = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    };
    //rolling module
    var stop = undefined;
    $scope.startRolling = function () {
        $scope.stratRollingFlag = true;
        //Prevent starting a new roll
        if (angular.isDefined(stop))
            return;
        stop = $interval(function () {
            if ($scope.realtimeTypeFlag == 'nonlive') {
                var noneliveItem;
                $http({
                    method: 'GET',
                    url: 'http://222.210.113.66:8000/dht/user_login/',
                    params: {
                        'showPornInfo': $scope.pornInfoFilter,
                        'showAntiInfo': $scope.antiInfoFilter,
                        'showViolenceInfo': $scope.violenceFilter,
                        'showText': $scope.textFilter,
                        'showImage': $scope.imgaeFilter,
                        'showVideo': $scope.videoFilter,
                        'area': $scope.pZone,
                        'page': $scope.pageFilter,
                        'time': $scope.timeFilter
                    }
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    noneliveItem = response.data;
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.

                });
                //Insert an record into the first place of the array
                $scope.realtimeNonLiveRecord.splice(0, 0, noneliveItem);
            } else {
                var liveItem;
                $http({
                    method: 'GET',
                    url: 'http://222.210.113.66:8000/dht/user_login/'
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    // liveItem = response.data;
                    $scope.realtimeLiveRecord = response.data;
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.

                });
                //Insert an record into the first place of the array
                // $scope.realtimeLiveRecord.splice(0, 0, liveItem);
            }
        }, 5000);
    };
    // $interval(function() {
    //   $scope.badResourceNum += 1;
    //   $scope.badNodeNum += 1;
    //   $scope.badLiveNum += 1;
    // }, 1000);
    $scope.stopRolling = function () {
        $scope.stratRollingFlag = false;
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };

    $scope.labels = [
        {
            "class": "label label-default animated fadeIn",
            "content": "label1"
        }, {
            "class": "label label-danger animated fadeIn",
            "content": "label2"
        }, {
            "class": "label label-success animated fadeIn",
            "content": "label3"
        }
    ];
    $scope.addlabel = function () {
        $scope.labels.push({"class": "label label-primary animated fadeIn", "content": "label4"});
    };

    //Zone Picker
    $scope.zonePicker = function (zone) {
        $scope.pZone = zone;
    };
    //button style reverse module
    $scope.boption1 = true;
    $scope.boption2 = true;
    $scope.boption3 = true;
    $scope.boption4 = true;
    $scope.boption5 = true;
    $scope.boption6 = true;
    $scope.stratRollingFlag = false;
    //porn info button
    $scope.breverse1 = function () {
        if ($scope.boption1) {
            $scope.boption1 = false;
            $scope.pornInfoFilter = false;

        } else {
            $scope.boption1 = true;
            $scope.pornInfoFilter = true;
        }
    };
    //Anti info button
    $scope.breverse2 = function () {
        if ($scope.boption2) {
            $scope.boption2 = false;
            $scsope.antiInfoFilter = false;
        } else {
            $scope.boption2 = true;
            $scope.antiInfoFilter = true;
        }
    };
    //Map Switch Function
    $scope.mapSwitch = function (type) {
        $scope.mapTypeFlag = type;
    };

    //violence info button
    $scope.breverse3 = function () {
        if ($scope.boption3) {
            $scope.boption3 = false;
            $scope.violenceFilter = false;
        } else {
            $scope.boption3 = true;
            $scope.antiInfoFilter = true;
        }
    };
    //Text option button
    $scope.breverse4 = function () {
        if ($scope.boption4) {
            $scope.boption4 = false;
            $scope.textFilter = false;
        } else {
            $scope.boption4 = true;
            $scope.textFilter = true;
        }
    };
    //image option button
    $scope.breverse5 = function () {
        if ($scope.boption5) {
            $scope.boption5 = false;
            $scope.imgaeFilter = false;
        } else {
            $scope.boption5 = true;
            $scope.imgaeFilter = true;
        }
    };
    //video option button
    $scope.breverse6 = function () {
        if ($scope.boption6) {
            $scope.boption6 = false;
            $scope.videoFilter = false;
        } else {
            $scope.boption6 = true;
            $scope.videoFilter = true;
        }
    };
    //
    $scope.showResourceDetailModal = function (index) {
        $http({
            method: 'GET',
            url: main.data.url + 'resourceDetail/',
            params: {
                'id': index
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.resourceDetail = response.data;

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
        $("#resourceModal").modal();
    };
    $scope.showLiveDetailMoal = function (index) {
        $http({
            url: main.data.url + 'live_detail/',
            method: 'GET',
            params: {
                'liveId': index
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.liveDetail = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
        $("#liveModal").modal();
    };

    // 举报直播
    $scope.report_live = function (index) {
        $http({
            method: 'GET',
            url: main.data.url + 'report_live/',
            params: {
                'liveId': index
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            // $scope.liveDetail = response.data;
            alert('report successfully')
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
        $("#liveModal").modal();
    };
    // 节点详情
    $scope.showNodeDetailModal = function (index) {
        $http({
            method: 'GET',
            url: main.data.url + 'node_detail/',
            params: {
                'ip': index,
                'showPornInfo': $scope.pornInfoFilter,
                'showAntiInfo': $scope.antiInfoFilter,
                'showViolenceInfo': $scope.violenceFilter,
                'showText': $scope.textFilter,
                'showImage': $scope.imgaeFilter,
                'showVideo': $scope.videoFilter,
                'area': $scope.pZone,
                'page': $scope.pageFilter,
                'time': $scope.timeFilter
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.nodeDetail = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
        $("#nodeModal").modal();
    }

    // 资源屏蔽
    $scope.blcokResourceListAction = function () {
        $http({
            method: 'POST',
            url: main.data.url + 'resource_shield/',
            // POST data
            data: {
                'resource_id': resourcemarklist
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.resourceDetail = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
        $("#blockResult").modal('show');
    };

    // 节点屏蔽
    $scope.blockNodeListAction = function () {
        $http({
            method: 'POST',
            url: main.data.url + 'node_shield/',
            // POST data
            data: {
                'node_ip': nodemarklist
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.resourceDetail = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
        $("#blockResult").modal('show');
    };

    $scope.cancelBlockResourceListAction = function () {
    };

    $scope.cancelBlockNodeListAction = function () {
    };

    //    Test info
    $scope.historyNodeRecord = [
        {
            'ip': '114.117.194.0',
            'title': 'Ip地址:114.117.194.0',
            'src': '../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png',
            'belonging': '四川成都市',
            'captureTime': 'Sun, 23 Apr 2017 09:42:35 GMT',
            'blockTime': 'Sun, 23 Apr 2017 09:45:35 GMT',
            'keywords': ['女优', '法轮功', '恐怖袭击']
        }, {
            'ip': '114.117.194.1',
            'title': 'Ip地址:114.117.194.0',
            'src': '../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png',
            'belonging': '江苏南京市',
            'captureTime': 'Sun, 23 Apr 2017 09:42:35 GMT',
            'blockTime': 'Sun, 23 Apr 2017 09:45:35 GMT',
            'keywords': ['韩国少女情怀', '叙利亚战争', '恐怖袭击']
        }
    ];
    $scope.liveDetail = {
        'host': '苍老师',
        "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
        'room': 'live-001',
        'platform': '斗鱼TV',
        'captureTime': 'Sun, 23 Apr 2017 09:44:35 GMT',
        'watchNum': '100098',
        'classification': '色情',
        'textCharacter': [
            '老司机快来，我报警了', '这大尺度。。。。。', '快报警'
        ],
        'imageCharacter': ['../images/image_picture_128px_1187880_easyicon.net.png', '../images/hotspot_128px_1114554_easyicon.net.png']
    };
    $scope.resourcerecord = [
        // {
        //     "id": "resource-001",
        //     "ip": "114.117.194.0",
        //     "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
        //     "heading": "Ip地址:114.117.194.0",
        //     "belonging": "归属地：四川成都市",
        //     "capturetime": "捕获时间:Sun, 23 Apr 2017 09:42:35 ",
        //     "resourcename": "资源名：第一會所新片@SIS001@(映天)(YAG-071)変態露出倶楽部_SP_高橋美緒",
        //     "resourcetype": "视频文件",
        //     "classfystandard": ["色情",],
        //     "labeltype": ramdonlabelclasspicker.pick()
        // },
        // {
        //     "id": "resource-002",
        //     "ip": "114.117.194.0",
        //     "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
        //     "heading": "Ip地址:114.117.194.1",
        //     "belonging": "归属地：四川成都市",
        //     "capturetime": "捕获时间:Sun, 23 Apr 2017 09:42:35 ",
        //     "resourcename": "资源名：幼女",
        //     "resourcetype": "视频文件",
        //     "classfystandard": "色情",
        //     "labeltype": ramdonlabelclasspicker.pick()
        // },
        // {
        //     "id": "resource-003",
        //     "ip": "114.117.194.0",
        //     "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
        //     "heading": "Ip地址:114.117.194.2",
        //     "belonging": "归属地：四川成都市",
        //     "capturetime": "捕获时间:Sun, 23 Apr 2017 09:42:35 ",
        //     "resourcename": "资源名：超性感的极品露脸校花女情黑丝,援助富商拍摄淫片 极品嫩穴后入爆艹颜射吞 卧室猛干人间尤物嫩逼二奶，一天操三次都不嫌多  小女粉嫩爽滑 大连SA哥又搞了条新鲜嫩菜 舞蹈學校美騷貨插得直流白漿超性感的极品露脸校花女情黑丝,援助富商拍摄淫片 极品嫩穴后入爆艹颜射吞 卧室猛干人间尤物嫩逼二奶，一天操三次都不嫌多  小女粉嫩爽滑 大连SA哥又搞了条新鲜嫩菜 舞蹈學校美騷貨插得直流白漿",
        //     "resourcetype": "视频文件",
        //     "classfystandard": "色情",
        //     "labeltype": ramdonlabelclasspicker.pick()
        // }
    ];
    $scope.noderecord = [
        {
            "ip": "114.117.194.0",
            "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
            "heading": "114.117.194.0",
            "belonging": "北京市",
            "capturetime": "Sun, 23 Apr 2017 09:44:35 GMT",
            "antinum": "14",
            "pornnum": "21",
            "vionum": "12",
            "feature": ["韩国少女情怀", "叙利亚战争", "恐怖袭击"]
        }, {
            "ip": "114.117.194.1",
            "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
            "heading": "114.117.194.1",
            "belonging": "江苏南京市",
            "capturetime": "Sun, 23 Apr 2017 09:44:35 GMT",
            "antinum": "14",
            "pornnum": "221",
            "vionum": "152",
            "feature": ["韩国少女情怀", "伊拉克", "恐怖袭击"]
        }, {
            "ip": "114.117.194.2",
            "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
            "heading": "114.117.194.2",
            "belonging": "日本",
            "capturetime": "Sun, 23 Apr 2017 09:44:35 GMT",
            "antinum": "5",
            "pornnum": "25",
            "vionum": "452",
            "feature": ["法轮功", "叙利亚战争", "恐怖袭击"]
        }
    ];
    $scope.nodeDetail = [
        {
            "id": "resource-001",
            "ip": "114.117.194.0",
            "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
            "heading": "Ip地址:114.117.194.0",
            "belonging": "归属地：四川成都市",
            "capturetime": "捕获时间:Sun, 23 Apr 2017 09:42:35 ",
            "resourcename": "资源名：超性感的极品露脸校花女情黑丝,援助富商拍摄淫片 极品嫩穴后入爆艹颜射吞 卧室猛干人间尤物嫩逼二奶，一天操三次都不嫌多  小女粉嫩爽滑 大连SA哥又搞了条新鲜嫩菜 舞蹈學校美騷貨插得直流白漿超性感的极品露脸校花女情黑丝,援助富商拍摄淫片 极品嫩穴后入爆艹颜射吞 卧室猛干人间尤物嫩逼二奶，一天操三次都不嫌多  小女粉嫩爽滑 大连SA哥又搞了条新鲜嫩菜 舞蹈學校美騷貨插得直流白漿",
            "resourcetype": "视频文件",
            "classfystandard": "色情",
            "labeltype": ramdonlabelclasspicker.pick()
        }, {
            "id": "resource-002",
            "ip": "114.117.194.1",
            "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
            "heading": "Ip地址:114.117.194.1",
            "belonging": "归属地：四川成都市",
            "capturetime": "捕获时间:Sun, 23 Apr 2017 09:42:35 ",
            "resourcename": "资源名：第一會所新片@SIS001@(映天)(YAG-071)変態露出倶楽部_SP_高橋美緒",
            "resourcetype": "视频文件",
            "classfystandard": "色情",
            "labeltype": ramdonlabelclasspicker.pick()
        }, {
            "id": "resource-003",
            "ip": "114.117.194.2",
            "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
            "heading": "Ip地址:114.117.194.2",
            "belonging": "归属地：四川成都市",
            "capturetime": "捕获时间:Sun, 23 Apr 2017 09:42:35 ",
            "resourcename": "资源名：[桜都字幕组][クリムゾン] アイドル強制操作～女を思いのままに操る悪魔のスマートフォン～",
            "resourcetype": "视频文件",
            "classfystandard": "色情",
            "labeltype": ramdonlabelclasspicker.pick()
        }
    ];
    $scope.resourceDetail = {
        "id": "resource-001",
        "title": "Ip地址：192.168.1.1",
        "titleImage": "../images/image_picture_128px_1187880_easyicon.net.png",
        "belonging": "四川成都",
        "captureTime": "Sun, 23 Apr 2017 09:44:35 GMT",
        "fileType": "视频文件",
        "classificationType": "色情",
        "name": "超性感的极品露脸校花女情黑丝,援助富商拍摄淫片 极品嫩穴后入爆艹颜射吞 卧室猛干人间尤物嫩逼二奶，一天操三次都不嫌多 小女粉嫩爽滑 大连SA哥又搞了条新鲜嫩菜 舞蹈學校美騷貨插得直流白漿超性感的极品露脸校花女情黑丝,援助富商拍摄淫片 极品嫩穴后入爆艹颜射吞 卧室猛干人间尤物嫩逼二奶，一天操三次都不嫌多 小女粉嫩爽滑 大连SA哥又搞了条新鲜嫩菜 舞蹈學校美騷貨插得直流白漿",
        "textCharacter": [
            '老司机快来，我报警了', '这大尺度。。。。。', '快报警', '福利大放送'
        ],
        "imageCharacter": ['../images/image_picture_128px_1187880_easyicon.net.png', '../images/hotspot_128px_1114554_easyicon.net.png']
    };
    $scope.realtimeNonLiveRecord1 = [
        {
            "id": "resource-001",
            "ip": "114.117.194.0",
            "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
            "title": "114.117.194.0",
            "belonging": "四川成都市",
            "capturetime": "Sun, 23 Apr 2017 09:42:35 GMT",
            "filename": "超性感的极品露脸校花女情黑丝,援助富商拍摄淫片 极品嫩穴后入爆艹颜射吞 卧室猛干人间尤物嫩逼二奶，一天操三次都不嫌多  小女粉嫩爽滑 大连SA哥又搞了条新鲜嫩菜 舞蹈學校美騷貨插得直流白漿超性感的极品露脸校花女情黑丝,援助富商拍摄淫片 极品嫩穴后入爆艹颜射吞 卧室猛干人间尤物嫩逼二奶，一天操三次都不嫌多  小女粉嫩爽滑 大连SA哥又搞了条新鲜嫩菜",
            "filetype": ["视频文件"],
            "classification": ["色情"]
        }, {
            "recordtype": "nonlive",
            "id": "resource-002",
            "ip": "114.117.194.0",
            "src": "../images/infobar/text_lines_51.658703071672px_1205974_easyicon.net.png",
            "title": "114.117.194.0",
            "belonging": "江苏南京市",
            "capturetime": "Sun, 23 Apr 2017 09:44:35 GMT",
            "filename": "www.henduofuli.net发布，每日更新 | 韩国WINTV女主播 大尺度视讯 按姓名分类 [127G大合集 磁力链接]",
            "filetype": [
                "文本文件", "种子文件"
            ],
            "classification": ["色情"]
        }, {
            "id": "resource-003",
            "ip": "113.44.15.105",
            "src": "../images/infobar/text_lines_51.658703071672px_1205974_easyicon.net.png",
            "title": "113.44.15.105",
            "belonging": "广东佛山",
            "capturetime": "Sat, 23 Apr 2017 09:41:35 GMT",
            "filename": "成年コミック) [雑誌] [アンソロジー] 月刊Web男の娘・れくしょんッ！S Vol.04 [DL版].zip",
            "filetype": [
                "压缩图片文件", "种子文件"
            ],
            "classification": ["色情"]
        }, {
            "id": "resource-004",
            "ip": "113.44.15.105",
            "src": "../images/infobar/computer_68.88583218707px_1202751_easyicon.net.png",
            "title": "113.44.15.105",
            "belonging": "广东深圳",
            "capturetime": "Sun, 23 Apr 2017 09:41:35 GMT",
            "filename": "青草_20160131A本资源群347491671由我爱主播网整理发布.mp4",
            "filetype": [
                "视频mp4文件", "种子文件"
            ],
            "classification": ["色情"]
        }
    ];
    $scope.realtimeLiveRecord = [
        {
            "liveId": "live-001",
            "src": "../images/harmfulinfo/porn_128px_1075595_easyicon.net.png",
            "title": "斗鱼专业色情主播",
            "capturetime": "Sun, 23 Apr 2017 09:44:35 GMT",
            "platform": "斗鱼tv",
            "number": "10092",
            "livetype": "色情"

        }, {
            'liveId': 'live-002',
            "src": "../images/harmfulinfo/porn_128px_1075595_easyicon.net.png",
            "title": "斗鱼专业色情主播",
            "capturetime": "Sun, 23 Apr 2017 09:44:35 GMT",
            "platform": "斗鱼tv",
            "number": "10092",
            "livetype": "色情"

        }, {
            'liveId': 'live-003',
            "src": "../images/harmfulinfo/porn_128px_1075595_easyicon.net.png",
            "title": "斗鱼专业色情主播",
            "capturetime": "Sun, 23 Apr 2017 09:44:35 GMT",
            "platform": "斗鱼tv",
            "number": "10092",
            "livetype": "色情"

        }, {
            'liveId': 'live-001',
            "src": "../images/harmfulinfo/porn_128px_1075595_easyicon.net.png",
            "title": "斗鱼专业色情主播",
            "capturetime": "Sun, 23 Apr 2017 09:44:35 GMT",
            "platform": "斗鱼tv",
            "number": "10092",
            "livetype": "色情"

        }
    ];

    $scope.interestList = [
        {
            "name": "zdh",
            "id": "zdhzzz",
            "lnglat": [103.871414, 30.937263],
        },
        {
            "name": "tf",
            "id": "tfboys",
            "lnglat": [104.325974, 30.775752],
        },
        {
            "name": "zdh",
            "id": "zdhzz",
            "lnglat": [103.830216, 30.553676],
        },
        {
            "name": "tf",
            "id": "tfbys",
            "lnglat": [104.394638, 30.359534],
        },
        {
            "name": "测试添加电子围栏",
            "id": "test01",
            "lnglat": [104.065392, 30.657099],
        }
    ];

    $scope.fenceList = [];


    $scope.historyTracks = [];

    $scope.messageList = [
        {"time": "2018", "content": "123"}
    ];

    $scope.sliderecords = [
        {
            "class": "second-slide img-responsive",
            "alt": "Second Slide",
            "src": "../images/bg-gardahaus.jpg",
            "title": "Real Time Image",
            "content": "Note: If you re viewing this page via a '<'code'>'file://'<'/code'>'URL, the 'next' and 'previous' Glyphicon buttons on the left and right might not load/display properly due to web browser security rules.",
            "btn": "View Detail"
        }, {
            "class": "third-slide img-responsive",
            "alt": "Third Slide",
            "src": "../images/bg-moveon.jpg",
            "title": "Real Time Image",
            "content": "Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.",
            "btn": "View Detail"
        }
    ];

    /*Running Setting start*/
    $scope.sensitiveKeyword = ["日本", "性感", "裸体", "法轮功"];
    $scope.platform = ["斗鱼TV", "熊猫TV", "全民TV"];
    $scope.trustfulDhtNode = ["router.bittorrent.com:6881", "dht.transmissionbt.com:6881", "router.utorrent.com:6881"];
    $scope.emailList = ["313016129@qq.com", "mojiayong@outlook.com"];
    $scope.addInterest = function () {
        var username = angular.element('#userName')[0].value;
        var id = angular.element('#id')[0].value;
        var index = $.inArray(id, $scope.interestList);
        if (index == -1) { //不存在与数组中
            if (id == "" || username == "") {
                alert("该输入栏不能为空");
            } else {
                $scope.interestList.push(id);
                $http({
                    url: main.data.url + "interests",
                    method: 'Post',
                    data: {
                        'name': username,
                        'id': id
                    }
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    // $scope.resourceDetail = response.data;
                    alert('保存成功')
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    alert('保存失败')
                });
                angular.element('#userName')[0].value = "";
                angular.element('#id')[0].value = "";
            }
        } else {
            alert(username + "已存在");
        }

    };
    $scope.deleteKeyword1 = function (index) {
        $scope.sensitiveKeyword.splice(index, 1);
    };
    $scope.addPlatformword = function () {
        var keyword1 = angular.element('#platformValue')[0].value;
        var index = $.inArray(keyword1, $scope.platform);
        if (index == -1) { //不存在与数组中
            if (keyword1 == "") {
                alert("该输入栏不能为空");
            } else {
                $scope.platform.push(keyword1);
                angular.element('#platformValue')[0].value = "";
            }
        } else {
            alert(keyword1 + "已存在");
        }
    }
    $scope.deletePlatformValue = function (index) {
        $scope.platform.splice(index, 1);
    };
    $scope.addDHTNode = function () {
        var keyword1 = angular.element('#dhtnodeValue')[0].value;
        var index = $.inArray(keyword1, $scope.trustfulDhtNode);
        if (index == -1) { //不存在与数组中
            if (keyword1 == "") {
                alert("该输入栏不能为空");
            } else {
                $scope.trustfulDhtNode.push(keyword1);
                angular.element('#dhtnodeValue')[0].value = "";
            }
        } else {
            alert(keyword1 + "已存在");
        }
    };
    $scope.deletedhtValue = function (index) {
        $scope.trustfulDhtNode.splice(index, 1);
    };
    $scope.deleteEmail = function (index) {
        $scope.emailList.splice(index, 1);
    };
    $scope.addEmail = function () {
        var keyword1 = angular.element('#emailValue')[0].value;
        var index = $.inArray(keyword1, $scope.emailList);
        if (index == -1) { //不存在与数组中
            if (keyword1 == "") {
                alert("该输入栏不能为空");
            } else {
                $scope.emailList.push(keyword1);
                angular.element('#emailValue')[0].value = "";
            }
        } else {
            alert(keyword1 + "已存在");
        }
    };
    /*Running Setting end*/

    // 加载运行配置
    $scope.getRuntimeConfig = function () {
        $scope.sensitiveKeyword = ["7", "8"];
        $scope.platform = ["5", "6"];
        $scope.trustfulDhtNode = ["3", "4"];
        $scope.emailList = ["1", "2"];
        // main.fun.loadstart();
        /*$http({
          method: 'GET',
          url: main.data.url + 'getConfiguration/'
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          // $scope.resourceDetail = response.data;
          // alert(response.data['node']);
          $scope.sensitiveKeyword = response.data['word'];
          $scope.platform = response.data['platform'];
          $scope.trustfulDhtNode = response.data['node'];
          $scope.emailList = response.data['email'];
          // main.fun.loadend();
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          // alert('保存失败')
        });
        // $("#blockResult").modal('show');*/
    };

    // 保存运行配置
    $scope.updateRuntimeConfig = function () {
        $http({
            method: 'POST',
            url: main.data.url + 'updateConfiguration/',
            // POST data
            data: {
                'word': $scope.sensitiveKeyword,
                'platform': $scope.platform,
                'addr': $scope.trustfulDhtNode,
                'email': $scope.emailList
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            // $scope.resourceDetail = response.data;
            alert('保存成功')
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('保存失败')
        });
        // $("#blockResult").modal('show');
    };

});
