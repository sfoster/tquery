(function(undef){
	var global = this, 
			requirejs = global.requirejs;

	var config = {
		baseUrl: "../../..",
		enforceDefine: true,
		paths : {
			// 'plugins' : "../../../plugins",
			// 'threex'	: "../../../vendor/threex",
			'tquery'	: "build/tquery-bundle"
		},
		shim : {
			// any non-AMD mappings can be defined here. See: http://requirejs.org/docs/api.html#config-shim
			deps: [],
			tquery: {
				exports: "tQuery"
			}
		} 
	};
	if(!global.requirejs) {
  	console.log("assigning global require as config: ", config);
		// if this is loaded before require.js we just leave our config there where it can find it
		 require = config;
	} else {
		// if requirejs is already defined, pass it our config
		console.log("Calling requirejs.config with: ", config);
		requirejs.config(config);
	}
})();