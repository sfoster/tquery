(function(requirejs){
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
	if(!requirejs) {
		// if this is loaded before require.js we just leave our config there where it can find it
		 requirejs = config;
	} else {
		// if requirejs is already defined, pass it our config
		requirejs.config(config);
	}
})(requirejs);