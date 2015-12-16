var data = [{header: ['c1', 'c2'], rows:[ [1, 0], [0, 1]]}, {header: ['c1', 'c2'], rows:[ [0, 0], [1, 1]]}];

var UserQuery = React.createClass({
  handleClick: function() {
    var bid = $('#bid_input').val();
    var send_url = this.props.url + bid;
    $.ajax({
    url: send_url,
    dataType: 'json',
    cache: false,
    success: function(data) {
    this.setState({rdResult: data});
    }.bind(this),
    error: function(xhr, status, err) {
    console.error(this.props.url, status, err.toString());
    }.bind(this)
    });
  },
  getInitialState: function() {
    return {rdResult: {}};
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
              <ResultSessions sessions={this.state.rdResult.sessions}
               constraintsMap = {this.state.rdResult.constraints_map} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var ResultSessions = React.createClass({

  render: function() {
    var cm = this.props.constraintsMap
    if (this.props.sessions != null ) {
      var resultSessions = this.props.sessions.map(function(sess, index) {
        return (
          <Session key={index} session={sess}
           constraintsMap={cm} />
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
  format_time: function(timestamp) {
    var result = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    return (result);
  },
  render: function() {
    var divPanelStyle = {
      marginBottom: 30
    };
    var resultStyle = {
      float : 'right'
    };
    if (this.props.session == null) {
      return (null);
    }
    if (this.props.session.result == 'success') {
      var resultClass = 'label label-success'
      if (this.props.session.special == 'acquaintance') {
        var resultText = '转接成功：熟客'
      } else if (this.props.session.special == 'chatting') {
        var resultText = '转接成功：沟通中'
      } else {
        var resultText = '转接成功'
      }
    } else if (this.props.session.result == 'queue') {
      var resultClass = 'label label-warning'
      var resultText = '排队中'
    }

    return (
      <div className="panel panel-info" style={divPanelStyle}>
        <div className="panel-heading">
          <span>访客 @ {this.format_time(this.props.session.time)}</span>
          <span className={resultClass} style={resultStyle}>{resultText}</span>
        </div>
        <VisitorInfo />
        <ConstraintMatrix headers={this.props.session.constraints_vector}
         constraintsMap={this.props.constraintsMap}
         matrix={this.props.session.waiters} />
      </div>
    );
  }
});

var VisitorInfo = React.createClass({
  render: function() {
    return(
      <table class="info_table">

      </table>
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
            <ConstraintHeader constraintsMap={this.props.constraintsMap}
             header={this.props.headers}/>
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
  <UserQuery url='http://10.81.39.58/get_rd?bid=' />,
  document.getElementById('userQuery')
);
