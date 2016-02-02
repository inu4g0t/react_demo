var ClassSchedule = React.createClass({
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
        var allClasses = [
            [{classId: 'math', span: 2}, {classId: 'empty', span: 1}],
            [{classId: null, span: 0}, {classId: 'empty', span: 1}],
            [{classId: 'empty', span: 1}, {classId: 'english', span: 2}],
            [{classId: 'empty', span: 1}, {classId: null, span: 0}],
        ];
        this.setState({classMatrix: allClasses, editing: null});
    },
    getInitialState: function() {
        var allClasses = [
            [{classId: 'english', span: 2}, {classId: 'empty', span: 1}],
            [{classId: null, span: 0}, {classId: 'empty', span: 1}],
            [{classId: 'empty', span: 1}, {classId: 'math', span: 2}],
            [{classId: 'empty', span: 1}, {classId: null, span: 0}],
        ];
        return {classMatrix: allClasses, editing: false, handleFuntion: this.handleClick};
    },
    render: function() {
        var divRowStyle = {
            marginTop: 20
        };
        var showInfo;
        return (
            <div>
                <div className="row" style={divRowStyle}>
                    <div className="col-lg-8">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Please enter query constraints" id="cons_input" />
                            <span className="input-group-btn">
                                <button className="btn btn-default" type="button" onClick={this.handleClick} >Go!</button>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row" style={divRowStyle}>
                    <div className="col-lg-8">
                        <ClassCalender classMatrix={this.state.classMatrix} />
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

var ClassCalender = React.createClass({
    render: function() {
        if (this.props.classMatrix != null ) {
            var daySchedules = this.props.classMatrix.map(function(day, index) {
                return (
                    <DaySchedule key={index} day={day} />
                );
            });
        }
        return (
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                    </tr>
                    {daySchedules}
                </tbody>
            </table>
        );
    }
});

var DaySchedule = React.createClass({
    render: function() {
        if (this.props.day != null ) {
            var classElems = this.props.day.map(function(elem, index) {
                if (elem === null || elem.span === null
                    || elem.classId === null || elem.span === 0) {
                        return null;
                    }
                    return (
                        <ClassElem key={index} elem={elem} />
                    );
                });
            }
            return (
                <tr>
                    <th>{this.props.key}</th>
                    {classElems}
                </tr>
            );
        }
    });

    var ClassElem = React.createClass({
        render: function() {
            return (
                <td rowSpan={this.props.elem.span}>{this.props.elem.classId} </td>
            );

        }
    });

    ReactDOM.render(
        //    <ClassSchedule url="http://10.81.39.58/get_site_url_or_mainid?mainid=" />,
        <ClassSchedule />,
        document.getElementById("classSchedule")
    );
