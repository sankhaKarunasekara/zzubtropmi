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
		moves: function(el, source, handle, sibling) {
			return true; // elements are always draggable by default
		},
		accepts: function(el, target, source, sibling) {
			//TODO: source do not accept the element from the csv
			return true; // elements can be dropped in any of the `containers` by default
		},
		invalid: function(el, handle) {
			return false; // don't prevent any drags from initiating by default
		}
	});

	$scope.searchText = {};
	$scope.$on("drag-drop-mapping-update", function(eventName, args) {
		$scope.$apply();
		//TODO: implement what happends when remove,
		//TODO: user was able to remove mapped field
		var targetContainer = $(args.target);
		targetContainer
			.children()
			.eq(1)
			.remove();
		// console.table(targetContainer);
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
		if (vm.currentStep == 3) step3();
	};

	function step3() {
		$scope.sampleDataList = createSampleData(
			$scope.csvHeaderList,
			$scope.sampleData
		);

		if ($scope.sampleDataList["Deal"].length > 0) {
			$scope.dealColumnKeys = Object.keys($scope.sampleDataList["Deal"][0]);
		}
		if ($scope.sampleDataList["People"].length > 0) {
			$scope.peopleColumnKeys = Object.keys($scope.sampleDataList["People"][0]);
		}
		if ($scope.sampleDataList["Company"].length > 0) {
			$scope.companyColumnKeys = Object.keys(
				$scope.sampleDataList["Company"][0]
			);
		}
		if ($scope.sampleDataList["Activity"].length > 0) {
			$scope.activityColumnKeys = Object.keys(
				$scope.sampleDataList["Activity"][0]
			);
		}

		console.log("$scope.dealColumnKeys", $scope.sampleDealsList);
		console.log("dealColumnKeys", $scope.dealColumnKeys);

		// console.table($scope.sampleDataList["Deal"]);

		$scope.nutritionList = [
			{
				id: 601,
				name: "Frozen joghurt",
				calories: 159,
				fat: 6.0,
				carbs: 24,
				protein: 4.0,
				sodium: 87,
				calcium: "14%",
				iron: "1%"
			},
			{
				id: 602,
				name: "Ice cream sandwitch",
				calories: 237,
				fat: 9.0,
				carbs: 37,
				protein: 4.3,
				sodium: 129,
				calcium: "84%",
				iron: "1%"
			},
			{
				id: 603,
				name: "Eclair",
				calories: 262,
				fat: 16.0,
				carbs: 24,
				protein: 6.0,
				sodium: 337,
				calcium: "6%",
				iron: "7%"
			},
			{
				id: 604,
				name: "Cupkake",
				calories: 305,
				fat: 3.7,
				carbs: 67,
				protein: 4.3,
				sodium: 413,
				calcium: "3%",
				iron: "8%"
			},
			{
				id: 605,
				name: "Gingerbread",
				calories: 356,
				fat: 16.0,
				carbs: 49,
				protein: 2.9,
				sodium: 327,
				calcium: "7%",
				iron: "16%"
			},
			{
				id: 606,
				name: "Jelly bean",
				calories: 375,
				fat: 0.0,
				carbs: 94,
				protein: 0.0,
				sodium: 50,
				calcium: "0%",
				iron: "0%"
			},
			{
				id: 607,
				name: "Lollipop",
				calories: 392,
				fat: 0.2,
				carbs: 98,
				protein: 0,
				sodium: 38,
				calcium: "0%",
				iron: "2%"
			},
			{
				id: 608,
				name: "Honeycomb",
				calories: 408,
				fat: 3.2,
				carbs: 87,
				protein: 6.5,
				sodium: 562,
				calcium: "0%",
				iron: "45%"
			},
			{
				id: 609,
				name: "Donut",
				calories: 452,
				fat: 25.0,
				carbs: 51,
				protein: 4.9,
				sodium: 326,
				calcium: "2%",
				iron: "22%"
			},
			{
				id: 610,
				name: "KitKat",
				calories: 518,
				fat: 26.0,
				carbs: 65,
				protein: 7,
				sodium: 54,
				calcium: "12%",
				iron: "6%"
			}
		];
		console.table($scope.nutritionList);
		genearteRequest(
			"malinator_2",
			"myFile.csv",
			"fileId1213",
			$scope.workflowMapping,
			$scope.csvHeaderList
		);
	}
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
			preview: 10,
			dynamicTyping: true,
			// step: function(row) {
			// 	console.log("Count: ", count, row.data);
			// 	count++;
			// },
			complete: function(results) {
				$scope.$apply(function() {
					console.log(results);
					$scope.uploadState = "success";
					$scope.csvHeaderFields = validateCSVData(results.data);

					//shift remove the first row
					let dataRows = results.data;
					$scope.sampleData = dataRows.slice(1);

					// $scope.sampleData = results.data;

					if ($scope.csvHeaderFields.length == 0) {
						//TODO: something wrong with file
					} else if ($scope.workflowId == "") {
						console.warn("please select a pipeline");
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

		// console.log("dropSourceIndex", dropSourceIndex);
		// console.log("targetIndex", targetIndex);
		// console.log("sourceIndex", sourceIndex);

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

		$scope.$emit("drag-drop-mapping-update", { target: target });
	});
}
