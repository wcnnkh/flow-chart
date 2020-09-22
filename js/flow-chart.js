//扩展jquery
jQuery.fn.extend({
	/**
	 * 连接两个任意的div
	 * @param {Object} to
	 * @return 如果返回空就说明无法划线
	 */
	connectingLine: function(to) {
		var fromOffset = this.offset();
		var fromDetails = {
			"top": fromOffset.top,
			"left": fromOffset.left,
			"width": this.width(),
			"height": this.height()
		}

		var toUse = jQuery(to);
		var toOffset = toUse.offset();
		var toDetails = {
			"top": toOffset.top,
			"left": toOffset.left,
			"width": toUse.width(),
			"height": toUse.height()
		}

		if(toDetails.left < (fromDetails.left + fromDetails.width) && fromDetails.left < (toDetails.left + toDetails.width) && toDetails.top < (fromDetails.top + fromDetails.height) && fromDetails.top < (toDetails.top + toDetails.height)) {
			//发生碰撞
			return;
		}

		//两个div的中心点坐标
		var fromLeft = fromDetails.left + fromDetails.width / 2;
		var fromTop = fromDetails.top + fromDetails.height / 2;
		var toLeft = toDetails.left + toDetails.width / 2;
		var toTop = toDetails.top + toDetails.height / 2;

		var parent = this.parent();
		var line = document.createElement("div");
		line = jQuery(line);

		//边框大小
		var borderSize = 8;
		line.css({
			"position": "absolute",
			"border": "transparent " + borderSize + "px black"
		});

		if(toLeft >= fromDetails.left && toLeft <= fromDetails.left + fromDetails.width) {
			var left = toDetails.width >= fromDetails.width ? fromLeft : toLeft;
			var top = toTop < fromTop ? (toDetails.top + toDetails.height) : (fromDetails.top + fromDetails.height);
			var width = 0;
			var height = toTop > fromTop ? (toDetails.top - top) : (fromDetails.top - top);
			line.css({
				"border-left-style": "solid",
				"width": width + "px",
				"height": height + "px",
				"left": left + "px",
				"top": top + "px"
			});
		} else if((toTop >= fromDetails.top && toTop <= fromDetails.top + fromDetails.height) || (fromTop >= toDetails.top && fromTop <= (toDetails.top + toDetails.height))) {
			var left = toLeft > fromLeft ? (fromDetails.left + fromDetails.width) : (toDetails.left + toDetails.width);
			var top = toDetails.height > fromDetails.height ? fromTop : toTop;
			var width = toLeft > fromLeft ? (toDetails.left - left) : (fromDetails.left - left);
			var height = 0;
			line.css({
				"border-top-style": "solid",
				"width": width + "px",
				"height": height + "px",
				"left": left + "px",
				"top": top + "px"
			});
		} else if(toLeft >= fromLeft) {
			//右边
			if(toTop >= fromTop) {
				//下面(右下)
				var left = fromDetails.left + fromDetails.width;
				var top = fromTop;
				var width = toDetails.top <= top ? (toDetails.left - left) : (toLeft - left);
				var height = toDetails.top - top;
				line.css({
					"border-top-style": "solid",
					"border-right-style": "solid",
					"width": width + "px",
					"height": (height - borderSize / 4) + "px",
					"left": left + "px",
					"top": top + "px"
				});
			} else {
				var left = fromDetails.left + fromDetails.width;
				var top = toDetails.top + toDetails.height;
				var width = toLeft - left;
				var height = fromTop - top;
				line.css({
					"border-bottom-style": "solid",
					"border-right-style": "solid",
					"width": width + "px",
					"height": height + "px",
					"left": left + "px",
					"top": top + "px"
				});
			}
		} else {
			return toUse.connectingLine(this);
		}
		parent.append(line);
		return line;
	},

	flowChart: function(data, lineRoot) {
		if(!(data instanceof Array)) {
			throw new Error("数组格式必须为数组");
		}

		var size = data.length;
		if(size <= 0) {
			return;
		}

		var div = document.createElement("div");
		div.style.textAlign = "center";
		div.style.margin = "20px auto 40px auto";
		this.append(div);
		for(var i = 0; i < size; i++) {
			var config = data[i];
			var item = document.createElement("span");
			item.style.border = "solid 1px black";
			item.style.padding = "4px";
			item.style.margin = "10px"
			item.innerHTML = config.title;
			div.appendChild(item);

			if(lineRoot) {
				jQuery(lineRoot).connectingLine(item);
			}

			if(config.subsete) {
				this.flowChart(config.subsete, item);
			}
		}
	}
})