/**
 * Created by chengm1 on 6/22/15.
 */

'use strict';

// var url = "data/test_pie_label_cancer_detailed.json";
var url = "data/test_mutated_genes_acc_tcga.json";
// var url = "data/test_cna_acc_tcga.json";

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
    // uniqueId="id"
    uniqueId: "uniqueId", 
    rowHeight: 25, 
    tableWidth: 375, 
    maxHeight: 290, 
    headerHeight: 26, 
    groupHeaderHeight: 40, 
    autoColumnWidth: false, 
    columnMaxWidth: 300, 
    columnSorting: false, 
    tableType: "mutatedGene", //mutatedGene, cna, tableType
    //selectedRows={}
    //selectedGene={['GARS', 'ZFPM1']}
    rowClickFunc: true, 
    //geneClickFunc={true}
    selectButtonClickCallback: submitButtonClickCallback, 
    pieLabelMouseEnterFunc: enter, 
    pieLabelMouseLeaveFunc: leave, 
    isResizable: false}
    // sortBy="name"
    // sortDir="ASC" //DESC, ASC
  );

  function enter(data) {
    console.log('Enter: ' + data);
  }

  function leave(data) {
    console.log('Leave: ' + data);
  }

  function submitButtonClickCallback() {
    console.log('Select button clicked.');
  }

  ReactDOM.render(testElement, document.getElementById('table'));
});
