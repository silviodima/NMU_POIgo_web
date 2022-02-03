import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";


class Redirect extends Component {

onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
    };

componentDidMount() {
    // If user navigates to dashboard and token expires, should redirect user to login page
    if (!this.props.auth.isAuthenticated) {
        this.props.history.push("/login");   
    }
}

  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
          <img src={require("../layout/success.png")} alt="Successo"  width="800px" height="750px" />
            <h4>
              <b>POI INSERITO</b>
            </h4>
            <br />
            <div className="col s6">
              <Link
                to="/dashboard"
                style={{
                  width: "250px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Inserisci altri POI
              </Link>
            </div>
            <div className="col s6">
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Redirect.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

export default connect(
    mapStateToProps,
    { logoutUser }
)(withRouter(Redirect));
  
  
