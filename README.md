# mobile-swipe
这是一个原创的移动端的触屏滑动组件，原生面向对象组件，-webkit-tranform css3 渲染硬件加速，智能响应手指滑动速度
> 
window.swipe = new Swipe({
> 
  "dom":document.querySelector(".swipe"),//触屏轮播组件的wrapper
 >  
  "interval":500,//css3过渡时间
 > 
  "width":1,//组件所占屏幕的宽度的比例，1=100%
> 
  "imgSrc": [...]//需要载入此组件的图片src地址数组
> 
  
});
