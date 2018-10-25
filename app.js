angular
	.module("app", [
		"ngRoute",
		"ngAria",
		"ngAnimate",
		"ngMaterial",
		"ngMessages",
		"angular-loading-bar",
		"buzzflow.import"
	])
	.config(
		[
			"$mdThemingProvider",
			function($mdThemingProvider) {
				"use strict";
				$mdThemingProvider.theme("default").primaryPalette("deep-purple");
			}
		],
		[
			"cfpLoadingBarProvider",
			function(cfpLoadingBarProvider) {
				cfpLoadingBarProvider.includeBar = true;
			}
		]
	);
