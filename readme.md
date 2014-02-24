# azure-publishsettings.parser

A node.js utility to parse the Windows Azure publishsettings file, and create `ServiceManagementService` objects to work with the Azure Service Management API.

A publishsettings file contains the information, including the certificates, required to connect to the Windows Azure Service Management API.

Your file can be downloaded from here: http://go.microsoft.com/fwlink/?LinkId=254432

## Installation

```
$ node install azure-publishsettings-parser
```

## Usage

```js
var parser = require('azure-publishsettings-parser');
parser.loadFromFile('my.publishsettings', function(err, subscriptions){

	// the parser will provide an array of subscriptions on a callback
	subscriptions.forEach(function(subscription){

		console.log(subscription.Name);
		console.log(subscription.Id);
		console.log(subscription.ManagementCertificate);

	});
});
```

You can also parse the settings file from a string:

```js
parser.loadFromString("<xml...>", function(err, subscriptions){
	...
});
```
When you have found the subscription you want (often there it only one!) you can create an instance of Windows Azure Service Management Service, as described here: 

http://www.windowsazure.com/en-us/documentation/articles/virtual-machines-linux-how-to-service-api/

```js
var azure = require('azure');
var sms = parser.createServiceManagementService(azure, subscription);
sms.listStorageAccounts(function(err,data){
	console.log(data.body);
});
```

## Thanks

Thanks to the Microsoft Azure team for the `pfx2pem` function!

## License 

MIT