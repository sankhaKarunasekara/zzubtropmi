/**
	checking whether containing null values in header
*/
function validateCSVData(csvRows) {
	//TODO: Identical header check
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

/*
	Mapping Objects for requests
*/
function getWorkflowMapping(notWorkflows, workflowId) {
	let workflowMapping = notWorkflows.reduce(
		(tempMap, workflow) => (
			(tempMap[workflow.workflow.workflowName] = workflow.workflow.id), tempMap
		),
		{}
	);
	//add deal workflow
	workflowMapping["Opportunity"] = workflowId;
	return workflowMapping;
}

/* this function will automatically map csv fields to 
	buzzflow fields based on field name*/
function autoMapping(
	csvFieldName,
	dealFields,
	peopleFields,
	companyFields,
	activityFields
) {
	//TODO: validate only one "-" in the csvFieldName
	//TODO: identical fields check, weather there will be fields with same name
	const isCatagoryIncluded = csvFieldName.includes("-");
	var matchingFields;
	let fieldCatagory, fieldName;

	if (isCatagoryIncluded) {
		[fieldCatagory, fieldName] = csvFieldName
			.split("-")
			.map(item => item.trim().toLowerCase());
	} else {
		fieldCatagory = "deal";
		fieldName = csvFieldName.trim().toLowerCase();
	}

	switch (fieldCatagory) {
		case "deal":
			matchingFields = dealFields.filter(
				field => field.name.trim().toLowerCase() == fieldName
			);
			break;
		case "person":
		case "people":
			matchingFields = peopleFields.filter(
				field => field.name.toLowerCase() == fieldName
			);

			break;
		case "organization":
		case "company":
			matchingFields = companyFields.filter(
				field => field.name.toLowerCase() == fieldName
			);
			break;
		case "task":
		case "activity":
			matchingFields = activityFields.filter(
				field => field.name.toLowerCase() == fieldName
			);
			break;
		default:
			matchingFields = [];
	}

	if (matchingFields.length > 0) {
		return matchingFields[0];
	} else {
		return null;
	}
}

function createSampleData(csvHeaderList, sampleData) {
	const headerMap = csvHeaderList.reduce(function(tempMap, field, index) {
		if (field.mapValue != null) {
			tempMap[index] = {
				fieldId: field.mapValue.id,
				name: field.mapValue.name,
				fieldType: field.mapValue.type,
				module: field.mapValue.module,
				workflow: field.mapValue.workflow
			};
		}
		return tempMap;
	}, {});

	const headerMapKeys = Object.keys(headerMap).map(key => Number(key));

	let sampleBase = {
		Deal: [],
		People: [],
		Company: [],
		Activity: []
	};

	let sampleDataMap = sampleData.reduce(function(tempMap, dataRow, rowNumber) {
		//check csv field is mapped or not
		var baseObj = {
			Deal: {},
			People: {},
			Company: {},
			Activity: {}
		};

		const rowData = dataRow.reduce(function(tempProp, item, index) {
			if (headerMapKeys.indexOf(index) > -1) {
				const fieldMap = headerMap[index];
				const fieldName = fieldMap.name;
				const module = fieldMap.module;
				tempProp[module][fieldName] = item;
			}
			return tempProp;
		}, baseObj);

		// tempMap["Deal"] = [...tempMap["Deal"], rowData["Deal"]];

		tempMap["Deal"].push({ rowNumber: rowNumber, ...rowData["Deal"] });
		tempMap["People"].push({ rowNumber: rowNumber, ...rowData["People"] });
		tempMap["Company"].push({ rowNumber: rowNumber, ...rowData["Company"] });
		tempMap["Activity"].push({ rowNumber: rowNumber, ...rowData["Activity"] });

		return tempMap;
	}, sampleBase);

	console.log("sampleData", sampleDataMap);
	return sampleDataMap;
}

function genearteRequest(
	instanceId,
	fileName,
	fileId,
	workflowMapping,
	csvHeaderList
) {
	let requestJson = {
		instanceId: instanceId,
		fileName: fileName,
		fileId: fileId,
		email: undefined,
		workflowMapping: workflowMapping
	};

	let mappedFields = csvHeaderList.reduce(function(tempMap, field, index) {
		if (field.mapValue != null) {
			tempMap[index] = {
				fieldId: field.mapValue.id,
				fieldType: field.mapValue.type,
				workflow: field.mapValue.workflow
			};
		}
		return tempMap;
	}, {});

	requestJson["mapping"] = mappedFields;
	console.log(requestJson);
}
