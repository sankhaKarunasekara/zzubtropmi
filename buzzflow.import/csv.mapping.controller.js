angular
	.module("buzzflow.import")
	.controller("csvMappingCtrl", csvMappingController);

csvMappingController.$inject = ["$scope", "dragularService", "importService"];

function csvMappingController($scope, dragularService) {
	//dragularService(".drop-zone");
	//dragularService(".containerVertical");

	$scope.fieldsMap = [];

	// $scope.dealFields;
	// $scope.peopleFields;
	// $scope.companyFields;
	// $scope.activityFields;

	$scope.addMapping = function($dropSource, $target, $source) {
		if ($dropSource.hasClass("drop-zone")) {
			$scope.updateMapping($dropSource, $target, $source);
			return;
		}
		//console.log('add mapping');
		var targetIndex = $target.attr("data-index");
		var sourceIndex = $source.attr("data-index");
		$scope.map[targetIndex].mapValue = sourceIndex.toString();

		//console.log('new mapping: ', $scope.map);
	};

	$scope.updateMapping = function($dropSource, $target, $source) {
		//console.log('update mapping');
		var dropSourceIndex = $dropSource.attr("data-index");
		var targetIndex = $target.attr("data-index");
		var sourceIndex = $source.attr("data-index");
		$scope.map[targetIndex].mapValue = sourceIndex;
		$scope.map[dropSourceIndex].mapValue = null;
		console.log("new mapping: ", $scope.map);
	};

	$scope.removeMapping = function($source) {
		console.log("remove mapping");
		var sourceIndex = $source.attr("data-index");
		$scope.map[sourceIndex].mapValue = null;
		console.log("new mapping: ", $scope.map);
	};

	$scope.swapMapping = function($target, $source, $existing, $sourceItem) {
		console.log("swap mapping");
		var targetIndex = $target.attr("data-index");
		var sourceIndex = $source.attr("data-index");
		var existingIndex = $existing.attr("data-index");
		var sourceItemIndex = $sourceItem.attr("data-index");
		$scope.map[targetIndex].mapValue = existingIndex;
		$scope.map[sourceIndex].mapValue = sourceItemIndex;
		console.log("new mapping: ", $scope.map);
	};

	$scope.$on("dragbag.drop", function(e, el, target, source) {
		var $target = $(target);
		if ($target.hasClass("source-bag")) {
			$scope.removeMapping($(source));
		} else if ($target.children().length > 1) {
			$target.children().each(function() {
				if ($(this).html() !== $(el).html()) {
					$(source).append($(this));
				}
			});
			$scope.swapMapping(
				$target,
				$(source),
				$(el),
				$(source).find(".source-item")
			);
		} else {
			$scope.addMapping($(source), $target, $(el));
		}
		$scope.$emit("drag-drop-mapping-update", $scope.map);
	});
}
