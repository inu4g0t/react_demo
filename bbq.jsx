var UserQuery = React.createClass({
    handleClick: function() {
        var bid = $('#bid_input').val();
        if (bid != null && bid != "") {
            var send_url = this.props.url + bid;
        } else {
            return;
        }
        $.ajax({
            url: send_url,
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({rdResult: data, queryed: true});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {rdResult: {}, queryed: false};
    },
    render: function() {
        var divRowStyle = {
            marginTop: 20
        };
        var showInfo;
        if (this.state.rdResult.result == "ok") {
            if (this.state.rdResult.sessions != null) {
                showInfo = <ResultSessions sessions={this.state.rdResult.sessions}
                    constraintsMap = {this.state.rdResult.constraints_map} />;
            } else {
                if (this.state.rdResult.result == "error" &&
                this.state.rdResult.reason != null) {
                    showInfo = <ShowError errorMsg={this.state.rdResult.reason} />
                } else {
                    showInfo = <ShowError errorMsg="未知错误，请联系rd排查" />
                }
                showInfo = <ShowError errorMsg="未找到记录"/>
            }
        } else if (this.state.queryed) {
            showInfo = <ShowError errorMsg="未找到记录"/>
        }
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
                        {showInfo}
                    </div>
                </div>
            </div>
        );
    }
});

var ShowError = React.createClass({
    render: function() {
        var divRowStyle = {
            marginTop: 20
        };
        var pStyle = {
            textAlign: "center",
            color: "#888",
            family: "Microsoft YaHei, SimHe"
        }
        return (
            <div className="row" style={divRowStyle}>
                <div className="col-lg-8">
                    <p id="error_tag" style={pStyle}>{this.props.errorMsg}</p>
                </div>
            </div>
        );
    }
});

var ResultSessions = React.createClass({
    render: function() {
        var cm = this.props.constraintsMap;
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
            float: "right"
        };
        if (this.props.session == null) {
            return (null);
        }
        if (this.props.session.result == "success") {
            var resultClass = "label label-success"
            if (this.props.session.special == "acquaintance") {
                var resultText = "转接成功：熟客"
            } else if (this.props.session.special == "chatting") {
                var resultText = "转接成功：沟通中"
            } else {
                var resultText = "转接成功"
            }
        } else if (this.props.session.result == "queue") {
            var resultClass = "label label-warning"
            var resultText = "排队中"
        }
        return (
            <div className="panel panel-info" style={divPanelStyle}>
                <div className="panel-heading">
                    <span>访客 @ {this.format_time(this.props.session.time)}</span>
                    <span className={resultClass} style={resultStyle}>{resultText}</span>
                </div>
                <VisitorInfo visInfo={this.props.session.vis}
                    toSub={this.props.session.to_sub_username} />
                <ConstraintMatrix headers={this.props.session.constraints_vector}
                    constraintsMap={this.props.constraintsMap}
                    matrix={this.props.session.waiters}
                    hardNum={this.props.session.hard_constraint_num}
                    toSubUsername={this.props.session.to_sub_username}/>
            </div>
        );
    }
});

var VisitorInfo = React.createClass({
    render: function() {
        if (this.props.toSub != null) {
            var toWaiter = <InfoItem name="接待客服：" value={this.props.toSub} />
        }
        var visInfo = this.props.visInfo;
        var typeName = "全站分配";
        var subLable = "";
        var subValue;
        if (visInfo.task_type == 0) {
            typeName = "指定客服分配";
            subLable = "选择客服：";
            subValue = visInfo.task_username;
        } else if (visInfo.task_type == 0 || visInfo.task_type == 1) {
            typeName = "组内分配";
            subLable = "选择分组：";
            subValue = visInfo.task_group_name;
        }
        if (subLable != "") {
            var subTab = <InfoItem name={subLable} value={subValue} />
        }
        var assignLevel = visInfo.assign_level;
        var assignName = "无";
        if (assignLevel == 1) {
            assignName = "组内突破地域";
        } else if (assignLevel == 2) {
            assignName = "突破分组和地域";
        }
        var maxUrlLen = 80;
        var url = visInfo.url;
        var urlDisp = url;
        if (url.length > maxUrlLen) {
            urlDisp = url.substr(0, max_url_len) + "...";
        }
        var urlValue = <a href={url}>{urlDisp}</a>
        return(
            <table className="info_table">
                <tbody>
                    {toWaiter}
                    <InfoItem name="分配方式：" value={typeName} />
                    {subTab}
                    <InfoItem name="访问站点：" value={visInfo.site_url} />
                    <InfoItem name="突破策略：" value={assignName} />
                    <InfoItem name="访客地域：" value={visInfo.region} />
                    <InfoItem name="来源url：" value={urlValue} />
                </tbody>
            </table>
        );
    }
});

var InfoItem = React.createClass({
    render: function() {
        return(
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.value}</td>
            </tr>
        );
    }
});

var ConstraintMatrix = React.createClass({
    render: function() {
        var toSubUsername = this.props.toSubUsername;
        if (this.props.matrix != null ) {
            var constraintRows = this.props.matrix.map(function(elem, index) {
                return (
                    <ConstraintRow key={index} row={elem}
                        isSelected={elem.username == toSubUsername}/>
                );
            });
        }
        return (
            <div className="constraintMatrix">
                <table className="table">
                    <tbody>
                        <ConstraintHeader constraintsMap={this.props.constraintsMap}
                            header={this.props.headers}
                            hardNum={this.props.hardNum} />
                        {constraintRows}
                    </tbody>
                </table>
            </div>
        );
    }
});

var ConstraintHeader = React.createClass({
    render: function() {
        var hardNum = this.props.hardNum;
        var constraintsMap = this.props.constraintsMap;
        var constraintNodes = this.props.header.map(function(elem, index) {
            if (index < hardNum) {
                return (
                    <th className="hard_header" key={index}>{constraintsMap[elem]}</th>
                );
            }
            return (
                <th key={index}>{constraintsMap[elem]}</th>
            );
        });
        return (
            //<div className="constraintHeader">
            <tr>
                <th></th>
                {constraintNodes}
            </tr>
            //</div>
        );
    }
});

var ConstraintRow = React.createClass({
    render: function() {
        var constraintNodes = this.props.row.constraints_vector.map(function(elem, index) {
            return (
                <ConstraintElem key={index} result={elem} />
            );
        });
        if (this.props.isSelected) {
            return(
                <tr className="active">
                    <td>{this.props.row.username}</td>
                    {constraintNodes}
                </tr>
            );
        }
        return (
            <tr>
                <td>{this.props.row.username}</td>
                {constraintNodes}
            </tr>
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
        return (
            <td>
                <span className={elem} aria-hidden="true"></span>
            </td>
        );
    }
});

ReactDOM.render(
    <UserQuery url="http://10.81.39.58/get_rd?bid=" />,
    document.getElementById("userQuery")
);
