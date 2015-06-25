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
var testElement = <EnhancedFixedDataTable input={input} filter="NONE" getData="NONE"
  hider={false} hideFilter={true} scroller={false} fixed={[]}/>;
React.render(testElement, document.body);
```

## Configuration
**input** (required) <br />
  Table column info and content input. <br />
  type: object <br />
**filter** <br />
  Show/hide global filter or column-wise fitlers. <br />
  type: enum("NONE"|"ALL"|"GLOBAL"|"COLUMN_WISE") defaultValue: "NONE" <br />
**getData** <br />
  Show/hide Download or Copy button. <br />
  type: enum("NONE"|"ALL"|"DOWNLOAD"|"COPY") defaultValue: "NONE" <br />
**hider** <br />
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
The input data is an object with two attributes.
First attribute is an array called "attributes", and each element represents a column.
