/**
 * Created by chengm1 on 6/22/15.
 */

'use strict';

var url = "data/test_data_acc_tcga.json";

$.getJSON(url, function(json) {
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
  //      default value is true
  //  scroller - column scroller option; type of boolean; default value is false
  //  fixed - fixed columns; type of array; elements can be number or string; default value is []

  json.attributes.push({
    attr_id: 'sample',
    datatype: 'STRING',
    display_name: 'SAMPLE ID',
    fixed: true
  });

  //_.each(json.attributes, function(item) {
  //  item.column_width = 100;
  //});

  var testElement = React.createElement(EnhancedFixedDataTable, {
    input: json, 
    filter: "ALL", 
    download: "ALL", 
    downloadFileName: "data.txt", 
    showHide: true, 
    hideFilter: true, 
    scroller: true, 
    resultInfo: true, 
    groupHeader: true, 
    fixedChoose: true, 
    uniqueId: "sample", 
    rowHeight: 30, 
    tableWidth: 1150, 
    maxHeight: 500, 
    headerHeight: 30, 
    groupHeaderHeight: 40, 
    autoColumnWidth: true, 
    columnMaxWidth: 300, 
    columnSorting: false, 
    isResizable: true}
  );

  ReactDOM.render(testElement, document.getElementById('table'));
});
