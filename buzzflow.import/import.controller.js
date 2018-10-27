angular
	.module("buzzflow.import")
	.controller("importController", importController);

importController.$inject = ["$scope", "importService", "dragulaService"];

function importController($scope, importService, dragulaService) {
	$scope.filteredfieldsList = [];

	$scope.mapComplete = false;
	$scope.headerList = [];
	$scope.csvHeaderList = [];
	$scope.workflowId = "";

	dragulaService.options($scope, "dragbag", {
		revertOnSpill: true,
		accepts: function(el, target, source, sibling) {
			return true;
		}
	});

	$scope.searchText = {};
	$scope.$on("drag-drop-mapping-update", function(eventName, args) {
		$scope.$apply();

		var targetContainer = $(args.target);
		targetContainer
			.children()
			.eq(1)
			.remove();
		console.table(targetContainer);
	});

	var vm = this;
	//Model
	vm.currentStep = 1;
	vm.steps = [
		{
			step: 1,
			name: "upload"
		},
		{
			step: 2,
			name: "mapping"
		},
		{
			step: 3,
			name: "finishing"
		},
		{
			step: 4,
			name: "complete"
		}
	];

	//Functions
	vm.gotoStep = function(newStep) {
		vm.currentStep = newStep;
	};

	vm.save = function() {
		alert(
			"Saving form... \n\n" +
				"Name: " +
				vm.user.name +
				"\n" +
				"Email: " +
				vm.user.email +
				"\n" +
				"Age: " +
				vm.user.age
		);
	};

	$scope.uploadState = "before";
	$scope.dataFile = null;

	$scope.workflowData = importService.getWorkflowData();

	$scope.csvHeaderFields = [];
	$scope.csvInitialMapping = [];
	$scope.notWorkflows = [];
	$scope.workflowMapping = [];

	$scope.loadWorkflowFieldItems = function() {
		const workflowId = $scope.workflowId;

		const notWorkflows = Object.values($scope.workflowData).filter(
			workflow => workflow.workflow.isAWorkflow == false
		);

		let workflowMapping = getWorkflowMapping(notWorkflows, workflowId);
		$scope.workflowMapping = workflowMapping;

		$scope.dealFields = $scope.workflowData[workflowId].fields.map(field => ({
			id: field.id,
			name: field.name,
			type: field.type,
			module: "Deal",
			workflow: workflowMapping["Opportunity"],
			isVisible: field.isVisible
		}));

		$scope.activityFields = notWorkflows
			.filter(item => item.workflow.workflowName == "Activity")[0]
			.fields.map(field => ({
				id: field.id,
				name: field.name,
				type: field.type,
				module: "Activity",
				workflow: workflowMapping["Activity"],
				isVisible: field.isVisible
			}));

		$scope.peopleFields = notWorkflows
			.filter(item => item.workflow.workflowName == "People")[0]
			.fields.map(field => ({
				id: field.id,
				name: field.name,
				type: field.type,
				module: "People",
				workflow: workflowMapping["People"],
				isVisible: field.isVisible
			}));

		$scope.companyFields = notWorkflows
			.filter(item => item.workflow.workflowName == "Companies")[0]
			.fields.map(field => ({
				id: field.id,
				name: field.name,
				type: field.type,
				module: "Company",
				workflow: workflowMapping["Company"],
				isVisible: field.isVisible
			}));
	};

	$scope.startMapping = async function(files) {
		//TODO: manoj ayya's sending file to backend
		$scope.fileName = files[0].name;
		$scope.$apply(function() {
			$scope.uploadState = "processing";
		});
		await new Promise(resolve => setTimeout(resolve, 1000));

		Papa.parse(files[0], {
			// worker: true,
			// header: true,
			dynamicTyping: true,
			// step: function(row) {
			// 	console.log("Count: ", count, row.data);
			// 	count++;
			// },
			complete: function(results) {
				$scope.$apply(function() {
					$scope.uploadState = "success";
					$scope.csvHeaderFields = validateCSVData(results.data);

					if ($scope.csvHeaderFields.length == 0) {
						//TODO: something wrong with file
					} else {
						$scope.csvHeaderList = $scope.csvHeaderFields.map(
							(item, index) => ({
								id: index,
								text: item,
								mapValue: autoMapping(
									item,
									$scope.dealFields,
									$scope.peopleFields,
									$scope.companyFields,
									$scope.activityFields
								),
								required: false
							})
						);

						//removing automapped fields
						var autoMappedDealFields = $scope.csvHeaderList
							.filter(
								item => item.mapValue != null && item.mapValue.module == "Deal"
							)
							.map(item => item.mapValue.id);

						var autoMappedPeopleFields = $scope.csvHeaderList
							.filter(
								item =>
									item.mapValue != null && item.mapValue.module == "People"
							)
							.map(item => item.mapValue.id);

						var autoMappedCompanyFields = $scope.csvHeaderList
							.filter(
								item =>
									item.mapValue != null && item.mapValue.module == "Company"
							)
							.map(item => item.mapValue.id);

						var autoMappedActivityFields = $scope.csvHeaderList
							.filter(
								item =>
									item.mapValue != null && item.mapValue.module == "Activity"
							)
							.map(item => item.mapValue.id);

						$scope.dealFields = $scope.dealFields.filter(
							field => !autoMappedDealFields.includes(field.id)
						);

						$scope.peopleFields = $scope.peopleFields.filter(
							field => !autoMappedPeopleFields.includes(field.id)
						);

						$scope.companyFields = $scope.companyFields.filter(
							field => !autoMappedCompanyFields.includes(field.id)
						);

						$scope.activityFields = $scope.activityFields.filter(
							field => !autoMappedActivityFields.includes(field.id)
						);
					}
				});
			}
		});
		//TODO: handle the case when file is excel
	};

	$scope.addMapping = function($dropSource, $target, $source) {
		if ($dropSource.hasClass("drop-zone")) {
			$scope.updateMapping($dropSource, $target, $source);
			return;
		}
		// //console.log('add mapping');
		// var targetIndex = $target.attr("data-index");
		// var sourceIndex = $source.attr("data-index");
		// $scope.csvHeaderList[targetIndex].mapValue = sourceIndex.toString();
		// localStorage.setItem("importMapping", JSON.stringify($scope.csvHeaderList));
		//console.log('new mapping: ', $scope.csvHeaderList);
	};

	$scope.updateMapping = function($dropSource, $target, $source) {
		// //console.log('update mapping');
		var dropSourceIndex = $dropSource.attr("data-index");

		var targetIndex = $target.attr("data-index");
		var sourceIndex = $source.attr("data-index");

		console.log("dropSourceIndex", dropSourceIndex);
		console.log("targetIndex", targetIndex);
		console.log("sourceIndex", sourceIndex);

		// $scope.csvHeaderList[targetIndex].mapValue = $scope.dealFields.filter(
		// 	item => item.id == sourceIndex
		// )[0];

		//$scope.$apply();
		// $scope.csvHeaderList[targetIndex].mapValue = sourceIndex;
		// $scope.csvHeaderList[dropSourceIndex].mapValue = null;
		// localStorage.setItem("importMapping", JSON.stringify($scope.csvHeaderList));
		//console.log('new mapping: ', $scope.csvHeaderList);
	};

	$scope.removeMapping = function($source) {
		// //console.log('remove mapping');
		// var sourceIndex = $source.attr("data-index");
		// $scope.csvHeaderList[sourceIndex].mapValue = null;
		// localStorage.setItem("importMapping", JSON.stringify($scope.csvHeaderList));
		//console.log('new mapping: ', $scope.csvHeaderList);
	};

	$scope.swapMapping = function($target, $source, $existing, $sourceItem) {
		// //console.log('swap mapping');
		// var targetIndex = $target.attr("data-index");
		// var sourceIndex = $source.attr("data-index");
		// var existingIndex = $existing.attr("data-index");
		// var sourceItemIndex = $sourceItem.attr("data-index");
		// $scope.csvHeaderList[targetIndex].mapValue = existingIndex;
		// $scope.csvHeaderList[sourceIndex].mapValue = sourceItemIndex;
		// localStorage.setItem("importMapping", JSON.stringify($scope.csvHeaderList));
		//console.log('new mapping: ', $scope.csvHeaderList);
	};

	$scope.$on("dragbag.drop", function(e, el, target, source) {
		var $target = $(target);
		var $element = $(e);
		var $el = $(el);
		var $source = $(source);

		var elementIndex = $el.attr("data-index");
		var fieldModule = $el.attr("data-module");

		var targetIndex = $target.attr("data-index");
		//var targetModule = $target.attr("data-module");

		console.log("targetIndex", targetIndex);
		//console.log("sourceIndex", sourceIndex);

		switch (fieldModule) {
			case "Deal":
				$scope.csvHeaderList[targetIndex].mapValue = $scope.dealFields.filter(
					item => item.id == elementIndex
				)[0];

				break;
			case "People":
				$scope.csvHeaderList[targetIndex].mapValue = $scope.peopleFields.filter(
					item => item.id == elementIndex
				)[0];
				break;
			case "Company":
				$scope.csvHeaderList[
					targetIndex
				].mapValue = $scope.companyFields.filter(
					item => item.id == elementIndex
				)[0];
				break;
			case "activity":
				$scope.csvHeaderList[
					targetIndex
				].mapValue = $scope.activityFields.filter(
					item => item.id == elementIndex
				)[0];
				break;
			default:
		}
		console.log($scope.csvHeaderList);

		$scope.$emit("drag-drop-mapping-update", { target: target });
	});

	var mappedFields = $scope.csvHeaderList.reduce(function(
		tempMap,
		field,
		index
	) {
		if (field.mapValue != null) {
			tempMap[index] = {
				fieldId: field.mapValue.id,
				fieldType: field.mapValue.type,
				workflow: field.mapValue.workflow
			};
		}
		return tempMap;
	},
	{});
}
