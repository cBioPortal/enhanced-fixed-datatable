/**
 * Created by chengm1 on 5/22/15.
 */

$.getJSON('data/webservice_main.json', function (json) {
    var Table = FixedDataTable.Table, Column = FixedDataTable.Column;
    var dupFlag = false;

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
            for (i = 0; i < attributes.length; i++) {
                col = attributes[i];
                cols.push({displayName: col.display_name, name: col.attr_id, fixed: false});
            }
            cols.push({displayName: "Sample ID", name: "sample", fixed: true});

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
                filterBy: null,
                sortBy: 'sample',
                sortDir: SortTypes.DESC
            };
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
        _filterRowsBy: function (filterBy) {
            var rows = this.state.rows.slice();
            var filteredRows = filterBy ? rows.filter(function (row) {
                for (var cell in row) {
                    if (row[cell].toLowerCase().indexOf(filterBy.toLowerCase()) >= 0) {
                        return true;
                    }
                }
                return false;
            }) : rows;

            this.stateObj.filteredRows = filteredRows;
            this.stateObj.filterBy = filterBy;
        },

        // Filter, sort and set state
        _filterSortNSet: function (filterBy, sortBy) {
            this._filterRowsBy(filterBy);
            this._sortRowsBy(sortBy, false);
            this.setState({
                filteredRows: this.stateObj.filteredRows,
                sortBy: this.stateObj.sortBy,
                sortDir: this.stateObj.sortDir,
                filterBy: this.filterBy
            });
        },

        // Callback before the initial rendering
        componentWillMount: function () {
            this._filterRowsBy(this.state.filterBy);
            this.setState({
                filteredRows: this.stateObj.filteredRows,
                filterBy: this.stateObj.filterBy
            });
        },

        // Operations when keyword changes
        _onFilterChange: function (e) {
            this._filterSortNSet(e.target.value, this.state.sortBy);
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

        render: function () {
            var sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑',
                state = this.state, _renderHeader = this._renderHeader,
                _renderCell = this._renderCell;

            return (
                <div>
                    <label>filter by <input onChange={this._onFilterChange}/></label>
                    <br></br><br></br>
                    <Table
                        rowHeight={50}
                        rowGetter={this._rowGetter}
                        onScrollEnd={this.onScrollEnd}
                        rowsCount={state.filteredRows.length}
                        width={1000}
                        maxHeight={500}
                        headerHeight={50}
                        >
                        {
                            state.cols.map(function (col) {
                                return (<Column
                                    headerRenderer={_renderHeader}
                                    cellRenderer={_renderCell}
                                    // Flag is true when table is sorted by this column
                                    columnData={{displayName:col.displayName,flag:state.sortBy === col.name,sortDirArrow:sortDirArrow}}
                                    width={200}
                                    dataKey={col.name}
                                    fixed={col.fixed}
                                    />)
                            })
                        }
                    </Table>
                </div>
            );
        }
    });


    React.render(<CBioTable />, document.body);
});
