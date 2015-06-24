/**
 * Created by chengm1 on 6/22/15.
 */

var url = "data/test_data.json";

$.getJSON(url, function (json) {
    // Configuration options:

    // Required:
    //  input - table content data; type of object

    // Optional:
    //  filter - filter option; type of string; value can be "NONE", "ALL", "GLOBAL", "COLUMN_WISE";
    //      default value is "NONE"
    //  getData - data grabbing option; type of string; value can be "NONE", "ALL", "DOWNLOAD", "COPY";
    //      default value is "NONE"
    //  hider - hide/show option; type of boolean; default value is false
    //  hideFilter - whether to disable a filter when its related column is hidden; type of boolean;
    //      default value is false
    //  scroller - column scroller option; type of boolean; default value is false
    //  fixed - fixed columns; type of array; elements can be number or string; default value is []

    //var testElement = <EnhancedFixedDataTable input={json} filter="ALL" getData="ALL" hider={true}
    //                                          hideFilter={false} scroller={true} fixed={["id", 2]}/>;
    var testElement = <EnhancedFixedDataTable input={json}/>;
    React.render(testElement, document.body);
});