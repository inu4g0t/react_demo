var SiteInfoQuery = React.createClass({
    handleClick: function() {
        var mainid = $('#mainid_input').val();
        if (mainid != null && mainid != "") {
            var sendUrl = this.props.url + mainid;
        } else {
            return;
        }
        $.ajax({
            url: sendUrl,
            dataType: "json",
            cache: false,
            success: function(data) {
                this.setState({siteInfos: data, queryed: true});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {siteInfos: {}, queryed: false};
    },
    render: function() {
        var divRowStyle = {
            marginTop: 20
        };
        var showInfo;
        console.log(this.state.siteInfos);
        if (this.state.siteInfos.length > 0) {
            showInfo = <SiteInfos siteInfos={this.state.siteInfos} />
        } else if (this.state.queryed) {
            showInfo = <ShowError errorMsg="未找到记录"/>
        }
        return (
            <div>
                <div className="row" style={divRowStyle}>
                    <div className="col-lg-8">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="请输入mainid" id="mainid_input" />
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

var SiteInfos = React.createClass({
    render: function() {
        if (this.props.siteInfos != null ) {
            var siteInfoComps = this.props.siteInfos.map(function(info, index) {
                return (
                    <SiteInfo key={index} info={info} />
                );
            });
        }
        return (
            <div>
                {siteInfoComps}
            </div>
        );
    }
});

var SiteInfo = React.createClass({
    render: function() {
        if (this.props.info != null) {
            var infoUrl = <InfoItem name={this.props.info.siteid}
                value={this.props.info.url} />
        }
        return(
            <table className="info_table">
                <tbody>
                    {infoUrl}
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


ReactDOM.render(
    <SiteInfoQuery url="http://10.81.39.58/get_site_url_or_mainid?mainid=" />,
    document.getElementById("siteInfoQuery")
);
