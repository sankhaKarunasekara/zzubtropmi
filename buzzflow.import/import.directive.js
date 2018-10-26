// the url with "/" prefix is relative to the domain, without the "/" prefix it will be relative to the main ("index.html") page or base url (if you use location in the html5 mode).
//you can access the $scope from html
angular
	.module("buzzflow.import")
	.directive("importUpload", [
		function() {
			return {
				templateUrl: "/buzzflow.import/templates/import.upload.html"
			};
		}
	])
	.directive("importMapping", [
		function() {
			return {
				templateUrl: "/buzzflow.import/templates/import.mapping.html"
			};
		}
	])
	.directive("importFinishing", [
		function() {
			return {
				templateUrl: "/buzzflow.import/templates/import.finishing.html"
			};
		}
	])
	.directive("importComplete", [
		function() {
			return {
				templateUrl: "/buzzflow.import/templates/import.complete.html"
			};
		}
	])
	.directive("fileOnChange", function() {
		return {
			restrict: "A",
			link: function(scope, element, attrs) {
				var onChangeFunc = scope.$eval(attrs.fileOnChange);
				element.bind("change", function(event) {
					var files = event.target.files;
					onChangeFunc(files);
				});
				element.bind("click", function() {
					element.val("");
				});
			}
		};
	})
	.directive("afterRender", [
		"$timeout",
		function($timeout) {
			var def = {
				restrict: "A",
				terminal: true,
				transclude: false,
				link: function(scope, element, attrs) {
					$timeout(scope.$eval(attrs.afterRender), 0); //Calling a scoped method
				}
			};
			return def;
		}
	]);
