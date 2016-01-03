/**
 * 简易事件发射器
 */
;(function(){

	'use strict';

	function EventEmitter(){}

	var proto = EventEmitter.prototype;

	var type = Object.prototype.toString;
	var slice = Array.prototype.slice;

	function on (eventname, handler, contex, once){
		
		if (!this.eventListeners) {
			this.eventListeners = {};	
		}

		if (!this.eventListeners[eventname]) {
			this.eventListeners[eventname] = [];
		}

		if (type.call(contex) === '[object Boolean]' && typeof once === 'undefined') {
			once = contex;
			contex = undefined;
		}

		this.eventListeners[eventname].push({
			handler: handler,
			contex: contex,
			once: once
		});

	};


	function once (eventname, handler, contex) {
		var args = slice.call(arguments);
		args.push(true);

		on.apply(this, args);
	}


	function fire (eventname, arg){

		if (!this.eventListeners) {
			this.eventListeners = {};	
			return this;
		}

		if (!this.eventListeners[eventname]) {
			return this;
		}

		var handlers = this.eventListeners[eventname];
		arg = slice.call(arguments, 1);

		for (var i = 0, len = handlers.length; i < len; i++) {
			
			if (handlers[i].once !== -1) {
				handlers[i].handler.apply(handlers[i].contex, arg);

				(handlers[i].once) && (handlers[i].once = -1);
			}

		}

	};


	proto.on = function (eventname, handler, contex){
		
		on.apply(this, arguments);

	};

	proto.once = function (eventname, handler, contex){

		once.apply(this, arguments);
	};

	proto.fire = function (eventname, arg){

		fire.apply(this, arguments);
	};


	proto.remove = function (eventname){

		if (!this.eventListeners) {
			this.eventListeners = {};
		}
		this.eventListeners[eventname] = [];

	};

	proto.removeAll = function (){
		delete this.eventListeners;
	};


	/**
	 * 将事件监听和触发功能注册到对象或者构造函数上
	 * @param  {function|object} target 需要绑定事件收发功能的对象或者函数
	 * @return undefined
	 */
	proto.inject = function (target){


		if (type.call(target) === '[object Function]') {
			target.prototype.on = on;
			target.prototype.fire = fire;
			target.prototype.once = once;

		}else if (type.call(target) === '[object Object]') {

			target.on = on;
			target.fire = fire;
			target.once = once;
		}
	};


	window.EventEmitter = EventEmitter;

})();
