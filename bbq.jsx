// var data = [{header: ['c1', 'c2'], rows:[ [1, 0], [0, 1]]}, {header: ['c1', 'c2'], rows:[ [0, 0], [1, 1]]}];

var UserQuery = React.createClass({
  handleClick: function() {

    $.ajax({
    url: this.props.url,
    dataType: 'json',
    cache: false,
    success: function(data) {
    this.setState({data: data});
    }.bind(this),
    error: function(xhr, status, err) {
    console.error(this.props.url, status, err.toString());
    }.bind(this)
    });
  },
  getInitialState: function() {
    return {sess: []};
  },
  render: function() {
    var divRowStyle = {
      marginTop: 20
    };
    return (
      <div>
        <div className="row" style={divRowStyle}>
          <div className="col-lg-8">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="请输入bid" id="bid_input" />
              <span className="input-group-btn">
                <button className="btn btn-default" type="button"  onClick={this.handleClick} >Go!</button>
              </span>
            </div>
          </div>
        </div>
        <div className="row" style={divRowStyle}>
          <div className="col-lg-8">
            <div className="input-group">
              <ResultSessions sess={this.state.sess} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var ResultSessions = React.createClass({

  render: function() {
    if (this.props.sess != null ) {
      var resultSessions = this.props.sess.map(function(sess, index) {
        return (
          <Session key={index} matrix={sess} result='success' />
        );
      });
    }
    return (
      <div>
        {resultSessions}
      </div>
    );
  }
});

var Session = React.createClass({

  render: function() {
    var divPanelStyle = {
      marginBottom: 30
    };
    var resultStyle = {
      float : 'right'
    }
    if (this.props.result == 'success') {
      var resultClass = 'label label-success'
      if (this.props.special == 'acquaintance') {
        var resultText = '转接成功：熟客'
      } else if (this.props.special == 'chatting') {
        var resultText = '转接成功：沟通中'
      } else {
        var resultText = '转接成功'
      }
    } else if (this.props.result == 'queue') {
      var resultClass = 'label label-warning'
      var resultText = '排队中'
    }

    return (
      <div className="panel panel-info" style={divPanelStyle}>
        <div className="panel-heading">
          <span>访客 @ {format_time(1450183262)}</span>
          <span className={resultClass} style={resultStyle}>{resultText}</span>
        </div>
        <VisitorInfo />
        <ConstraintMatrix matrix={this.props.matrix} />
      </div>
    );
  }
});

var VisitorInfo = React.createClass({
  render: function() {
    return(
      null
    );
  }
});

var ConstraintMatrix = React.createClass({
  render: function() {
    if (this.props.matrix.rows != null ) {
      var constraintRows = this.props.matrix.rows.map(function(elem, index) {
        return (
          <ConstraintRow key={index} row={elem} />
        );
      });
    }
    return (
      <div className="constraintMatrix">
        <table className="info_table">
          <tbody>
            <ConstraintHeader header={this.props.matrix.header}/>
            {constraintRows}
          </tbody>
        </table>
      </div>
    );
  }
});

var ConstraintHeader = React.createClass({
  render: function() {
    var constraintNodes = this.props.header.map(function(elem, index) {
      return (
        <th key={index}>{elem}</th>
      );
    });
    return (
      //<div className="constraintHeader">
      <tr>
        {constraintNodes}
      </tr>
      //</div>
    );
  }
});

var ConstraintRow = React.createClass({
  render: function() {
    var constraintNodes = this.props.row.map(function(elem, index) {
      return (
        <ConstraintElem key={index} result={elem} />
      );
    });
    return (
      // <div className="constraintRow">
      <tr>
        {constraintNodes}
      </tr>
      // </div>
    );
  }
});

var ConstraintElem = React.createClass({
  render: function() {

    if (this.props.result == 0) {
      var elem = "glyphicon glyphicon-remove"
    } else if (this.props.result == 1) {
      var elem = "glyphicon glyphicon-ok"
    }
    /*
    if (this.props.result == 0) {
    var elem = 'no'
    } else if (this.props.result == 1) {
    var elem = 'yes'
    }
    */
    return (
      <td>
        <span className={elem} aria-hidden="true"></span>
      </td>
    );
  }
});

ReactDOM.render(
  <UserQuery url='' />,
  document.getElementById('userQuery')
);
