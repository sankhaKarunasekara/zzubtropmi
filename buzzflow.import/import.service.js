angular.module("buzzflow.import").service("importService", importService);

importService.$inject = ["$q", "$http", "workflowData"];

function importService($q, $http, workflowData) {
	var importService = {
		getWorkflowData: getWorkflowData,
		get: get
		// add: add,
		// update: update,
		// remove: remove
	};

	return importService;

	function getWorkflowData() {
		//isNot workflow fields
		//fields with workflow Id
		var workData = workflowData;
		return workData;
	}

	async function get(url_data_id) {
		// Simple GET request example:
		const response = await $http({
			method: "GET",
			url: "https://1-dot-aryaz-1.appspot.com/urldata/get",
			params: {
				url_data_id: url_data_id
			}
		});
		return response;
	}

	async function add(url_data_Obj) {
		//user_email, url, extract_method,label
		// Simple GET request example:
		//TODO: validata object
		//TODO: adding headers
		//TODO: use back tics for url
		const response = await $http({
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data"
			},
			data: url_data_Obj,
			url: "https://1-dot-aryaz-1.appspot.com/urldata/add"
		});
		return response;
	}

	function genearteRequest(instanceId, fileName, fileId, email, csvHeaderList) {
		csvHeaderList;
	}

	// {
	// 	"instanceId":"instanceId",
	// 	"fileName":"fileName",
	// 	"fileId":"fileId",
	// 	"email":"email",
	// 	"workflowMapping":{
	// 	   "Activity":"<activity_workflowId>",
	// 	   "People":"<people_workflowId>",
	// 	   "Companies":"<companies_workflowId>",
	// 	   "Opportunity":"<opportunities_workflowId>"
	// 	},
	// 	"mapping":{
	// 	   "csv_column_index(0)":{
	// 		 "fieldId":"field_id",
	// 		 "fieldType":"fieldType",
	// 		 "workflow":"<opportunity_workflowId>"
	// 	   },
	// 	   "csv_column_index(2)":{
	// 		 "fieldId":"field_id",
	// 		 "fieldType":"fieldType",
	// 		 "workflow":"<opportunity_workflowId>"
	// 	   },
	// 	   "csv_column_index(3)":{
	// 		 "fieldId":"field_id",
	// 		 "fieldType":"fieldType",
	// 		 "workflow":"<contact_workflowId>"
	// 	   },
	// 	   "csv_column_index(6)":{
	// 		 "fieldId":"field_id",
	// 		 "fieldType":"fieldType",
	// 		 "workflow":"<contact_workflowId>"
	// 	   },
	// 	   "csv_column_index(7)":{
	// 		 "fieldId":"field_id",
	// 		 "fieldType":"fieldType",
	// 		 "workflow":"<activity_workflowId>"
	// 	   }
	// 	}
	//   }
}
