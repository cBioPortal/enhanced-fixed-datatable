/**
 * Created by chengm1 on 5/22/15.
 */

$.getJSON('https://rawgit.com/cBioPortal/enhanced-fixed-datatable/master/standalone-example/data/webservice_main.json', function (json) {
    var Table = FixedDataTable.Table, Column = FixedDataTable.Column, ColumnGroup = FixedDataTable.ColumnGroup;
    var dupFlag = false, content, tableCols = [];

    var SortTypes = {
        ASC: 'ASC',
        DESC: 'DESC'
    };

    var CBioTable = React.createClass({
        stateObj: {},

        getInitialState: function () {
            var cols = [], rows = [], rowsDict = {}, attributes = json.attributes,
                data = json.data, col, cell, i, newObject, filters = {};

            // Duplicate attributes for column info
            if (dupFlag) {
                var attrCopy = [];
                for (i = 0; i < attributes.length; i++) {
                    newObject = jQuery.extend(true, {}, attributes[i]);
                    newObject.display_name += "_Copy";
                    newObject.attr_id += "_copy"
                    attrCopy.push(newObject);
                }
                attributes = attributes.concat(attrCopy);

                for (i = 0; i < attributes.length; i++) {
                    newObject = jQuery.extend(true, {}, attributes[i]);
                    newObject.display_name += "_Copy_1";
                    newObject.attr_id += "_copy_1"
                    attrCopy.push(newObject);
                }
                attributes = attributes.concat(attrCopy);
            }

            // Duplicate attributes for data rows
            if (dupFlag) {
                var dataCopy = [];
                for (i = 0; i < data.length; i++) {
                    newObject = jQuery.extend(true, {}, data[i]);
                    newObject.attr_id += "_copy";
                    dataCopy.push(newObject);
                }
                data = data.concat(dataCopy);

                for (i = 0; i < data.length; i++) {
                    newObject = jQuery.extend(true, {}, data[i]);
                    newObject.attr_id += "_copy_1";
                    dataCopy.push(newObject);
                }
                data = data.concat(dataCopy);
            }

            // Get column info from json
            cols.push({displayName: "Sample ID", name: "sample", type: "STRING", fixed: true, show: true});
            for (i = 0; i < attributes.length; i++) {
                col = attributes[i];
                cols.push({displayName: col.display_name, name: col.attr_id, type: col.datatype, fixed: false, show: true});
            }

            // Get data rows from json
            for (i = 0; i < data.length; i++) {
                cell = data[i];
                if (!rowsDict[cell.sample]) rowsDict[cell.sample] = {};
                rowsDict[cell.sample][cell.attr_id] = cell.attr_val;
            }
            for (i in rowsDict) {
                rowsDict[i].sample = i;
                rows.push(rowsDict[i]);
            }

            // Get the range of number type features
            for (i = 0; i < cols.length; i++) {
                col = cols[i];
                if (col.type == "NUMBER") {
                    var min = Number.MAX_VALUE, max = -Number.MAX_VALUE;
                    for (var j = 0; j < rows.length; j++) {
                        cell = rows[j][col.name];
                        if (typeof cell!=undefined && !isNaN(cell)) {
                            cell = Number(cell);
                            max = cell>max ? cell : max;
                            min = cell<min ? cell : min;
                        }
                    }
                    col.max = max;
                    col.min = min;
                    filters[col.name] = {type:"NUMBER",min:min,max:max};
                } else {
                    filters[col.name] = {type:"STRING",key:""};
                }
            }

            // Duplicate data rows
            if (dupFlag) {
                var rowsCopy = [];
                for (i = 0; i < rows.length; i++) {
                    newObject = jQuery.extend(true, {}, rows[i]);
                    rowsCopy.push(newObject);
                }
                for (i = 0; i < 25; i++) {
                    for (j = 0; j < rowsCopy.length; j++) {
                        newObject = jQuery.extend(true, {}, rowsCopy[i]);
                        rows.push(newObject);
                    }
                }
            }

            return {
                cols: cols,
                rows: rows,
                filteredRows: null,
                filterAll: "",
                filters: filters,
                sortBy: 'sample',
                sortDir: SortTypes.DESC,
                goToColumn: null
            };
        },

        // Prepare the content to download or copy
        _prepareContent: function () {
            var content = '', cols = this.state.cols, rows = this.state.rows;

            cols.forEach(function(e) {
                content = content + (e.displayName||'Unknown') + '\t';
            });
            content = content.slice(0,-1);

            rows.forEach(function(e){
                content += '\r\n';
                cols.forEach(function(e1){
                    content += e[e1.name] + '\t';
                });
                content = content.slice(0,-1);
            });

            return content;
        },

        // Download
        _saveFile: function () {
            //var content = this._prepareContent();
            var blob = new Blob([content], {type:'text/plain'});
            var fileName = "test.txt";

            var downloadLink = document.createElement("a");
            downloadLink.download = fileName;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null)
            {
                // Chrome allows the link to be clicked
                // without actually adding it to the DOM.
                downloadLink.href = window.webkitURL.createObjectURL(blob);
            }
            else
            {
                // Firefox requires the link to be added to the DOM
                // before it can be clicked.
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.onclick = function (event){document.body.removeChild(event.target);};
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }

            downloadLink.click();
        },

        // Get the filtered rows
        _rowGetter: function (rowIndex) {
            return this.state.filteredRows[rowIndex];
        },

        // Sort rows by selected column
        _sortRowsBy: function (cellDataKey, switchDir, type) {
            var sortDir = this.state.sortDir;
            var sortBy = cellDataKey;
            if (switchDir) {
                if (sortBy === this.state.sortBy) {
                    sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
                } else {
                    sortDir = SortTypes.DESC;
                }
            }

            var filteredRows = this.stateObj.filteredRows;
            filteredRows.sort(function (a, b) {
                var sortVal = 0, aVal = a[sortBy], bVal = b[sortBy];
                if (type == "NUMBER") {
                    aVal = (aVal && !isNaN(aVal)) ? Number(aVal) : aVal;
                    bVal = (bVal && !isNaN(bVal)) ? Number(bVal) : bVal;
                }
                if (typeof aVal!=undefined && !isNaN(aVal) && typeof bVal!=undefined && !isNaN(bVal)) {
                    if (aVal > bVal) {
                        sortVal = 1;
                    }
                    if (aVal < bVal) {
                        sortVal = -1;
                    }

                    if (sortDir === SortTypes.ASC) {
                        sortVal = sortVal * -1;
                    }
                } else if (typeof aVal!=undefined && typeof bVal!=undefined) {
                    if (!isNaN(aVal)) {
                        sortVal = -1;
                    } else if (!isNaN(bVal)) {
                        sortVal = 1;
                    }
                    else {
                        if (aVal > bVal) {
                            sortVal = 1;
                        }
                        if (aVal < bVal) {
                            sortVal = -1;
                        }

                        if (sortDir === SortTypes.ASC) {
                            sortVal = sortVal * -1;
                        }
                    }
                } else if (aVal) {
                    sortVal = -1;
                }
                else {
                    sortVal = 1;
                }

                return sortVal;
            });

            this.stateObj.filteredRows = filteredRows;
            this.stateObj.sortBy = sortBy;
            this.stateObj.sortDir = sortDir;
        },

        // Sort and set state
        _sortNSet: function (cellDataKey, type) {
            this._sortRowsBy(cellDataKey, true, type);
            this.setState({
                filteredRows: this.stateObj.filteredRows,
                sortBy: this.stateObj.sortBy,
                sortDir: this.stateObj.sortDir
            });
        },

        // Set filter
        _filterRowsBy: function (filterAll, filters) {
            var rows = this.state.rows.slice();
            var filteredRows = rows.filter(function (row) {
                var allFlag = false; // Current row contains the global keyword
                for (var col in filters) {
                    if (filters[col].type == "STRING") {
                        if (!row[col]) {
                            if (filters[col].key.length > 0) {
                                return false;
                            }
                        } else {
                            if (row[col].toLowerCase().indexOf(filters[col].key.toLowerCase()) < 0) {
                                return false;
                            }
                            if (row[col].toLowerCase().indexOf(filterAll.toLowerCase()) >= 0) {
                                allFlag = true;
                            }
                        }
                    } else if (filters[col].type == "NUMBER") {
                        if (!row[col] || isNaN(row[col])) {
                        } else {
                            if (Number(row[col]) < filters[col].min) {
                                return false;
                            }
                            if (Number(row[col]) > filters[col].max) {
                                return false;
                            }
                        }
                    }
                }
                return allFlag;
                //if (!row[filterBy.col] ||
                //    row[filterBy.col].toLowerCase().indexOf(filterBy.key.toLowerCase()) < 0) {
                //    return false;
                //}
                //for (var i=0; i<filters.length; i++) {
                //    if (!row[filters[i].col] ||
                //        row[filters[i].col].toLowerCase().indexOf(filters[i].key.toLowerCase()) < 0) {
                //        return false;
                //    }
                //}
                //return true;
            });

            this.stateObj.filteredRows = filteredRows;
            this.stateObj.filterAll = filterAll;
            this.stateObj.filters = filters;
        },

        // Filter, sort and set state
        _filterSortNSet: function (filterAll, filters, sortBy) {
            this._filterRowsBy(filterAll, filters);
            this._sortRowsBy(sortBy, false);
            this.setState({
                filteredRows: this.stateObj.filteredRows,
                sortBy: this.stateObj.sortBy,
                sortDir: this.stateObj.sortDir,
                filterAll: this.stateObj.filterAll,
                filters: this.stateObj.filters
            });
        },

        // Callback before the initial rendering
        componentWillMount: function () {
            content = this._prepareContent();
            var cols = this.state.cols;
            for (var i = 0; i < cols.length; i++) {
                tableCols.push({id:cols[i].name,label:cols[i].displayName,isChecked:true});
            }
            this._filterRowsBy(this.state.filterAll, this.state.filters);
            this.setState({
                filteredRows: this.stateObj.filteredRows
            });
        },

        // Operations when filter keyword changes
        _onFilterKeywordChange: function (e) {
            var filterAll = this.state.filterAll, filters = this.state.filters;
            if (e.target.getAttribute("data-column") == "all") {
                filterAll = e.target.value;
            } else {
                filters[e.target.getAttribute("data-column")].key = e.target.value;
            }
            this._filterSortNSet(filterAll, filters, this.state.sortBy);
        },

        // Operations when filter range changes
        _onFilterRangeChange: function (column, min, max) {
            var filters = this.state.filters;
            filters[column].min = min;
            filters[column].max = max;
            this._filterSortNSet(this.state.filterAll, filters, this.state.sortBy);
        },

        // Operations when filter keyword changes
        _onFilterColumnChange: function (e) {
            var filterBy = this.state.filterBy;
            filterBy.col = e.target.value;
            this._filterSortNSet(filterBy, this.state.sortBy);
        },

        // Scroll to user selected column
        _scrollToColumn: function (e) {
            var name = e.target.value, cols = this.state.cols, index, goToColumn;
            for (var i = 0; i < cols.length; i++) {
                if (name == cols[i].name) {
                    index = i;
                    break;
                }
            }
            this.setState({
                goToColumn: index
            });
        },

        // Save current filter
        _saveFilter: function () {
            var filters = this.state.filters;
            filters.push(jQuery.extend(true, {}, this.state.filterBy));
            this.setState({
                filters: filters
            });
        },

        // Delete selected filter
        _deleteFilter: function (index) {
            var filters = this.state.filters;
            filters.splice(index,1);
            this._filterRowsBy(this.state.filterBy, filters);
            this.setState({
                filteredRows: this.stateObj.filteredRows,
                filterBy: this.stateObj.filterBy,
                filters: filters
            });
        },

        // Hide columns
        _hideColumns: function (list) {
            var cols = this.state.cols;
            for (var i = 0; i < list.length; i++) {
                cols[i].show = list[i].isChecked;
            }
            this.setState({
                cols: cols
            });
        },

        // React-renderable content for group header cells
        _renderGroupHeader: function (_1, _2, columnGroupData) {
            if (columnGroupData.type == "NUMBER") {
                return (
                    <div>
                        <input type="text" id={"range-"+columnGroupData.name} readOnly
                               style={{border:0,color:"#f6931f"}}></input>
                        <div className="rangeSlider" data-max={columnGroupData.max}
                             data-min={columnGroupData.min} data-column={columnGroupData.name}></div>
                    </div>
                );
            } else {
                return (
                    <input style={{width:"160px",height:"32px"}} placeholder="Input a keyword"
                           data-column={columnGroupData.name} onChange={this._onFilterKeywordChange}/>
                );
            }
        },

        // React-renderable content for header cells
        _renderHeader: function (_1, cellDataKey, columnData) {
            var label = columnData.displayName, qtipFlag = false;
            if (columnData.displayName.length > 20) {
                qtipFlag = true;
                label = columnData.displayName.substring(0, 20) + '...';
            }
            if (columnData.flag) {
                label += columnData.sortDirArrow;
            }
            return (
                <span className={qtipFlag?"hasQtip":""} data-qtip={columnData.displayName}>
                    <a href="#" onClick={this._sortNSet.bind(null, cellDataKey, columnData.type)}>{label}</a>
                </span>
            );
        },

        // React-renderable content for cells
        _renderCell: function (cellData, _1, _2, _3, columnData) {
            var qtipFlag = false, cellDisplay = cellData;
            if (cellData && cellData.length > 20) {
                qtipFlag = true;
                cellDisplay = cellData.substring(0, 20) + '...';
            }
            var flag = (cellData && columnData.filterAll.length > 0)
                ? (cellData.toLowerCase().indexOf(columnData.filterAll.toLowerCase()) >= 0) : false;
            return (
                <span className={qtipFlag?"hasQtip":""} data-qtip={cellData}
                      style={flag ? {backgroundColor:'yellow'} : {}}>
                    {cellDisplay}
                </span>
            );
        },

        // Callback when scrolling ends
        onScrollEnd: function () {
            var _onFilterRangeChange = this._onFilterRangeChange;
            $(document).ready(function () {
                $('.hasQtip')
                    .each(function () {
                        $(this).qtip({
                            content: {text: $(this).attr('data-qtip')},
                            hide: {fixed: true, delay: 100},
                            style: {classes: 'qtip-light qtip-rounded qtip-shadow', tip: true},
                            position: {my: 'center left', at: 'center right', viewport: $(window)}
                        });
                    });
            });
        },

        // Callback after the initial rendering
        componentDidMount: function () {
            var _hideColumns = this._hideColumns, _onFilterRangeChange = this._onFilterRangeChange;

            $(document).ready(function () {
                var client = new ZeroClipboard($("#copy-button"));
                client.on( "ready", function( readyEvent ) {
                    client.on( "copy", function(event) {
                        event.clipboardData.setData('text/plain', content);
                    } );
                } );

                $("#hide_column_checklist").dropdownCheckbox({
                    data: tableCols,
                    autosearch: true,
                    title: "Show / Hide Columns",
                    hideHeader: false,
                    showNbSelected: true
                });

                $("#hide_column_checklist").on("change", function(){
                    var list = ($("#hide_column_checklist").dropdownCheckbox("items"));
                    _hideColumns(list);
                });

                $('.hasQtip')
                    .each(function () {
                        $(this).qtip({
                            content: {text: $(this).attr('data-qtip')},
                            hide: {fixed: true, delay: 100},
                            style: {classes: 'qtip-light qtip-rounded qtip-shadow', tip: true},
                            position: {my: 'center left', at: 'center right', viewport: $(window)}
                        });
                    });

                $('.rangeSlider')
                    .each(function () {
                        var min = Number($(this).attr('data-min')), max = Number($(this).attr('data-max')),
                            column = $(this).attr('data-column');
                        $(this).slider({
                            range: true,
                            min: min,
                            max: max,
                            values: [ min, max ],
                            slide: function( event, ui ) {
                                $( "#range-" + column ).val( ui.values[ 0 ] + " to " + ui.values[ 1 ] );
                                _onFilterRangeChange(column, ui.values[ 0 ], ui.values[ 1 ]);
                            }
                        });
                        $( "#range-" + column ).val( min + " to " + max );
                    });
            });
        },

        render: function () {
            var sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑',
                state = this.state, _renderHeader = this._renderHeader,
                _renderCell = this._renderCell, _deleteFilter = this._deleteFilter,
                _renderGroupHeader = this._renderGroupHeader;

            return (
                <div>
                    <br></br>
                    <div>
                        <button style={{width:"100px"}} onClick={this._saveFile}>DATA</button>
                        &nbsp;&nbsp;
                        <button id="copy-button" style={{width:"100px"}}>COPY</button>
                    </div>
                    <br></br>
                    <div>
                        <div id="hide_column_checklist"></div>
                    </div>
                    <br></br>
                    <div>
                        <div style={{float:"left"}}>
                            <Chosen data-placeholder="Choose a column" defaultValue="sample"
                                    onChange={/*this._onFilterColumnChange*/this._scrollToColumn}>
                                {
                                    state.cols.map(function (col) {
                                        return (<option value={col.name}>
                                            {col.displayName}
                                        </option>)
                                    })
                                }
                            </Chosen>
                        </div>
                        <div style={{float:"left"}}>
                            &nbsp;
                            <input style={{width:"200px",height:"20px"}} placeholder="Input a keyword"
                                   data-column="all" onChange={this._onFilterKeywordChange}/>
                            &nbsp;
                            {
                            //<button style={{width:"100px"}} onClick={this._saveFilter}>SAVE</button>
                            //&nbsp;
                            }
                        </div>
                        {
                            //state.filters.map(function (filter, index) {
                            //    return (<div style={{float:"left"}}>
                            //        &nbsp;
                            //        &nbsp;
                            //        <div style={{float:"left",borderRadius:"5px",background:"cyan"}}>
                            //            <span>{filter.key}</span>
                            //            &nbsp;|&nbsp;
                            //            <span onClick={_deleteFilter.bind(this, index)}>X</span>
                            //        </div>
                            //    </div>)
                            //})
                        }
                    </div>
                    <br></br><br></br>
                    <Table
                        rowHeight={50}
                        rowGetter={this._rowGetter}
                        onScrollEnd={this.onScrollEnd}
                        rowsCount={state.filteredRows.length}
                        width={1000}
                        maxHeight={500}
                        headerHeight={50}
                        groupHeaderHeight={50}
                        scrollToColumn={state.goToColumn}
                        >
                        {
                            state.cols.map(function (col) {
                                return (
                                    <ColumnGroup
                                        groupHeaderRenderer={_renderGroupHeader}
                                        columnGroupData={{name:col.name,type:col.type,max:col.max,min:col.min}}
                                        fixed={col.fixed}
                                        align="center"
                                        >
                                        <Column
                                            headerRenderer={_renderHeader}
                                            cellRenderer={_renderCell}
                                            // Flag is true when table is sorted by this column
                                            columnData={{displayName:col.displayName,flag:state.sortBy === col.name,
                                            sortDirArrow:sortDirArrow,filterAll:state.filterAll,type:col.type}}
                                            width={col.show ? 200 : 0}
                                            dataKey={col.name}
                                            fixed={col.fixed}
                                            />
                                    </ColumnGroup>
                                );
                            })
                        }
                    </Table>
                </div>
            );
        }
    });

    React.render(<CBioTable />, document.body);
});
