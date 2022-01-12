import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default class ShowPoi extends Component {

  constructor(props) {
    super(props)

    this.onChangePoiName = this.onChangePoiName.bind(this);
    this.onChangePoiEmail = this.onChangePoiEmail.bind(this);
      this.onChangePoiOrario = this.onChangePoiOrario.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // State
    this.state = {
      name: '',
      email: '',
     orario: ''
    }
  }

  componentDidMount() {

    if (!this.props.auth.isAuthenticated) {
        this.props.history.push("/login");
      
      }

    axios.get('http://localhost:5000/pois' + this.props.match.params.id)
      .then(res => {
        this.setState({
          name: res.data.name,
          email: res.data.email,
          orario: res.data.orario
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  onChangePoiName(e) {
    this.setState({ name: e.target.value })
  }

  onChangePoiEmail(e) {
    this.setState({ email: e.target.value })
  }

 onChangePoiOrario(e) {
   this.setState({ orario: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()

    const poiObject = {
      name: this.state.name,
      email: this.state.email,
      orario: this.state.orario
    };

    axios.put('http://localhost:5000/pois' + this.props.match.params.id, poiObject)
      .then((res) => {
        console.log(res.data)
        console.log('Poi successfully updated')
      }).catch((error) => {
        console.log(error)
      })

    // Redirect to Poi List 
    //this.props.history.push('/poi-list')
  }

componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
  }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
      };
    

  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="Name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={this.state.name} onChange={this.onChangePoiName} />
        </Form.Group>

        <Form.Group controlId="Email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={this.state.email} onChange={this.onChangePoiEmail} />
        </Form.Group>

        <Form.Group controlId="Name">
          <Form.Label>Orario</Form.Label>
          <Form.Control type="text" value={this.state.orario} onChange={this.onChangePoiOrario} />
        </Form.Group>

        <Button variant="danger" size="lg" block="block" type="submit">
          Modifica POI
        </Button>
      </Form>
    </div>);
  }
}