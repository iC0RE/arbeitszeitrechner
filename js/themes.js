var themes = {
    "original": "bootstrap-3.3.7-dist/css/bootstrap.css",
    "xmas": "bootstrap-3.3.7-dist/css/bootstrap_xmas.css"
};
var scripts = {
    "original": "js/original.js",
    "xmas": "js/xmas.js"
}

$(function(){
    var themesheet = $('<link href="'+themes['original']+'" rel="stylesheet" class="theme-sheet"/>');

    var themescript = $('<script src="'+scripts['original']+'" type="text/javascript" class="theme-script"></script>');

    themesheet.appendTo('head');
    themescript.append('body');
    $('.theme-link').click(function(){
        $('.theme-sheet').remove();
        $('.theme-script').remove();
        var themeurl = themes[$(this).attr('data-theme')];
        var themeturl = scripts[$(this).attr('data-theme')];
        themesheet.attr('href',themeurl);
        themescript.attr('src', themeturl);
        themescript.append('body');
        themesheet.appendTo('head');
    });
});
