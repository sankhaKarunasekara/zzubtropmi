angular.module("buzzflow.import").service("importService", importService);

importService.$inject = ["$q", "$http", "workflowData"];

function importService($q, $http, workflowData) {
	var importService = {
		getWorkflowData: getWorkflowData,
		get: get,
		add: add,
		update: update,
		remove: remove
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

	async function update(url_data_Obj) {
		// Simple GET request example:
		// url_data_id
		const response = await $http({
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			url: "https://1-dot-aryaz-1.appspot.com/urldata/update",
			data: url_data_Obj
		});
		return response;
	}

	async function remove(url_data_id) {
		// Simple GET request example:
		const response = await $http({
			method: "DELETE",
			url: "https://1-dot-aryaz-1.appspot.com/urldata/delete",
			params: {
				url_data_id: url_data_id
			}
		});
		return response;
	}
}
