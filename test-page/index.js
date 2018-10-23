d3.csv(
    'https://rawgit.com/RhoInc/viz-library/master/data/safetyData/ADAE.csv',
    function(d) {
        return d;
    },
    function(error,data) {
        if (error)
            console.log(error);

        var settings = {};
        var instance = aeTimelines(
            '#container',
            settings
        );
        instance.init(data);
    }
);
