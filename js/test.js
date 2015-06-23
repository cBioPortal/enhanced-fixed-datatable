/**
 * Created by chengm1 on 6/22/15.
 */

var url = "data/test_data.json";

$.getJSON(url, function (json) {
    React.render(<EnhancedFixedDataTable json={json}/>, document.body);
});