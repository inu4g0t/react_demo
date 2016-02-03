var ClassSchedule = React.createClass({
    handleSave: function(newElem) {
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
        /*
        console.log(newElem);
        console.log(this.state.classMatrix[newElem.rowIdx][newElem.colIdx])
        */
        var curElem = this.state.classMatrix[newElem.rowIdx][newElem.colIdx];
        if (curElem.span === newElem.span) {
            this.state.classMatrix[newElem.rowIdx][newElem.colIdx].classId = newElem.classId;
        } else if (curElem.span > newElem.span) {
            var elemEmpty = {classId: '', span: 1};
            for (var i = newElem.rowIdx + curElem.span - 1;
                    i > newElem.rowIdx + newElem.span - 1; i--) {
                this.state.classMatrix[i][newElem.colIdx] = elemEmpty;
            }
            curElem.classId = newElem.classId;
            curElem.span = newElem.span ;
        } else {
            var canExpand = true;
            for (var i = newElem.rowIdx + newElem.span - 1;
                    i > newElem.rowIdx + curElem.span - 1; i--) {
                if (this.state.classMatrix[i][newElem.colIdx].classId !== '') {
                    canExpand = false;
                }
            }
            var elemNull = {classId: null, span: 0};
            if (canExpand) {
                for (var i = newElem.rowIdx + newElem.span - 1;
                        i > newElem.rowIdx + curElem.span - 1; i--) {
                    this.state.classMatrix[i][newElem.colIdx] = elemNull;
                }
                curElem.classId = newElem.classId;
                curElem.span = newElem.span ;
            }
        }
        // Force set
        this.setState({classMatrix: this.state.classMatrix});
    },
    getInitialState: function() {
        var allClasses = [
            [{classId: 'english', span: 2}, {classId: '', span: 1}],
            [{classId: null, span: 0}, {classId: '', span: 1}],
            [{classId: '', span: 1}, {classId: 'math', span: 2}],
            [{classId: '', span: 1}, {classId: null, span: 0}],
        ];
        return {classMatrix: allClasses};
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
                        <ClassCalender classMatrix={this.state.classMatrix}
                          saveHandleFuntion={this.handleSave}/>
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
        var handleSave = this.props.saveHandleFuntion;
        if (this.props.classMatrix != null ) {
            var daySchedules = this.props.classMatrix.map(function(day, index) {
                return (
                    <DaySchedule key={index} day={day} rowIndex={index}
                      saveHandleFuntion={handleSave}/>
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
        var handleSave = this.props.saveHandleFuntion;
        var rowIndex = this.props.rowIndex;
        if (this.props.day != null ) {
            var classElems = this.props.day.map(function(elem, index) {
                if (elem === null || elem.span === null
                    || elem.classId === null || elem.span === 0) {
                        return null;
                }
                elem.rowIndex = rowIndex;
                elem.columnIndex = index;
                return (
                    <ClassElem key={index} elem={elem}
                        saveHandleFuntion={handleSave}/>
                );
            });
        }
        return (
            <tr>
                <th>{this.props.rowIndex + 1}</th>
                {classElems}
            </tr>
        );
    }
});

var ClassElem = React.createClass({
    handleClick: function() {
        this.setState({editing: true});
    },
    cancelClick: function() {
        this.setState({editing: false});
    },
    saveClick: function() {
        var rowIdx = this.props.elem.rowIndex;
        var colIdx = this.props.elem.columnIndex;
        var input_id_base = rowIdx + '_' + colIdx;
        var input_id_class_id = '#' + input_id_base + '_' + 'class_id_input';
        var input_id_span = '#' + input_id_base + '_' + 'span_input';
        var newElem = {};
        newElem.rowIdx = rowIdx;
        newElem.colIdx = colIdx;
        newElem.classId = $(input_id_class_id).val();
        newElem.span = parseInt($(input_id_span).val());
        this.props.saveHandleFuntion(newElem);
        this.setState({editing: false});
    },
    getInitialState: function() {
        return {editing: false};
    },
    render: function() {
        if (this.state.editing) {
            return (
                <ClassEditingElem
                elem={this.props.elem}
                saveClick={this.saveClick}
                cancelClick={this.cancelClick} />
            );
        } else {
            return (
                <ClassShowElem
                elem={this.props.elem}
                handleClick={this.handleClick} />
            );
        }
    }
});

var ClassEditingElem = React.createClass({
    render: function() {
        var input_id_base = this.props.elem.rowIndex + '_' +  this.props.elem.columnIndex;
        var input_id_class_id = input_id_base + '_' + 'class_id_input';
        var input_id_span = input_id_base + '_' + 'span_input';
        return (
            <td rowSpan={this.props.elem.span}>
                <div className="input-group">
                    <p>ClassName</p>
                    <input type="text" className="form-control"
                        placeholder={this.props.elem.classId} aria-describedby="basic-addon2"
                        id={input_id_class_id}>
                    </input>
                    <p>Class Time Span</p>
                    <input type="text" className="form-control"
                        placeholder={this.props.elem.span} aria-describedby="basic-addon2"
                        id={input_id_span}>
                    </input>
                </div>
                <span className="input-group-btn">
                    <button className="btn btn-default" type="button"
                        onClick={this.props.saveClick}>Save</button>
                </span>
                <span className="input-group-btn">
                    <button className="btn btn-default" type="button"
                        onClick={this.props.cancelClick}>Cancel</button>
                </span>
            </td>
        );

    }
});

var ClassShowElem = React.createClass({
    render: function() {
        return (
            <td rowSpan={this.props.elem.span}
                onClick={this.props.handleClick}>
                {this.props.elem.classId}
            </td>
        );

    }
});

ReactDOM.render(
    //    <ClassSchedule url="http://10.81.39.58/get_site_url_or_mainid?mainid=" />,
    <ClassSchedule />,
    document.getElementById("classSchedule")
);
