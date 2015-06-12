var React = require('react');

var DataGrabber = React.createClass({

	render: function() {
		return (
            <div>
                <DataGrabber />
                <ClipboardGrabber />
            </div>
		);
	}

});

module.exports = DataGrabber;