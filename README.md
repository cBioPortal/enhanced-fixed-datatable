# Enhanced Fixed Datatable
The Enhanced Fixed Datatable is an alternative to data tables such as DataTables. It is based on FixedDataTable, and combined with some useful features for cBioPortal team. **Now we support JSX and ES2015 by using Babel**
This infrastructure is built with generator-gulp-webapp, really appreciate the powerful JS community.

## Build Assets
To run the build with gulp, do this inside the project folder:
```
npm install
bower install
gulp
```

## Gulp commands
```gulp``` Lint files and build into dist folder  
```gulp build``` Same as above  
```gulp serve``` Start a liveload server and serve files in app folder  
```gulp serve:dist``` Start a liveload server and serve files in dist folder  
```gulp serve:test``` Run tests on browser, powered by browserSync  
```gulp wiredep``` Insert bower dependencies into index.html  


## Usage
```javascript
var testElement = <EnhancedFixedDataTable input={input} filter="NONE" download="NONE"
  showHide={false} hideFilter={true} scroller={false} fixed={[]}/>;
React.render(testElement, document.body);
```

## Configuration
**input** (required)  
  Table column info and content input.  
  type: object  
**filter**  
  Show/hide global filter or column-wise fitlers.  
  type: enum("NONE"|"ALL"|"GLOBAL"|"COLUMN_WISE") defaultValue: "NONE"  
**download**  
  Show/hide Download or Copy button.  
  type: enum("NONE"|"ALL"|"DOWNLOAD"|"COPY") defaultValue: "NONE"  
**downloadFileName**  
  Downloadable file name  
  type: string defaultValue: "data.txt"  
**showHide**  
  Show/hide the dropdown-checklist used to show/hide columns.  
  type: boolean defaultValue: false  
**hideFilter**  
  Whether to disable a filter when its related column is hidden.  
  type: boolean defaultValue: true  
**scroller**  
  Show/hide the dropdown column scroller.  
  type: boolean defaultValue: false  
**fixed**  
  Set fixed columns.   
  type: array(elements can be number or string) defaultValue is []  
**fixedChoose**  
  Show/hide the dropdown-checklist used to choose which columns will be fixed as left columns.  
  type: boolean defaultValue: true  
**uniqueId**   
  This id is part of attributes. The id name will be used to group data into rows.  
  type: string defaultValue is 'id'  
**tableWidth**  
  Fixed-datatable width  
  type: number defaultValue:1230  
**rowHeight**  
  Fixed-datatable row height  
  type: number defaultValue:30  
**maxHeight**  
  Fixed-datatable maximum table height  
  type: number defaultValue:500  
**headerHeight**  
  Fixed-datatable table header height  
  type: number defaultValue:30  
**groupHeaderHeight**  
  Fixed-datatable grouped table header height  
  type: number defaultValue:50  

## Input Data Format
The input data is an object with two attributes
* attributes: Contains column info, array of object. Each element represents a column. It has three attributes.
  * attr_id: The column ID.
  * display_name: The column display name in the table header.
  * datatype: The column type(filter type). 'STRING', 'NUMBER' are supported at this moment
* data: Contains table content. It is the collection of objects. Each element represents a cell and it has tree attribtues:
  * attr_id: The column id of the cell
  * id(or whatever uniqueId you defined above)
  * attr_val: The cell content
  
## JSX/JS files
Babel will transfer JSX files into JS files. Any edits on JS files will not be stored back to JSX files. Please only edit JSX files if you need.
