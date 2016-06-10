/**
 * Created by chengm1 on 6/22/15.
 */

'use strict';

var url = "data/test_pie_label_cancer_detailed.json";

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

  //_.each(json.attributes, function(item) {
  //  item.column_width = 100;
  //});

  var testElement = React.createElement(EnhancedFixedDataTableSpecial, {
    input: json, 
    filter: "ALL", 
    download: "NONE", 
    downloadFileName: "data.txt", 
    showHide: false, 
    hideFilter: true, 
    scroller: true, 
    resultInfo: false, 
    groupHeader: false, 
    fixedChoose: false, 
    uniqueId: "id", 
    rowHeight: 25, 
    tableWidth: 375, 
    maxHeight: 290, 
    headerHeight: 26, 
    groupHeaderHeight: 40, 
    autoColumnWidth: false, 
    columnMaxWidth: 300, 
    columnSorting: false, 
    tableType: "pieLabel", //mutatedGene, cna, tableType
    //selectedRow={}
    //selectedGene={['GARS', 'ZFPM1']}
    rowClickFunc: true, 
    //geneClickFunc={true}
    pieLabelMouseEnterFunc: enter, 
    pieLabelMouseLeaveFunc: leave, 
    isResizable: false}
  );

  function enter(data) {
    console.log('Enter: ' + data);
  }

  function leave(data) {
    console.log('Leave: ' + data);
  }

  ReactDOM.render(testElement, document.getElementById('table'));
});
