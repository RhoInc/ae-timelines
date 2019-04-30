d3.csv(
    'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/adam/adae.csv',
    function(d,i) {
        return d;
    },
    function(data) {
        var instance = aeTimelines(
            '#container', // element
            {
            } // settings
        );
        instance.init(data);
    }
);
