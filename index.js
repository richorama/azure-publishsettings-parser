var fs = require('fs');
var util = require('util');
var xml2js = require('xml2js');
var pfx2pem = require('./pkcs').pfx2pem;
var url = require('url');

module.exports.loadFromFile = loadFromFile;
module.exports.loadFromString = loadFromString;
module.exports.createServiceManagementService = createServiceManagementService;



function loadFromFile(filename, cb){
	fs.readFile(filename, function(err, data){
		if (err) {
			if (cb) cb(err,[]);
			return;
		}
		loadFromString(data.toString(), cb);
	});
}

function loadFromString(xmlString, cb){
	if (!cb) return;
	if (!xmlString){
		cb("no xml", []);
		return;
	}

	xml2js.parseString(xmlString, function(err, json){
		if (err){
			cb(err,[]);
			return;
		}
		if (!json || !json.PublishData){
			cb(null, []);
			return;
		}
		cb(null, parseJson(json));
	});
}

function parseJson(json){
	var results = [];
	json.PublishData.PublishProfile.forEach(function(x){
		x.Subscription.forEach(function(y){
			results.push(y.$)
		});
	});
	return results;
}

function createServiceManagementService(azure, publishProfile){
	if (!azure || !azure.createServiceManagementService) throw new Error("azure parameter not supplied")
	if (!publishProfile || !publishProfile.ManagementCertificate) throw new Error("publish profile parameter not supplied")

	var pem = pfx2pem(new Buffer(publishProfile.ManagementCertificate, 'base64'));
	var sms = azure.createServiceManagementService(publishProfile.Id,{keyvalue: pem,certvalue:pem}, {host: url.parse(publishProfile.ServiceManagementUrl).host});
	return sms;
}
