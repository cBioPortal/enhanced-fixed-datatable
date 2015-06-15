var FileGrabber = React.createClass({
    render: function () {
        return (
            <button>DATA</button>
        );
    }
});

var ClipboardGrabber = React.createClass({
    render: function () {
        return (
            <button id="copy-button">COPY</button>
        );
    }
});

var DataGrabber = React.createClass({
    render: function () {
        return (
            <div>
                <div style={{float:"left",width:"50%",textAlign:"center"}}><FileGrabber /></div>
                <div style={{float:"left",width:"50%",textAlign:"center"}}><ClipboardGrabber /></div>
            </div>
        );
    }
});

var ColumnHider = React.createClass({
    render: function () {
        return (
            <div id="hide_column_checklist"></div>
        );
    }
});

var ColumnScroller = React.createClass({
    render: function() {
        return (
            <Chosen data-placeholder="Choose a column" defaultValue="sample">
            </Chosen>
        );
    }
});

var GlobalFilter = React.createClass({
    render: function() {
        return (
            <input placeholder="Input a keyword"/>
        );
    }
});

var TablePrefix = React.createClass({
    render: function() {
        return (
            <div>
        <div>
            <div style={{float:"left",width:"50%",textAlign:"center"}}><ColumnHider /></div>
            <div style={{float:"left",width:"50%",textAlign:"center"}}><DataGrabber /></div>
        </div>
        <div>
        <div style={{float:"left",width:"50%",textAlign:"center"}}><ColumnScroller /></div>
        <div style={{float:"left",width:"50%",textAlign:"center"}}><GlobalFilter /></div>
    </div>
                </div>
        );
        }
        });

var SingleColumnFilter = React.createClass({

    render: function() {
        return (
            <div />
        );
    }

});

var TableMainPart = React.createClass({

    render: function() {
        return (
            <div />
        );
    }

});


var EnhancedFixedDataTable = React.createClass({
    render: function () {
        return (
            <div>
                <div style={{width:"90%",textAlign:"center"}}><TablePrefix /></div>
                <div style={{width:"90%",textAlign:"center"}}><TableMainPart /></div>
            </div>
        );
    }
});