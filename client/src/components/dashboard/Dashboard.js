import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPOI } from "../../actions/insertPOI";
import { logoutUser } from "../../actions/authActions";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import {DropdownButton, Dropdown} from 'react-bootstrap'


class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      poi_name: "",
      photo: "",
      description: "",
      opening_hours: "",
      email: "",
      partita_iva: "",
      tel_number: "",
      is_Validate: "",
      latitude: "",
      longitude: "",
      sections: "",
      errors: {}
    };
  }

  UNSAFE_componentDidMount() {
    // If user navigates to dashboard and token expires, should redirect user to login page
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

    
    const newPOI = {
      poi_name: this.state.poi_name,
      photo: "",
      description: this.state.description,
      opening_hours: this.state.opening_hours,
      activity: {
        email: this.state.email,
        partita_iva: this.state.partita_iva,
        tel_number: this.state.tel_number
      },
      is_Validate: true,
      location : {
        type : 'Point',
        coordinates : [ this.state.latitude,  this.state.longitude]
      },
      sections: {

      }
    };

    this.props.addPOI(newPOI, this.props.history);
    console.log(newPOI);
    };


  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    const { errors } = this.state;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                You are logged into {" "}
                <span style={{ fontFamily: "monospace" }}>POIGO</span>👏
              </p>
            </h4>
            <form onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.poi_name}
                  error={errors.poi_name}
                  id="poi_name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.poi_name
                  })}
                />
                <label htmlFor="poi_name">Nome POI</label>
                <span className="red-text">{errors.poi_name}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.description}
                  error={errors.description}
                  id="description"
                  type="text"
                  className={classnames("", {
                    invalid: errors.description
                  })}
                />
                <label htmlFor="description">Descrizione</label>
                <span className="red-text">{errors.description}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.opening_hours}
                  error={errors.opening_hours}
                  id="opening_hours"
                  type="text"
                  className={classnames("", {
                    invalid: errors.opening_hours
                  })}
                />
                <label htmlFor="text">Orario di apertura</label>
                <span className="red-text">{errors.opening_hours}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.partita_iva}
                  error={errors.partita_iva}
                  id="partita_iva"
                  type="text"
                  className={classnames("", {
                    invalid: errors.partita_iva
                  })}
                />
                <label htmlFor="password2">Partita Iva</label>
                <span className="red-text">{errors.partita_iva}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.tel_number}
                  error={errors.tel_number}
                  id="tel_number"
                  type="number"
                  className={classnames("", {
                    invalid: errors.tel_number
                  })}
                />
                <label htmlFor="password2">Numero di telefono</label>
                <span className="red-text">{errors.tel_number}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.latitude}
                  error={errors.latitude}
                  id="latitude"
                  type="number"
                  className={classnames("", {
                    invalid: errors.latitude
                  })}
                />
                <label htmlFor="latitude">Latitudine</label>
                <span className="red-text">{errors.latitude}</span>
              </div>
              <div>
<select id = "dropdown">
    <option value="N/A">N/A</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
</select>          
</div>
    <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.longitude}
                  error={errors.longitude}
                  id="longitude"
                  type="number"
                  className={classnames("", {
                    invalid: errors.longitude
                  })}
                />
                <label htmlFor="longitude">Longitudine</label>
                <span className="red-text">{errors.longitude}</span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Inserisci
                </button>
              </div>
            </form>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  addPOI: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addPOI, logoutUser }
)(withRouter(Dashboard));


