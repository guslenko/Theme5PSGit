/**************************************************************************
 * Project:		FlipTimer - jQuery Countdown Timer
 * Info:		https://codecanyon.net/item/fliptimer-jquery-countdown-timer/21154062
 * Version:		1.0
 * Author: 		AthenaStudio
 * Profile: 	https://themeforest.net/user/athenastudio
**************************************************************************/

(function($) {
	"use strict";
	
	$.fn.flipTimer = function(options) {
		var timer;
		
		//API
		$.fn.flipTimer.style = function(bgColor, dividerColor, digitColor) {
			timer.style(bgColor, dividerColor, digitColor);
		};
		
		//Default variables
		var defaults = {
			date:"",
			timeZone:0,
			past:false,
			
			//Current date
			currentDate:false,
			
			//The number of days to be shown
			dayTextNumber:2,	//number or "auto"
			
			//Show-Hide Day, Hour, Minute, Second
			showDay:true,
			showHour:true,
			showMinute:true,
			showSecond:true,
			
			//Texts
			dayText:"Tage",
			hourText:"Stunden",
			minuteText:"Minuten",
			secondText:"Sekunden",
			
			//Flip style
			bgColor:"#333333",
			dividerColor:"#000000",
			digitColor:"#ffffff",
			textColor:"#666666",
			borderRadius:6,
			boxShadow:true,
			
			//Multi color
			multiColor:false,
			
			//Auto reset
			autoReset:false,
			resetInterval:86400, //1 day as seconds
			
			//Expire
			expireType:"message", //message, hide, redirect
			message:"Sorry, you are too late!",
			redirect:""
		};
		
		//Options
		options = $.extend({}, defaults, options);
		
		//Create timer
		return this.each(function() {
			var container = $(this);
			container.addClass("fliptimer");
			timer = new FlipTimer($(this), options);
			timer.init();
		});
		
		//Countdown Timer class
		function FlipTimer($obj, options) {
			
			//Variables
			var $timer, $container, $img;
			var currentTime, time, timeDiff;
			var calcDiff = 0;
			var flip_once = false;
			var intervalId = null;
			
			//Arrays
			var days = [], daysCurrent = [];
			var hours = [], hoursCurrent = [];
			var minutes = [], minutesCurrent = [];
			var seconds = [], secondsCurrent = [];
			
			//Count of numbers
			var dayTextNumber = options.dayTextNumber;
			var hourTextNumber = 2;
			var minuteTextNumber = 2;
			var secondTextNumber = 2;
			
			//Flip size
			var $flip;
			var $flipVal;
			var flipCount = 0;
			var size = 0;
			var elementSize = 0;
			var flipWidth = 60;
			
			//Multi color
			var maxR = parseInt(options.bgColor.slice(1, 3), 16);
			var maxG = parseInt(options.bgColor.slice(3, 5), 16);
			var maxB = parseInt(options.bgColor.slice(5, 7), 16);
			var R = maxR;
			var G = maxG;
			var B = maxB;
			var addR = 0;
			var addG = 0;
			var addB = 0;
			var intervalColorId = null;
			
			//Auto day text number
			var dayTextNumberAuto = 0;
			
			//Init
			this.init = function() {
				var that = this;
				$timer = $obj;
				
				//Add countdown CSS class
				$timer.addClass("fliptimer");
				
				//Find width by a hidden image
				$img = $('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />');
				$timer.append($img);
				
				//Container
				$container = $('<div class="flip-container" />');
				$timer.append($container);
				
				//Convert date string to time
				options.date = this.convertToTime(options.date);
				
				//Convert reset interval to ms
				options.resetInterval *= 1000;
				
				//Check current time				
				time = new Date();
				currentTime = time.getTime();

				if (options.currentDate) {
					options.currentDate = this.convertToTime(options.currentDate);
					calcDiff = options.currentDate-currentTime;
					currentTime = options.currentTime;
				}
				
				currentTime += time.getTimezoneOffset()*60*1000;
				timeDiff = !options.past ? options.date-currentTime : currentTime-options.date;
				
				//Check if day text number is auto/number
				if (isNaN(dayTextNumber) && dayTextNumber==="auto") {
					var time = Math.floor(timeDiff/1000);
					var d = Math.floor(time/(24*60*60));
					
					dayTextNumberAuto = d.toString().length;			
					dayTextNumber = dayTextNumberAuto;
				} 
				
				dayTextNumber = parseInt(dayTextNumber, 10);
				
				//Day
				this.addItem("day", options.showDay, dayTextNumber, options.dayText);
				
				//Hour
				this.addItem("hour", options.showHour, hourTextNumber, options.hourText);
				
				//Minute
				this.addItem("minute", options.showMinute, minuteTextNumber, options.minuteText);
				
				//Second
				this.addItem("second", options.showSecond, secondTextNumber, options.secondText);
				
				//Item size
				this.itemSize();
				
				//Window resize
				$(window).resize(function() {
					that.findSize();
					that.flipStyle();					
				});
				
				//Flip style
				this.findSize();
				this.flipStyle();
				
				//Multi color
				if (options.multiColor) {
					intervalColorId = setInterval(function() {
						that.changeColor();
					}, 16);
				}
				
				//Start timer
				intervalId = setInterval(function() {
					that.checkTime();
				}, 1000);
				
				this.checkTime();
			};
			
			//Add item
			this.addItem = function(className, show, tickNumber, text) {
				if (!show) {return;}
				
				var html =	'<div class="flip-wrapper '+className+'">'+
							'	<div class="flips">';
				
				for (var i=0; i<tickNumber; i++) {				
						html +=	'<ul class="flip flip-'+i+'">'+
									this.tickItem(0, "before")+
									this.tickItem(0, "active")+
								'</ul>';
				}
				
				html += '	</div>'+
						'	<span class="text">'+text+'</span>'+
						'</div>';
				
				$container.append($(html));
			};
			
			//Tick item
			this.tickItem = function(value, className) {
				return 	'<li class="'+className+'">'+
						'	<div class="flip-updown">'+
						'		<div class="flip-up">'+
						'			<div class="flip-shadow"></div>'+
						'			<div class="flip-val">'+value+'</div>'+
						'		</div>'+
						'		<div class="flip-divider"></div>'+
						'		<div class="flip-down">'+
						'			<div class="flip-shadow"></div>'+
						'			<div class="flip-val">'+value+'</div>'+
						'		</div>'+
						'	</div>'+
						'</li>';
			};
			
			//Item size
			this.itemSize = function() {
				if (options.showDay) 	{flipCount += dayTextNumber;}
				if (options.showHour) 	{flipCount += hourTextNumber;}
				if (options.showMinute) {flipCount += minuteTextNumber;}
				if (options.showSecond) {flipCount += secondTextNumber;}
				
				if (flipCount>1) {
					size += 2;
					
					if (flipCount>2) {
						size += 1;
						
						if (flipCount>3) {
							size += 2;
							
							if (flipCount>4) {
								size += 1;
								
								if (flipCount>5) {
									size += 2;
									
									if (flipCount>6) {
										size += 1;
										
										if (flipCount>7) {
											size += 2;
											
											if (flipCount>8) {
												size += 1;
											}
										}
									}
								}
							}
						}
					}
				}
			};
			
			//Find Size
			this.findSize = function() {
				//Find width
				var width = $img.width();
				
				//Get element size
				elementSize = width/(size*flipWidth);
			};
			
			//Style
			this.style = function(bgColor, dividerColor, digitColor) {
				options.bgColor = bgColor;
				options.dividerColor = dividerColor;
				options.digitColor = digitColor;
				
				this.flipStyle();
			};
			
			//Flip style
			this.flipStyle = function() {
				$flip = $container.find("ul");
				
				var w = parseInt(elementSize*flipWidth, 10),
					h = parseInt(elementSize*flipWidth*1.3, 10),
					fs = (w);
				
				//Add px to border radius
				if (!isNaN(options.borderRadius)) {options.borderRadius += "px";}
				
				//Flip
				$flip.width(w).height(h);
				
				$flip.css({
					"font-size":fs+"px",
					"line-height":h+"px",
					"margin":parseInt(w/20, 10)+"px",
					"border-radius":options.borderRadius
				});
				
				if (options.boxShadow) {
					$flip.addClass("flip-box-shadow");
				}
				
				//Divider
				$flip.find(".flip-divider").css({
					"background":options.dividerColor
				});		
				
				//Digit
				$flipVal = $flip.find(".flip-val");
				
				$flipVal.css({
					"background":options.bgColor,
					"color":options.digitColor,
					"border-radius":options.borderRadius
				});		
				
				//Down
				$flip.find(".flip-down").css({
					"border-bottom-left-radius":options.borderRadius,
					"border-bottom-right-radius":options.borderRadius
				});
				
				//Shadow effect
				$flip.find("li.active .flip-up .flip-shadow").css({
					"border-top-left-radius":options.borderRadius,
					"border-top-right-radius":options.borderRadius
				});
				
				//Text color
				$container.find(".text").css({
					"color":options.textColor
				});
				
				//Show container
				$container.show();
			};
			
			//Flip effect
			this.flip = function(className, i, changeNumber) {
				var $wrapper = $timer.find("."+className),
					$flip = $wrapper.find(".flip-"+i),
					$before = $flip.find(".before"),
					$active = $flip.find(".active");
					
				$before.find(".flip-val").text(changeNumber);
				$before.removeClass("before").addClass("active");
				$active.removeClass("active").addClass("before");
			};
			
			//Multi color
			this.changeColor = function() {
				R += addR;
				G += addG;
				B += addB;
				
				if ((R*addR>=maxR*addR) && (G*addG>=maxG*addG) && (B*addB>=maxB*addB)) {
					var color;
					
					R = maxR;
					G = maxG;
					B = maxB;
					
					color = maxR;
					
					maxR = maxG;
					maxG = maxB;
					maxB = color;
					
					addR = (maxR-R)/1000;
					addG = (maxG-G)/1000;
					addB = (maxB-B)/1000;
				}
				
				var newColor = "rgba("+Math.floor(R)+", "+Math.floor(G)+", "+Math.floor(B)+", 1)";
				
				$flipVal.css({
					"background":newColor
				});
			};
			
			//Check current time
			this.checkTime = function() {
				time = new Date();
				currentTime = time.getTime()+calcDiff+time.getTimezoneOffset()*60*1000;
				timeDiff = !options.past ? options.date-currentTime : currentTime-options.date;
				
				if (timeDiff>=0) {
					//Countdown
					if (options.autoReset) {
						//Reset
						timeDiff = timeDiff%options.resetInterval;
					}
				} else {
					//Countup
					if (options.autoReset) {
						//Reset
						timeDiff = options.resetInterval+(timeDiff%options.resetInterval);
					} else {
						clearInterval(intervalId);
						timeDiff = 0;
						
						switch (options.expireType) {
							case "message":
								$container.addClass("onfinish");
								
								var $message = $('<div class="flip-message" />');
								$message.html(options.message);
								
								$timer.append($message);
								break;
							case "hide":
								$timer.fadeOut();
								break;
							case "redirect":
								document.location.href = options.redirect;
								break;
						}
					}
				}
				
				var currentTimeText = this.timeFormat(timeDiff);				
				var currentTimeChars = currentTimeText.split("");
				var i = 0;
				
				/**************
				    - Day -
				**************/
				for(i = 0; i<dayTextNumber; i++) {
					days[i] = parseInt(currentTimeChars.shift(), 10);
				}
				
				var n = days.length-1;
				
				if (options.showDay && days[n]!==daysCurrent[n]) {
					this.flip("day", n, days[n]);
					daysCurrent[n] = days[n];
					
					if (n>0) {						
						for (i=0; i<n; i++) {
							if ((!options.past && daysCurrent[n]===9) || (options.past && daysCurrent[1]===0) || !flip_once) {								
								this.flip("day", i, days[i]);
							}
						}
					}
				}
				
				/***************
				    - Hour -
				***************/		
				for(i = 0; i<hourTextNumber; i++) {
					hours[i] = parseInt(currentTimeChars.shift(), 10);	
				}
				
				if (options.showHour && hours[1]!==hoursCurrent[1]) {
					//Right
					this.flip("hour", 1, hours[1]);
					hoursCurrent[1] = hours[1];
					
					//Left
					if ((!options.past && hoursCurrent[1]===9) || (options.past && hoursCurrent[1]===0) || !flip_once) {
						this.flip("hour", 0, hours[0]);
					}
					
					if (hoursCurrent[0]<1 && hoursCurrent[1]<2) {
						this.flip("hour", 0, hours[0]);
					}
					
					hoursCurrent[0] = hours[0];
				}
				
				/*****************
				    - Minute -
				*****************/				
				for(i = 0; i<minuteTextNumber; i++) {
					minutes[i] = parseInt(currentTimeChars.shift(), 10);
				}
				
				if (options.showMinute && minutes[1]!==minutesCurrent[1]) {
					//Right
					this.flip("minute", 1, minutes[1]);
					minutesCurrent[1] = minutes[1];
					
					//Left
					if ((!options.past && minutesCurrent[1]===9) || (options.past && minutesCurrent[1]===0) || !flip_once) {
						this.flip("minute", 0, minutes[0]);
					}
					
					minutesCurrent[0] = minutes[0];
				}
				
				/*****************
				    - Second -
				*****************/
				for(i=0; i<secondTextNumber; i++) {
					seconds[i] = parseInt(currentTimeChars.shift(), 10);
				}
				
				if (options.showSecond && seconds[1]!==parseInt(secondsCurrent[1], 10)) {
					//Right
					this.flip("second", 1, seconds[1]);
					secondsCurrent[1] = seconds[1];
					
					//Left
					if ((!options.past && secondsCurrent[1]===9) || (options.past && secondsCurrent[1]===0) || !flip_once) {
						this.flip("second", 0, seconds[0]);
					}
					
					secondsCurrent[0] = seconds[0];
				}
				
				flip_once = true;
			};
			
			//Text format
			this.textFormat = function(text, length, fillChar) {
				text = text.toString();
				
				while (text.length<length) {
					text = fillChar+text;
				}
				
				if (text.length>length) {
					text = text.substr(text.length-length,length);
				}
				
				return text;
			};

			//Time format
			this.timeFormat = function(msec) {
				var time = Math.floor(msec/1000);
				var s = time%60;
				var i = Math.floor(time%(60*60)/60);
				var h = Math.floor(time%(24*60*60)/(60*60));
				var d = Math.floor(time/(24*60*60));
				
				return this.textFormat(d, dayTextNumber, "0")+this.textFormat(h, hourTextNumber, "0")+this.textFormat(i, minuteTextNumber, "0")+this.textFormat(s, secondTextNumber, "0");
			};
			
			//Convert string to time
			this.convertToTime = function(date) {
				var time = date.split("/").join(" ").split(":").join(" ").split(" ");
				var y = parseInt(time[0], 10);
				var m = parseInt(time[1], 10)-1;
				var d = parseInt(time[2], 10);
				var h = parseInt(time[3], 10);
				var i = parseInt(time[4], 10)-options.timeZone*60;
				var s = parseInt(time[5], 10);
				
				return new Date(y, m, d, h, i, s, 0).getTime();
			};
			
		}
	};
		
})(jQuery);