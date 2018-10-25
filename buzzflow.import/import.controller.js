angular
	.module("buzzflow.import")
	.controller("importController", importController);

importController.$inject = ["$scope", "importService", "dragularService"];

function importController($scope, importService, dragularService) {
	// dragulaService.options($scope, "dragbag", {
	// 	copy: true,
	// 	revertOnSpill: true,
	// 	invalid: function(el, target) {
	// 		//TODO: return false based on module
	// 		return $(el).hasClass("placeholder") ? true : false;
	// 	}
	// });

	$scope.filteredfieldsList = [];

	$scope.mapComplete = false;
	$scope.searchText = {};

	$scope.headerList = [];
	$scope.csvHeaderList = [];

	$scope.$on("drag-drop-mapping-update", function(eventName, map) {
		console.log("New mapping: ", map);
		// determine if all required fields have been mapped
		var isComplete = true;
		for (var i = 0; i < map.length; i++) {
			if (map[i].mapValue === null && map[i].required === true) {
				isComplete = false;
			}
		}
		$scope.mapComplete = isComplete;
		$scope.$apply();
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
	var workflowData = importService.getWorkflowData();
	$scope.workflowData = workflowData;

	var workflowId = "14";
	$scope.csvHeaderFields = [];
	$scope.csvInitialMapping = [];

	var notWorkflows = Object.values(workflowData).filter(
		workflow => workflow.workflow.isAWorkflow == false
	);

	$scope.dealFields = workflowData[workflowId].fields.map(field => ({
		id: field.id,
		name: field.name,
		type: field.type,
		module: "Deal",
		isVisible: field.isVisible
	}));

	$scope.activityFields = notWorkflows
		.filter(item => item.workflow.workflowName == "Activity")[0]
		.fields.map(field => ({
			id: field.id,
			name: field.name,
			type: field.type,
			module: "Activity",
			isVisible: field.isVisible
		}));

	$scope.peopleFields = notWorkflows
		.filter(item => item.workflow.workflowName == "People")[0]
		.fields.map(field => ({
			id: field.id,
			name: field.name,
			type: field.type,
			module: "People",
			isVisible: field.isVisible
		}));

	$scope.companyFields = notWorkflows
		.filter(item => item.workflow.workflowName == "Companies")[0]
		.fields.map(field => ({
			id: field.id,
			name: field.name,
			type: field.type,
			module: "Company",
			isVisible: field.isVisible
		}));

	$scope.fieldsList = [
		...$scope.dealFields,
		...$scope.peopleFields,
		...$scope.companyFields,
		...$scope.activityFields
	];

	console.table($scope.fieldsList);
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
								mapValue: null,
								required: false
							})
						);
					}
				});
			}
		});
		//TODO: handle the case when file is excel
	};

	function validateCSVData(csvRows) {
		//whether containing null values in header
		var header = csvRows[0];
		var isContainNullValues = header.some(item => item == null);

		if (isContainNullValues) return [];

		//missing header fields
		var headerLength = header.length;
		var maxLength = csvRows.reduce((maxLength, row) => {
			row.length > maxLength ? row.length : maxLength;
		});

		if (headerLength < maxLength) return [];

		return header;
	}
}
