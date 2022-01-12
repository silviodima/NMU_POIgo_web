import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import PoiTableRow from './PoiTableRow';


export default class PoiList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      poi: []
    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/pois')
      .then(res => {
        this.setState({
          poi: res.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
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