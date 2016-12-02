/// FOR PLAYING WITH ///
var snowType = '*';
var snowParticles = 450;
var snowSize = 30;
////////////////////////

for (i=0;i<=snowParticles;i++) {
  $('body').append('<div class="snow">'+snowType+'</div>');
}
$('.snow').each(function() {
  var selectWind = Array('snowLeft','snowRight');
  var wind = selectWind[Math.round(Math.random()*selectWind.length)];
  var duration = (Math.random()*10)+20;
  var size = Math.round(Math.random()*snowSize)+8;
  var left = Math.round(Math.random()*100);
  var delay = Math.round(Math.random()*duration);
  var visibility = Math.round(Math.random()*10);

  $(this).css({
  'color':'rgba(255,255,255,.'+visibility+')',
  'text-shadow':'0 0 10px rgba(255,255,255,.'+visibility+')',
  'font-family':'"Times", serif',
  'font-size':size,
  'position':'fixed',
  'z-index':'200',
  'opacity':'0',
  '-webkit-animation':wind+' '+duration+'s infinite',
  '-webkit-animation-delay':delay+'s',
  '-moz-animation':wind+' '+duration+'s infinite',
  '-moz-animation-delay':delay+'s',
  '-ms-animation':wind+' '+duration+'s infinite',
  '-ms-animation-delay':delay+'s',
  'left':left+'%',
  'top':'0'
  });
});
