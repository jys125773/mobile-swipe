;(function(){
	window.Swipe = Swipe;
	function Swipe(opts){
		this.dom = opts.dom;
		this.interval = opts.interval;//过渡时间
		this.width = opts.width;//百分比
		this.wrap = null;
		this.items = [];
		this.imgSrc = opts.imgSrc;
		this.len = this.imgSrc.length;
		this.idx = 0;//信号量
		this.init();
		this.bindEvent();
	};
	Swipe.prototype.init = function(){
		this.dom.style.width = this.width*100+"%";
		this.w = parseInt(getComputedStyle(this.dom,false)["width"]);//轮播图的宽度
		this.wrap = document.createElement("ul");
		this.wrap.className = "wrap";
		this.dom.appendChild(this.wrap);//item容器
		for(var i = 0,img,li; i < this.len ; i++){
			li = document.createElement("li");
			li.className = "item";//item
			img = new Image();
			img.src = this.imgSrc[i];//图片
			li.appendChild(img);
			this.wrap.appendChild(li);
		};
		this.items = this.dom.querySelectorAll(".item");
		this.show = document.createElement("span");
		this.dom.appendChild(this.show);
		this.show.innerHTML = (this.idx+1)+"/"+this.len;
		
		var self = this;
		//设置轮播图的高度
		this.img0 = this.items[0].querySelector("img");//用于调整尺寸
		this.img0.addEventListener("load", function(){
			self.dom.style.height = getComputedStyle(this,false)["height"];
			self.refresh();
		}, false);
	};
	Swipe.prototype.bindEvent = function(){
		var self = this;
		this.wrap.addEventListener("touchstart", touchstartHandler, false);
		this.wrap.addEventListener("touchmove", touchmoveHandler, false);
		this.wrap.addEventListener("touchend", touchendHandler, false);

		var prev,next,startX,offsetX,starTime;
		//前一张，后一张，触摸起点x轴位置，x轴偏移，触屏开始的时间；

		function touchstartHandler(event){//这里面的this就是外面的this.dom
			startX = event.touches[0].pageX;//触摸开始位置
			offsetX = 0;//横坐标偏移量，由translateX引起，每次触屏清零
			starTime = new Date();//触屏开始的时间
			for(var i = 0 ; i < self.len ; i++){
				self.items[i].style.webkitTransition = "none";
			};
		};
		function touchmoveHandler(event){
			event.stopPropagation();
			event.preventDefault();
			offsetX = event.touches[0].pageX - startX;//手指偏移量变化

			self.prev = self.idx != 0 ? self.idx - 1 : self.len - 1,//前一张
			self.next = self.idx != self.len - 1 ? self.idx + 1 : 0;//后一张
			
			self.items[self.prev].style.webkitTransform = "translate3d("+(offsetX-self.w)+ "px,0,0)";
			self.items[self.idx].style.webkitTransform = "translate3d("+ offsetX +"px,0,0)";
			self.items[self.next].style.webkitTransform = "translate3d("+ (offsetX+self.w) +"px,0,0)";
		};
		function touchendHandler(event){
			if (new Date() - starTime < 150) {//如果划得很快
				if (offsetX > 0) {
					// console.log("下一张");
					self.go(self.idx-1,"quick");
				} else{
					self.go(self.idx+1,"quick");
				};
				return;
			};
			if (offsetX > self.w/2) {//向右滑动大于一半，到左边去
				self.go(self.idx-1);
			} else if(offsetX < -self.w/2){//向左滑动大于一半，到右边去
				self.go(self.idx+1);
			}else{
				self.go(self.idx);
			};
		};
	};
	Swipe.prototype.go = function(x,quick){
		var temp = x- this.idx,//判断向前向后
			speed = quick ? 0.1 : this.interval/1000;//快慢切换
		if (x < 0) {
			x = this.len - 1;
		} else if(x > this.len - 1){
			x = 0;
		};
		this.idx = x;
		this.show.innerHTML = (this.idx+1)+"/"+this.len;
		this.prev = this.idx != 0 ? this.idx - 1 : this.len - 1;//前一张
		this.next = this.idx != this.len - 1 ? this.idx + 1 : 0;//后一张
		if (temp>=0) {
			this.items[this.prev].style.webkitTransition = "-webkit-transform "+speed+"s ease-out";
		};
		this.items[this.idx].style.webkitTransition = "-webkit-transform "+speed+"s ease-out";
		if (temp<=0) {
			this.items[this.next].style.webkitTransition = "-webkit-transform "+speed+"s ease-out";
		};

		this.items[this.prev].style.webkitTransform = "translate3d(" + -this.w + "px,0,0)";
		this.items[this.idx].style.webkitTransform = "translate3d(0,0,0)";
		this.items[this.next].style.webkitTransform = "translate3d("+ this.w +"px,0,0)";
	};
	Swipe.prototype.refresh = function(){//屏幕宽度变化时刷新
		var self = this,h;
		window.addEventListener("resize",adjust, true);
		function adjust(){
			self.w = document.body.clientWidth*self.width;
			self.dom.style.width = self.w + "px";
			self.dom.style.height =  getComputedStyle(self.img0,false)["width"];
			//重新调整位置
			for(var i = 0 ; i < self.len ; i++){
				if (i!=self.idx) {//信号量的已经为0了
					self.items[i].style.webkitTransform = "translate3d("+ self.w + "px,0,0)";
				};
			};
		};
	};
})();