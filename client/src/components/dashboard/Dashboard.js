import { Component} from "react";
import * as React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPOI, getCategories } from "../../actions/insertPOI";
import { logoutUser } from "../../actions/authActions";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


const mapCategories = {
  "Arte" : ["Beni architettonici", "Monumenti" ],
  "Cultura": ["Museo", "Mostra", "Monumenti"],
  "Cucina": ["Pizzerie", "Paninoteche"],
  "Shopping": ["Abbigliamento", "Scarpe"]};

const mapSubcategories = {
  "Beni architettonici" : ["Ville e castelli", "Chiese antiche"],
  "Monumenti": ["Monasteri e conventi", "Chiese rurali"]
}


const Results = () => (
  <div id="results" className="search-results">
    Some Results
  </div>
)


//1st capital letter needed!!
function CategoriesAndCo(props) {
  let items = [];

  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

class Dashboard extends Component {
  
  constructor() {
    super();
    this.beniCulturaliBtn = React.createRef();
    
    this.state = {
      showResults: false,
      poi_name: "",
      photo: "",
      description: "",
      opening_hours: "",
      email: "",
      partita_iva: "",
      tel_number: "",
      is_Validate: "",
      categories : [],
      subCategories: [],
      clickedSubCategories: [],
      sections: [],
      clickedSections: [],
      latitude: "",
      longitude: "",
      sections: "",
      errors: {}
    };
  }

  
  componentDidMount() {
    // If user navigates to dashboard and token expires, should redirect user to login page
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    
    }

    //Let's take all categories from db when user navigates to this page
    // const fetched_categories = this.props.getCategories();
    // console.log(fetched_categories)
    // console.log("OH")
    // fetch("/api/categories")
    // .then((response) => {
    //   return response.json();
    // })
    // .then(data => {
    //   let categoriesFromApi = data.map(category => {
    //     return {value: category, display: category}
    //   });
    //   this.setState({
    //     categories: [{value: '', display: '(Select your favourite team)'}].concat(categoriesFromApi)
    //   });
    // }).catch(error => {
    //   console.log(error);
    // });
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
      categories: this.state.categories,
      subCategories: this.state.subCategories,
      sections: this.state.sections,
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


    
  handleCategories = (event, value) => {
    // categories = this.setState({
    //   categories : value
    // })
    // if(!this.state.categories.includes(value[0])) {
    //   this.state.categories.push(value[0])
    //   console.log("aggiunto")
    // }
    // else {
    //   const index = this.state.categories.indexOf(value[0])
    //   this.state.categories.splice(index, 1)
    // }
    // this.setState({
    //   categories : value
    // })

    // // console.log("OH"+value)
    // let lista = Array.from(value)
    // console.log(value)
    // let node = this.beniCulturaliBtn.current;
  
    // if((lista.includes("Shopping"))){
    //   console.log(node.disabled)
    //   node.disabled=true;
    //   console.log(node.disabled)
    //   node.onClick={}
    // }
    // else node.disabled=false;
    this.setState({
      categories: value,
      // subCategories: mapCategories[categories]
    })
    // console.log(this.state.categories)
    let supportSubcategories = []
    for (let i = 0; i < value.length; i++) {
      supportSubcategories = supportSubcategories.concat(mapCategories[value[i]])
    }
    let uniq = [...new Set(supportSubcategories)];
    // console.log(uniq)

    this.setState({
      subCategories: uniq
    })
  };

  handleSubCategories = (event, value) => {
    // this.setState({
    //   subCategories : value
    // })
    console.log(value)
    this.setState({
      clickedSubCategories : value
    })

    let supportSections = []
    for (let i = 0; i < value.length; i++) {
      supportSections = supportSections.concat(mapSubcategories[value[i]])
    }
    let uniq = [...new Set(supportSections)];
    // console.log(uniq)

    this.setState({
      sections: uniq
    })
  };

  handleSections = (event, value) => {
    // console.log(value)
    this.setState({
      clickedSections : value
    })
  }

  handlePhoto = () => {
    
  }


  render() {
    const { user } = this.props.auth;
    const { errors } = this.state;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper"  style={{overflowY:'scroll'}}>
        <div className="row">
          <div className="landing-copy col s12 center-align" >
            <h4>

              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                You are logged into {" "}
                <span style={{ fontFamily: "monospace" }}>POIGO</span>👏
              </p>
            </h4>
            <form onSubmit={this.onSubmit} >
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
              <input 
                type="file" 
                accept=".png, .jpg, .jpeg"
                name="photo"
                onChange={this.handlePhoto}
              >
              </input>
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
              
              <CategoriesAndCo numTimes={Object.keys(mapCategories).length}> 
                {(index) => (
                <ToggleButtonGroup
                  value={this.state.categories}
                  onChange={this.handleCategories}
                  color="primary"
                  style={{
                    paddingTop: 30,
                  }}>
                  <ToggleButton 
                                value={Object.keys(mapCategories)[index]} 
                                id={index}>{Object.keys(mapCategories)[index]}
                  </ToggleButton>
                </ToggleButtonGroup>
                )}
              </CategoriesAndCo>
              {"\n"}
              <CategoriesAndCo numTimes={this.state.subCategories.length}> 
                {(index) => (
                <ToggleButtonGroup
                  value={this.state.clickedSubCategories}
                  onChange={this.handleSubCategories}
                  color="primary"
                  style={{
                    paddingTop: 30,
                  }}>
                  <ToggleButton 
                          value={this.state.subCategories[index]} 
                          id={index}>{this.state.subCategories[index]}
                  </ToggleButton>
                </ToggleButtonGroup>
                )}
              </CategoriesAndCo>
              {"\n"}
              <CategoriesAndCo numTimes={this.state.sections.length}> 
                {(index) => (
                <ToggleButtonGroup
                  value={this.state.clickedSections}
                  onChange={this.handleSections}
                  color="primary"
                  style={{
                    paddingTop: 30,
                  }}>
                  <ToggleButton 
                          value={this.state.sections[index]} 
                          id={index}>{this.state.sections[index]}
                  </ToggleButton>
                </ToggleButtonGroup>
                )}
              </CategoriesAndCo>

              

              {/* <CategoriesAndCo numTimes={subCategories.length}> 
                {(index) => (
                <ToggleButtonGroup
                  value={this.state.categories}
                  onChange={this.handleCategories}
                  color="primary"
                  style={{
                    paddingTop: 30,
                  }}>
                  <ToggleButton 
                                value={subCategories[index]} 
                                key={index}>{subCategories[index]}
                  </ToggleButton>
                </ToggleButtonGroup>
                )}
              </CategoriesAndCo> */}

              {/* <ToggleButtonGroup  style={{
                  paddingTop: 30,
                }}>
              <CategoriesAndCo numTimes={subCategories.length}>
                {(index) => <ToggleButton key={index}>{subCategories[index]}</ToggleButton>}
              </CategoriesAndCo>
              </ToggleButtonGroup> */}


              {/* <ToggleButtonGroup
                value={this.state.categories}
                onChange={this.handleCategories}
                color="primary"
                >
                <ToggleButton value="Arte"id="Arte">
                  1
                </ToggleButton>
                <ToggleButton value="Cultura">
                  2
                </ToggleButton>
                <ToggleButton value="Shopping">
                  3
                </ToggleButton>
              </ToggleButtonGroup> */}
              {/* <ToggleButtonGroup
                style={{
                  paddingTop: 30,
                }}
                value={this.state.subCategories}
                onChange={this.handleSubCategories}
                color="primary"
                
                >
                <ToggleButton value="Beni architettonici" id="Beni_architettonici"  ref={this.beniCulturaliBtn} disabled>
                  Beni architettonici
                </ToggleButton>
                <ToggleButton value="Monumenti" id="Monumenti">
                  Monumenti
                </ToggleButton>
                <ToggleButton value="Cucina tipica" id="Cucina tipica">
                  Cucina tipica
                </ToggleButton>
                <ToggleButton value="Pizzerie" id="Pizzerie">
                  Pizzerie
                </ToggleButton>
                <ToggleButton value="Bar" id="Bar">
                  Bar
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
              </ToggleButtonGroup>*/}
              {/* <ToggleButtonGroup
                style={{
                  paddingTop: 30,
                }}
                value={this.state.subCategories}
                onChange={this.handleSubCategories}
                color="primary"
                
                >
                <ToggleButton value="Beni architettonici" id="Beni_architettonici" ref={this.beniCulturaliBtn} not disabled>
                  Beni architettonici
                </ToggleButton>
                <ToggleButton value="Monumenti" id="Monumenti">
                  Monumenti
                </ToggleButton>
                <ToggleButton value="Cucina tipica" id="Cucina tipica">
                  Cucina tipica
                </ToggleButton>
                <ToggleButton value="Pizzerie" id="Pizzerie">
                  Pizzerie
                </ToggleButton>
                <ToggleButton value="Bar" id="Bar">
                  Bar
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
                <ToggleButton value="" id="">
                  Shopping
                </ToggleButton>
              </ToggleButtonGroup>              */}
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
  getCategories: PropTypes.func.isRequired,
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
  { addPOI, getCategories, logoutUser }
)(withRouter(Dashboard));


