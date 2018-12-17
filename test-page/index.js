d3.csv(
    'https://raw.githubusercontent.com/RhoInc/viz-library/master/data/safetyData/ADAE.csv',
    function(d,i) {
        if (!(i%5))
            d.AESEV = '';
        if (!(i%7))
            d.AESEV = 'asdf';
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
