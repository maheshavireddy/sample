sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'listapp/test/integration/FirstJourney',
		'listapp/test/integration/pages/vJunctionList',
		'listapp/test/integration/pages/vJunctionObjectPage'
    ],
    function(JourneyRunner, opaJourney, vJunctionList, vJunctionObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('listapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThevJunctionList: vJunctionList,
					onThevJunctionObjectPage: vJunctionObjectPage
                }
            },
            opaJourney.run
        );
    }
);