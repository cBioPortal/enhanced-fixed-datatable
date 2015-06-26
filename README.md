# Enhanced Fixed Datatable
The Enhanced Fixed Datatable is an alternative to data tables such as DataTables. It is based on FixedDataTable, and combined with some useful features for cBioPortal team.

## Dependencies
  -React <br />
  -jQuery <br />
  -Underscore.js <br />
  -FixedDataTable <br />
  -qTip2 <br />
  -Chosen <br />
  -React-chosen <br />
  -ZeroClipboard <br />
  -Bootstrap <br />
  -Bootstrap Dropdown-checkbox <br />
  -jQuery UI <br />
  -Font Awesome

## Usage
```javascript
var testElement = <EnhancedFixedDataTable input={input} filter="NONE" download="NONE"
  showHide={false} hideFilter={true} scroller={false} fixed={[]}/>;
React.render(testElement, document.body);
```

## Configuration
**input** (required) <br />
  Table column info and content input. <br />
  type: object <br />
**filter** <br />
  Show/hide global filter or column-wise fitlers. <br />
  type: enum("NONE"|"ALL"|"GLOBAL"|"COLUMN_WISE") defaultValue: "NONE" <br />
**download** <br />
  Show/hide Download or Copy button. <br />
  type: enum("NONE"|"ALL"|"DOWNLOAD"|"COPY") defaultValue: "NONE" <br />
**showHide** <br />
  Show/hide the dropdown-checklist used to show/hide columns. <br />
  type: boolean defaultValue: false <br />
**hideFilter** <br />
  Whether to disable a filter when its related column is hidden. <br />
  type: boolean defaultValue: true <br />
**scroller** <br />
  Show/hide the dropdown column scroller. <br />
  type: boolean defaultValue: false <br />
**fixed** <br />
  Set fixed columns.  <br />
  type: array(elements can be number or string) defaultValue is []

## Input Data Format
The input data is an object with two attributes: "attributes" contains column info, and "data" contains table content. <br />
The first attribute "attributes" is an array of object. Each element represents a column, and it has 3 attributes: attr_id, display_name and datatype. attr_id is the ID of a column. display_name is the name of a column displayed in the table header. datatype can be "STRING" or "NUMBER", which determines what kind of filter is used for a column. A column with attr_id "id" is required as the ID of a row. <br />
The second attribute "data" is also an array of object. Each element represents a cell, and it has 3 attributes: attr_id, id and attr_val. id represents which row the cell belongs to, and attr_id is the column id of the cell. attr_val is the cell content.
