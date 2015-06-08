/**
 * Created by chengm1 on 5/22/15.
 */

$.getJSON('data/webservice_main.json', function (json) {
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
                data = json.data, col, cell, i, newObject;

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
            cols.push({displayName: "Sample ID", name: "sample", fixed: true, show: true});
            for (i = 0; i < attributes.length; i++) {
                col = attributes[i];
                cols.push({displayName: col.display_name, name: col.attr_id, fixed: false, show: true});
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

            // Duplicate data rows
            if (dupFlag) {
                var rowsCopy = [];
                for (i = 0; i < rows.length; i++) {
                    newObject = jQuery.extend(true, {}, rows[i]);
                    rowsCopy.push(newObject);
                }
                for (i = 0; i < 0; i++) {
                    for (var j = 0; j < rowsCopy.length; j++) {
                        newObject = jQuery.extend(true, {}, rowsCopy[i]);
                        rows.push(newObject);
                    }
                }
            }

            return {
                cols: cols,
                rows: rows,
                filteredRows: null,
                filterBy: {col:'sample'},
                filters: [],
                sortBy: 'sample',
                sortDir: SortTypes.DESC
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
        _sortRowsBy: function (cellDataKey, switchDir) {
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
                var sortVal = 0;
                if (a[sortBy] && b[sortBy]) {
                    if (a[sortBy] > b[sortBy]) {
                        sortVal = 1;
                    }
                    if (a[sortBy] < b[sortBy]) {
                        sortVal = -1;
                    }

                    if (sortDir === SortTypes.ASC) {
                        sortVal = sortVal * -1;
                    }
                } else if (a[sortBy]) {
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
        _sortNSet: function (cellDataKey) {
            this._sortRowsBy(cellDataKey, true);
            this.setState({
                filteredRows: this.stateObj.filteredRows,
                sortBy: this.stateObj.sortBy,
                sortDir: this.stateObj.sortDir
            });
        },

        // Set filter
        _filterRowsBy: function (filterBy, filters) {
            var rows = this.state.rows.slice();
            var filteredRows = (filters.length > 0 || filterBy.key) ? rows.filter(function (row) {
                if (!row[filterBy.col] ||
                    row[filterBy.col].toLowerCase().indexOf(filterBy.key.toLowerCase()) < 0) {
                    return false;
                }
                for (var i=0; i<filters.length; i++) {
                    if (!row[filters[i].col] ||
                        row[filters[i].col].toLowerCase().indexOf(filters[i].key.toLowerCase()) < 0) {
                        return false;
                    }
                }
                return true;
            }) : rows;

            this.stateObj.filteredRows = filteredRows;
            this.stateObj.filterBy = filterBy;
        },

        // Filter, sort and set state
        _filterSortNSet: function (filterBy, sortBy) {
            this._filterRowsBy(filterBy, this.state.filters);
            this._sortRowsBy(sortBy, false);
            this.setState({
                filteredRows: this.stateObj.filteredRows,
                sortBy: this.stateObj.sortBy,
                sortDir: this.stateObj.sortDir,
                filterBy: this.stateObj.filterBy
            });
        },

        // Callback before the initial rendering
        componentWillMount: function () {
            content = this._prepareContent();
            var cols = this.state.cols;
            for (var i = 0; i < cols.length; i++) {
                tableCols.push({id:cols[i].name,label:cols[i].displayName,isChecked:true});
            }
            this._filterRowsBy(this.state.filterBy, this.state.filters);
            this.setState({
                filteredRows: this.stateObj.filteredRows,
                filterBy: this.stateObj.filterBy
            });
        },

        // Operations when filter keyword changes
        _onFilterKeywordChange: function (e) {
            var filterBy = this.state.filterBy;
            filterBy.key = e.target.value;
            this._filterSortNSet(filterBy, this.state.sortBy);
        },

        // Operations when filter keyword changes
        _onFilterColumnChange: function (e) {
            var filterBy = this.state.filterBy;
            filterBy.col = e.target.value;
            this._filterSortNSet(filterBy, this.state.sortBy);
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
        _renderGroupHeader: function () {
            return (
                <input style={{width:"160px",height:"32px"}} placeholder="Input a keyword"
                       onChange={this._onFilterKeywordChange}/>
            );
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
                    <a href="#" onClick={this._sortNSet.bind(null, cellDataKey)}>{label}</a>
                </span>
            );
        },

        // React-renderable content for cells
        _renderCell: function (cellData) {
            var qtipFlag = false, cellDisplay = cellData;
            if (cellData && cellData.length > 20) {
                qtipFlag = true;
                cellDisplay = cellData.substring(0, 20) + '...';
            }
            return (
                <span className={qtipFlag?"hasQtip":""} data-qtip={cellData}>
                    {cellDisplay}
                </span>
            );
        },

        // Callback when scrolling ends
        onScrollEnd: function () {
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
            var _hideColumns = this._hideColumns;

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
                            <Chosen data-placeholder="Choose a column" defaultValue="all"
                                    onChange={this._onFilterColumnChange}>
                                <option value="all">ALL</option>
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
                                   onChange={this._onFilterKeywordChange}/>
                            &nbsp;
                            <button style={{width:"100px"}} onClick={this._saveFilter}>SAVE</button>
                            &nbsp;
                        </div>
                        {
                            state.filters.map(function (filter, index) {
                                return (<div style={{float:"left"}}>
                                    &nbsp;
                                    &nbsp;
                                    <div style={{float:"left",borderRadius:"5px",background:"cyan"}}>
                                        <span>{filter.key}</span>
                                        &nbsp;|&nbsp;
                                        <span onClick={_deleteFilter.bind(this, index)}>X</span>
                                    </div>
                                </div>)
                            })
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
                        //scrollLeft={100}
                        //scrollToColumn={3}
                        >
                        {
                            state.cols.map(function (col) {
                                return (
                                    <ColumnGroup
                                        groupHeaderRenderer={_renderGroupHeader}
                                        fixed={col.fixed}
                                        align="center"
                                        >
                                        <Column
                                            headerRenderer={_renderHeader}
                                            cellRenderer={_renderCell}
                                            // Flag is true when table is sorted by this column
                                            columnData={{displayName:col.displayName,flag:state.sortBy === col.name,
                                            sortDirArrow:sortDirArrow}}
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
