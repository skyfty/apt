require.config({
    packages: [{
        name: 'moment',
        location: '../libs/moment',
        main: 'moment'
    }],
    //在打包压缩时将会把include中的模块合并到主文件中
    include: [
        'layer',
        'toastr',
        'fast',
        'form'
    ],
    paths: {
        'lang': "empty:",
        'form': 'require-form',
        'upload': 'require-upload',
        'validator': 'require-validator',
        'poke': 'poke',
        'jquery': '../libs/jquery/dist/jquery.min',
        'bootstrap': '../libs/bootstrap/dist/js/bootstrap.min',
        'bootstrap-select': '../libs/bootstrap-select/dist/js/bootstrap-select',
        'slimscroll': '../libs/jquery-slimscroll/jquery.slimscroll',
        'validator-core': '../libs/nice-validator/dist/jquery.validator',
        'validator-lang': '../libs/nice-validator/dist/local/zh-CN',
        'plupload': '../libs/plupload/js/plupload.min',
        'toastr': '../libs/toastr/toastr',
        'layer': '../libs/fastadmin-layer/dist/layer',
        'cookie': '../libs/jquery.cookie/jquery.cookie',
        'template': '../libs/art-template/dist/template-native',
        "qtip2": '../libs/qtip2/jquery.qtip.min',
        'fastclick': '../libs/jquery-weui/dist/lib/fastclick',
        'swiper': '../libs/jquery-weui/dist/js/swiper.min',
        'raty': '../libs/raty/lib/jquery.raty',
        'flexible': 'customer/flexible',
        'iscroll': '../libs/iscroll/build/iscroll',
        'navbarscroll': 'navbarscroll',
    },
    // shim依赖配置
    shim: {
        'addons': ['poke'],
        'bootstrap': ['jquery'],
        'slimscroll': {
            deps: ['jquery'],
            exports: '$.fn.extend'
        },
        'plupload': {
            deps: ['../libs/plupload/js/moxie.min'],
            exports: "plupload"
        },
        'validator-lang': ['validator-core'],
        'qtip2': ['css!../libs/qtip2/jquery.qtip.css',],
        'swiper': ['css!../libs/swiper/dist/css/swiper.min.css',],
        'raty': ['css!../libs/raty/lib/jquery.raty.css',]
    },
    baseUrl: requirejs.s.contexts._.config.config.site.cdnurl + '/assets/js/', //资源基础路径
    map: {
        '*': {
            'css': '../libs/require-css/css.min'
        }
    },
    waitSeconds: 0,
    charset: 'utf-8' // 文件编码
});

require(['jquery', 'bootstrap'], function ($, undefined) {
    //初始配置
    var Config = requirejs.s.contexts._.config.config;
    //将Config渲染到全局
    window.Config = Config;
    // 配置语言包的路径
    var paths = {};
    // 避免目录冲突
    paths['lang'] = Config.moduleurl + '/ajax/lang?callback=define&controllername=' + Config.controllername;
    paths['poke/'] = 'poke/';
    require.config({paths: paths});

    // 初始化
    $(function () {
        require(['fast','poke'], function (Fast, Poke) {
            if (Config.jsname) {
                require([Config.jsname], function (Controller) {
                    if (Controller[Config.actionname]) {
                        Controller[Config.actionname]();
                    } else if (Controller["defaultact"]) {
                        Controller["defaultact"]();
                    }
                }, function (e) {
                    console.error(e);
                });
            }
        });
    });
});
