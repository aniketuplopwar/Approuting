var AppRouter = function(config){

	this.routes = config.routes;
    this.activeRoute = this.getRouteByPattern(window.location.hash);
};

AppRouter.prototype.init = function(){
	this.bindEvents();
};

AppRouter.prototype.getDesiredRoute = function(route, routeConfig) {
	
	if(route === this.activeRoute){
		return this.activeRoute;
	}

	if(routeConfig.allowedSources.indexOf(this.activeRoute) > -1){
		this.activeRoute = route;
	} else {
     	if(this.routes["defaultRoute"]) {
     		this.activeRoute = "defaultRoute";
       	}    	
    }
    return this.activeRoute;
};



AppRouter.prototype.bindEvents = function(){
	var _this = this;

	$(window).on("hashchange",function(){
		var requestedRouteInfo = _this.getRouteByPattern(window.location.hash);
			requestedRoute = requestedRouteInfo.route;
			requestedRouteConfig = _this.routes[requestedRoute],
			desiredRoute = _this.getDesiredRoute(requestedRoute, requestedRouteConfig),
			desiredRouteConfig = _this.routes[desiredRoute],
			urlParameter = _this.getUrlParameter(window.location.hash);

		$(_this).trigger(desiredRouteConfig.action, requestedRouteInfo.urlParameter);
    });
};


AppRouter.prototype.getRouteByPattern = function(url){
	var route = "defaultRoute",
		hash = url.substring(1,url.length),
		urlSplit = hash.split("/");
		urlParameter = urlSplit[1];
		isDynamicRequest = this.isDynamicRequest(hash);


	for(var r in this.routes) {
		if(isDynamicRequest){
			 if(this.isDynamicRoute(this.routes[r].pattern)){
				patternSplit = this.routes[r].pattern.split("/:");
				if(urlSplit[0] === patternSplit[0]){
					route = r;
					break;
				}
			}
		} else {
			if(urlSplit[0] === this.routes[r].pattern){
				route = r;
				break;
			}
		}
    }


	return {
		"route" : route,
		"urlParameter" : urlParameter
	};
};

AppRouter.prototype.isDynamicRoute = function(pattern){
	if(pattern.indexOf("/:") > -1){
		return true;
	}
	return false;
};

AppRouter.prototype.isDynamicRequest = function(hash){
	var hashSplit = hash.split("/");
	if(hashSplit.length > 1){
		return true;
	}
	return false;
};