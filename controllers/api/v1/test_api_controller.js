// -------------------------------------------------------------------------
//Content-Type: application/json --> Sends JSON data
//POSTMAN --> raw: JSON
/*  
    1. Capture the form data using FormData API formData= new FormData(form)
    2. Convert it into JSON using JSON.stringify(Object.fromEntries(formData))
    3. Send this stringified json as ajax payload 
*/
// -------------------------------------------------------------------------
//Content-Type: application/x-www-form-urlencoded --> Sends Form data
//POSTMAN --> x-www-form-urlencoded
/*
    Use req.body coming from the form
*/
// -------------------------------------------------------------------------
//Content-Type: multipart/form-data --> Sends Multipart Form data
//POSTMAN --> form-data
/*
    1. Capture the form data using FormData API formData= new FormData(form)
    2. Convert it into JSON using JSON.stringify(Object.fromEntries(formData))
    3. Send this stringified json as ajax payload 
*/
// -------------------------------------------------------------------------

module.exports.welcome = (req, res) => {
	console.log("Welcome to The Spotify Clone App ~ API Testing.");
	return res.status(200).json({
		message: "Welcome to The Spotify Clone App ~ API Testing.",
		request: {
			req_ContentType: req.headers["content-type"],
			req_Accept: req.headers["accept"],
			req_Method: req.method,
		},
		response: {
			res_ContentType: res.get("content-type"),
			res_Accept: res.get("accept"),
			res_StatusCode: res.statusCode,
		},
	});
};

module.exports.queryParams = (req, res) => {
	console.log(req.query);
	return res.status(200).json({
		query: req.query,
		request: {
			req_ContentType: req.headers["content-type"],
			req_Accept: req.headers["accept"],
			req_Method: req.method,
		},
		response: {
			res_ContentType: res.get("content-type"),
			res_Accept: res.get("accept"),
			res_StatusCode: res.statusCode,
		},
	});
};

module.exports.headers = (req, res) => {
	console.log(req.headers.name);
	return res.status(200).json({
		Sent_Header: req.headers.name,
		request: {
			req_ContentType: req.headers["content-type"],
			req_Accept: req.headers["accept"],
			req_Method: req.method,
		},
		response: {
			res_ContentType: res.get("content-type"),
			res_Accept: res.get("accept"),
			res_StatusCode: res.statusCode,
		},
	});
};

module.exports.body = (req, res) => {
	console.log(req.body);
	return res.status(200).json({
		body: req.body,
		request: {
			req_ContentType: req.headers["content-type"],
			req_Accept: req.headers["accept"],
			req_Method: req.method,
		},
		response: {
			res_ContentType: res.get("content-type"),
			res_Accept: res.get("accept"),
			res_StatusCode: res.statusCode,
		},
	});
};

module.exports.params = (req, res) => {
	console.log(req.params);
	return res.status(200).json({
		params: req.params,
		request: {
			req_ContentType: req.headers["content-type"],
			req_Accept: req.headers["accept"],
			req_Method: req.method,
		},
		response: {
			res_ContentType: res.get("content-type"),
			res_Accept: res.get("accept"),
			res_StatusCode: res.statusCode,
		},
	});
};
