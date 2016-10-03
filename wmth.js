var wmth = (function(){
	var config = [];

	var cmds = [];

	var _cq = [];
	
	var _nq = [];
	
	var _rv = {};
	
	function start(){
		config = window._wmConfig.config;
		cmds = window._wmConfig.cmdq;
		_init();
	}
	
	function done(){
		return _rv;
	}
	
	function _init(){
		var coreRdy = true;
		if(config.length > 0){
			for(var i = 0; i < config.length; i++){
				if(!config[i].postload)
					_loadLib(config[i].library);
				if(typeof config[i].init == "function")
					coreRdy = coreRdy && config[i].init();
			}
		}
		if(coreRdy)
			_processCq();
	}

	function _checkCn(cnd){
		if(typeof cnd == "boolean")
			return cnd;
		else if(typeof cnd == "function")
			return cnd();
		else
			return false;
	}

	 function _processCq(){
		for(var i=0; i < cmds.length; i++){
			var cmd = cmds[i];
			if(_checkCn(cmd.condition)){
					_cq[cmd.qid] = cmd.callback;
					_nq[cmd.qid] = cmd.cname;
			}
		}
		_execQ();
	}
	
	function _execQ(){
		var FQ = _cq;
		var NQ = _nq;
		if(FQ.length > 0){
			for(var i = 0; i < FQ.length; i++){
				if(FQ[i] != "undefined" && typeof FQ[i] == "function")
					_rv[NQ[i]] = FQ[i]();
			}
		}
		for(var j = 0; j < config.length; j++){
			if(config[j].postload)
				_loadLib(config[j].library);
		}
	}

	function _loadLib(libConfig){
    	var wmlib = document.createElement('script'); wmlib.type = 'text/javascript'; wmlib.async = libConfig.async;
    	wmlib.src = 'https:' == document.location.protocol ? libConfig.surl : libConfig.url;
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(wmlib, s);
  }

	return {
		startTagHub : start,
		done : done
	}
	
	})();

var _wmConfig = {
	config : [{
		tagname : "GoogleAnalytics",
		status : "new",
		postload : false,
		library : {
			async : true,
			url : "http:\/\/www.google-analytics.com\/ga.js",
			surl : "https:\/\/ssl.google-analytics.com\/ga.js"	
		},
		init : function(){window._gaq = window._gaq || []; return true;}
	},{
		tagname : "SiteCatalyst",
		status : "new",
		postload : false,
		library : {
			async : false,
			url : "\/s_code.js",
			surl : "\/s_code.js"	
		},
		init : function(){return true;}

	}],
	cmdq : [
		{	
			qid	: 0,
			cname : "page",
			condition : function(){return window.location.host == 'localhost';},
			callback : function(){window._gaq.push(['_setAccount','UA-66688-6']);window._gaq.push(['_trackPageview']); return true;}
		},{
			qid : 1,
			cname : "click",
			condition : function(){return jQuery('#test').length > 0;},
			callback : function(){jQuery('#test').on('click',function(){window._gaq.push(['_trackEvent','Test','Test']);}); return true;}
		},{
			qid : 2,
			cname : "Omni",
			condition : function(){window.location.host == '127.0.0.1';},
			callback : function(){window.s.pageName='startpage'; window.s.t(); return true;}
		}
	]
};

window.wmth.startTagHub();
var results = window.wmth.done();