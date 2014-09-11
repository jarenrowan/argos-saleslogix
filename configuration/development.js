/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */
define('configuration/development', ['Mobile/SalesLogix/ApplicationModule'], function(ApplicationModule) {

    return {
        modules: [
            new ApplicationModule()
        ],
        connections: {
            'crm': {
                isDefault: true,
                offline: true,
                url: 'http://10.42.3.161/sdata/slx/dynamic/-/',
                json: true
            }
        },
        enableUpdateNotification: true,
        multiCurrency: false,
        enableGroups: true,
        enableHashTags: true,
        maxUploadFileSize: 40000000,
        enableConcurrencyCheck: false
    };

});
