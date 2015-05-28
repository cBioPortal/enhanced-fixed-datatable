/**
 * Created by chengm1 on 5/22/15.
 */

$.getJSON('data/webservice_main.json', function (json) {
    var Table = FixedDataTable.Table;
    var Column = FixedDataTable.Column;

    var SortTypes = {
        ASC: 'ASC',
        DESC: 'DESC'
    };

    var CBioTable = React.createClass({
        stateObj: {},

        getInitialState: function () {
            var cols = [];
            var rows = [];
            var rowsDict = {};
            var attributes = json.attributes;
            var data = json.data;
            var col;
            var cell;

            //console.log(data);
            //console.log(attributes);

            var i;
            var newObject;
            // Duplicate attributes for column info
            var attrCopy = [];
            for (i = 0; i < attributes.length; i++) {
                newObject = jQuery.extend(true, {}, attributes[i]);
                newObject.display_name += "_Copy";
                newObject.attr_id += "_copy"
                attrCopy.push(newObject);
            }
            attributes = attributes.concat(attrCopy);

            //for (i = 0; i < attributes.length; i++) {
            //    newObject = jQuery.extend(true, {}, attributes[i]);
            //    newObject.display_name += "_Copy_1";
            //    newObject.attr_id += "_copy_1"
            //    attrCopy.push(newObject);
            //}
            //attributes = attributes.concat(attrCopy);

            //console.log(attributes);

            // Duplicate attributes for data rows
            var dataCopy = [];
            for (i = 0; i < data.length; i++) {
                newObject = jQuery.extend(true, {}, data[i]);
                newObject.attr_id += "_copy";
                dataCopy.push(newObject);
            }
            data = data.concat(dataCopy);

            //for (i = 0; i < data.length; i++) {
            //    newObject = jQuery.extend(true, {}, data[i]);
            //    newObject.attr_id += "_copy_1";
            //    dataCopy.push(newObject);
            //}
            //data = data.concat(dataCopy);


            // Get column info from json
            for (i = 0; i < attributes.length; i++) {
                col = attributes[i];
                //console.log(col);
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
                //for (var j=0; j<cols.length; j++){
                //    if(!rowsDict[i][cols[j].name]) {
                //        rowsDict[i][cols[j].name] = "undefined";
                //    }
                //}
                rows.push(rowsDict[i]);
            }

            // Duplicate data rows
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

            //console.log(rows);

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
            //console.log(cellDataKey);
            var sortBy = cellDataKey;
            if (switchDir) {
                if (sortBy === this.state.sortBy) {
                    sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
                } else {
                    sortDir = SortTypes.DESC;
                }
            }

            var filteredRows = this.stateObj.filteredRows;
            //console.log("here");
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
                //return row.sample.toLowerCase().indexOf(filterBy.toLowerCase()) >= 0;
            }) : rows;

            this.stateObj.filteredRows = filteredRows;
            this.stateObj.filterBy = filterBy;
        },

        // Filter, sort and set state
        _filterSortNSet: function (filterBy, sortBy) {
            //this.stateObj.sortDir = this.stateObj.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
            this._filterRowsBy(filterBy);
            this._sortRowsBy(sortBy, false);
            this.setState({
                filteredRows: this.stateObj.filteredRows,
                sortBy: this.stateObj.sortBy,
                sortDir: this.stateObj.sortDir,
                filterBy: this.filterBy
            });
        },

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

        _renderHeader: function (label, cellDataKey) {
            return (
                <a href="#" onClick={this._sortNSet.bind(null, cellDataKey)}>{label}</a>
            );
        },

        _renderCell: function (label, cellDataKey) {
            return (
                <a href="#" onClick={this._sortNSet.bind(null, cellDataKey)}>{label}</a>
            );
        },

        render: function () {
            var sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
            //var x = 5;
            var state = this.state;
            var _renderHeader = this._renderHeader;
            var _renderCell = this._renderCell;
            //console.log("x = "+x);
            return (
                <div>
                    <label>filter by <input onChange={this._onFilterChange}/></label>
                    <br></br><br></br>
                    <Table
                        rowHeight={50}
                        rowGetter={this._rowGetter}
                        rowsCount={state.filteredRows.length}
                        width={1000}
                        maxHeight={500}
                        headerHeight={50}>
                        {
                            state.cols.map(function (col) {
                                //console.log('here');
                                //console.log("x = "+x);
                                //console.log(col);
                                //console.log(state);
                                //console.log(this.state);
                                return (<Column
                                    headerRenderer={_renderHeader}
                                    cellRenderer={_renderCell}
                                    label={col.displayName + (state.sortBy === col.name ? sortDirArrow : '')}
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