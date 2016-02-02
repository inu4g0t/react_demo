    var StudentInfoQuery = React.createClass({
    handleClick: function() {
        /*
        var mainid = $('#cons_input').val();
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
                this.setState({studentInfos: data, queryed: true});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        */
        var allStudentInfos = [
            {name : 'zhangsan', year : '2015'},
            {name : 'lisi', year : '2015'}
        ];
        this.setState({studentInfos: allStudentInfos, queryed: true});
    },
    getInitialState: function() {
        return {studentInfos: {}, queryed: false};
    },
    render: function() {
        var divRowStyle = {
            marginTop: 20
        };
        var showInfo;
        if (this.state.studentInfos.length > 0) {
            showInfo = <StudentInfos studentInfos={this.state.studentInfos} />
        } else if (this.state.queryed) {
            showInfo = <ShowError errorMsg="未找到记录"/>
        }
        return (
            <div>
                <div className="row" style={divRowStyle}>
                    <div className="col-lg-8">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Please enter query constraints" id="cons_input" />
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

var StudentInfos = React.createClass({
    render: function() {
        if (this.props.studentInfos != null ) {
            var studentInfoComps = this.props.studentInfos.map(function(info, index) {
                return (
                    <StudentInfo key={index} info={info} />
                );
            });
        }
        return (
            <table className="table">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Year</th>
                    </tr>

                    {studentInfoComps}
                </tbody>
            </table>
        );
    }
});

var StudentInfo = React.createClass({
    render: function() {
        console.log(this.props.info);
        if (this.props.info != null) {
            var infoStudent = <InfoItem name={this.props.info.name}
                year={this.props.info.year} />
        }
        return(
            <div>
                {infoStudent}
            </div>
        );
    }
});

var InfoItem = React.createClass({
    render: function() {
        return(
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.year}</td>
            </tr>
        );
    }
});


ReactDOM.render(
//    <StudentInfoQuery url="http://10.81.39.58/get_site_url_or_mainid?mainid=" />,
    <StudentInfoQuery />,
    document.getElementById("studentInfoQuery")
);
