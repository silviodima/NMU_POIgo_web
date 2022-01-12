import React, { Component } from "react";
import Table from 'react-bootstrap/Table';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PoiTableRow from './PoiTableRow';
import { showPois } from "../../actions/showPoi";



class PoiList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      poi: []
    };
  }

  componentDidMount() {
    // axios.get('http://localhost:5000/pois')
    //   .then(res => {
    //     this.setState({
    //       poi: res.data
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    this.props.showPois();
  }

  DataTable() {
    return this.state.poi.map((res, i) => {
      return <PoiTableRow obj={res} key={i} />;
    });
  }


  render() {
    return (<div className="table-wrapper">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Orario</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.DataTable()}
        </tbody>
      </Table>
    </div>);
  }
}

PoiList.propTypes = {
  showPois: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  // errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  // errors: state.errors
});

export default connect(
  mapStateToProps,
  { showPois }
)(withRouter(PoiList));