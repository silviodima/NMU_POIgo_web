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
import isEmpty from "is-empty";


const dictCategories = {}
const sectionIDs = {}
const ids = []


const mapCategories = {
  "Arte e cultura" : ["Borgo storico Calopezzati", "Borgo storico Pietrapaola" ],
  "Cucina": ["Ristoranti", "Taverne", "Pizzerie", "Bracerie", "Cibo d'asporto", "Agriturismi"],
  "Shopping": ["Abbigliamento e calzature", "Gioiellerie e articoli da regalo", "Artigianato"],
  "Enogastronomia": ["Pasticcerie", "Degustazioni", "Enoteche", "Birrerie", "Cucina etnica", "Panetterie"],
  "Sport e tempo libero": ["Centri sportivi", "Caccia e pesca", "Abbigliamento e attrezzatura sportiva", "Escursionismo"]};

let dictSubcategories = {}

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
      selectedPhoto: "",
      photo: "",
      description: "",
      opening_hours: "",
      email: "",
      partita_iva: "",
      tel_number: "",
      is_Validate: "",
      categories : NaN,
      subCategories: NaN,
      clickedSubCategories: NaN,
      sections: NaN,
      clickedSections: NaN,
      latitude: "",
      longitude: "",
      address: "",
      createdBy: "",    
      errors: {}
    };
  }

  
  componentDidMount() {
    // If user navigates to dashboard and token expires, should redirect user to login page
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    
    }
    let subcategories = []
    let sections = []
    let i=0;
    let j=0;
    let k=0;
    let dictIDs = [];
    // Let's take all categories from db when user navigates to this page
    //with a top-level async await function
    (async () => {
      try {
        const fetched_categories = await this.props.getCategories();

        for (i=0;i<fetched_categories.length;i++) {
          subcategories = [];
          let currentCat = fetched_categories[i]['name'];
          // console.log("cat"+currentCat)
          dictCategories[currentCat] = {};
          for (j= 0; j<fetched_categories[i]['subcategories'].length;j++) {
            sections = [];
            dictIDs = [];
            let currentSubcat = fetched_categories[i]['subcategories'][j]['name']; 
            // console.log("subcat"+currentSubcat)
            subcategories.push(currentSubcat)
            dictSubcategories[currentSubcat] = {}
            sectionIDs[currentSubcat] = {}
            // dictCategories[fetched_categories[i]['name']].add(fetched_categories[i]['subcategories'][j]['name']);
            for(k=0; k<fetched_categories[i]['subcategories'][j]['sections'].length; k++) {
              let currentSect = fetched_categories[i]['subcategories'][j]['sections'][k]['name'];
              // console.log("sect"+currentSect)
              sections.push(currentSect)
              dictIDs[currentSect] = fetched_categories[i]['subcategories'][j]['sections'][k]['_id']
              // console.log("sect"+fetched_categories[i]['subcategories'][j]['sections'][k]['_id'])
            }
            // console.log(dictIDs)
            sectionIDs[currentSubcat] = dictIDs;
            dictSubcategories[currentSubcat] = sections;
            // console.log(sections)
            // dictSubcategories[currentSubcat] = sections
          }
          dictCategories[currentCat] = subcategories

        }
        // console.log(dictSubcategories)
        // console.log(sectionIDs)
        // console.log(mapCategories)
        // console.log(dictCategories)
        //   dictCategories[fetched_categories[i]['name']
        // console.log((fetched_categories[1]['name']))
        // console.log(mapCategories['Arte e cultura'])
      } catch (e) {
          // Deal with the fact the chain failed
      }
    })();
}


  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
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


    // console.log(this.state.photo)
    this.uploadImage(this.state.selectedPhoto)

  };

  uploadImage = (file) => {
    if(!file){
      const newPOI = {}
      this.props.addPOI(newPOI, this.props.history);
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.toCloudinary(reader.result)
    };
    reader.onerror = () => {
      console.error("ERROR DURING FILE LOADING")
    }
  }




  toCloudinary = async (base64EncodedImage) => {
    let url = "";
    let data = "";
    if(!this.state.categories || !this.state.clickedSubCategories || ids.length == 0) {
      const newPOI = {
        poi_name: this.state.poi_name,
        photo: "no photo",
        description: this.state.description,
        opening_hours: this.state.opening_hours,
        email: this.state.email,
        partita_iva: this.state.partita_iva,
        tel_number: this.state.tel_number,
        is_Validate: true,
        categories: this.state.categories,
        clickedSubCategories: this.state.clickedSubCategories,
        clickedSections: !isEmpty(ids)? ids: null,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        address: this.state.address,
        createdBy: this.props.auth["user"]["id"]
      };

      this.props.addPOI(newPOI, this.props.history);
      return;
    }
    
    try {
      url = await fetch('/api/upload/upload', {
        method: "POST",
        body: JSON.stringify({data: base64EncodedImage}),
        headers: {'Content-type': 'application/json'},
      })
      data = await url.json();
      // console.log(data["msg"])
      this.setState({
        photo: data["msg"]
      })

      const newPOI = {
        poi_name: this.state.poi_name,
        photo: this.state.photo,
        description: this.state.description,
        opening_hours: this.state.opening_hours,
        email: this.state.email,
        partita_iva: this.state.partita_iva,
        tel_number: this.state.tel_number,
        is_Validate: true,
        categories: this.state.categories,
        clickedSubCategories: this.state.clickedSubCategories,
        clickedSections: !isEmpty(ids)? ids: null,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        address: this.state.address,
        createdBy: this.props.auth["user"]["id"]
      };
  
      this.props.addPOI(newPOI, this.props.history);
      
    }
    catch(err) {
      console.error(err)
    }
  }


  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };


    
  handleCategories = (event, value) => {

    this.setState({
      categories: value,
    })
    // console.log(this.state.categories)
    let supportSubcategories = []
    for (let i = 0; i < value.length; i++) {
      supportSubcategories = supportSubcategories.concat(dictCategories[value[i]])
    }
    // console.log(supportSubcategories)
    let uniq = [...new Set(supportSubcategories)];
    // console.log(uniq)

    this.setState({
      subCategories: uniq
    })
  };

  handleSubCategories = (event, value) => {
    // console.log(value)
    this.setState({
      clickedSubCategories : value
    })

    // console.log(value)
    // console.log(dictSubcategories)
    let supportSections = []
    for (let i = 0; i < value.length; i++) {
      // console.log(dictSubcategories[value[i]])
      supportSections = supportSections.concat(dictSubcategories[value[i]])
    }
    let uniq = [...new Set(supportSections)];
    // console.log(uniq)

    this.setState({
      sections: uniq
    })
  };

  handleSections = (event, value) => {
    // console.log(value)
    // console.log(Object.values(sectionIDs["Borgo storico Pietrapaola"]))
    // console.log(this.state.clickedSubCategories)
    for (let i=0; i<this.state.clickedSubCategories.length; i++) {
      for (let j = 0; j<value.length; j++) {
        // console.log(sectionIDs[this.state.clickedSubCategories[i]][value[j]])
        if(sectionIDs[this.state.clickedSubCategories[i]][value[j]]!=undefined)
          ids.push(sectionIDs[this.state.clickedSubCategories[i]][value[j]])
      }
    }
    // console.log(sectionIDs)
    // console.log(ids);
    this.setState({
      clickedSections : value
    })
  }

  handlePhoto = (e) => {

    const file = e.target.files[0]
    // console.log(file)
    this.setState({
      selectedPhoto: file
    });
    // console.log(this.selectedPhoto)
  }


  render() {
    const { user } = this.props.auth;
    const { errors } = this.state;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper"  style={{overflowY:'scroll'}}>
        <div className="row">
          <div className="landing-copy col s12 center-align" >
            <h4>

              <b>Hey,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                Benvenuto su {" "}
                <span style={{ fontFamily: "monospace" }}>POIGO</span>👏
              </p>
            </h4>
            <form onSubmit={this.onSubmit} >
            <div className="input-field col s12">
                <input
                  value={user.id}
                  type="hidden"
                />
              </div>
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
                  required
                 />
                <label htmlFor="poi_name">Nome POI</label>
                <span className="red-text">{errors.poi_name}</span>
              </div>
              <div className="input-field col s12">
                <textarea
                  onChange={this.onChange}
                  value={this.state.description}
                  error={errors.description}
                  id="description"
                  type="text"
                  style={{height: "150px"}}
                  className={classnames("", {
                    invalid: errors.description
                  })}
                  required
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
                  required
                />
                <label htmlFor="text">Orario di apertura (Es. 9-12 14-18)</label>
                <span className="red-text">{errors.opening_hours}</span>
              </div>
              <div className="input-field col s12">
              <input 
                type="file" 
                accept=".png, .jpg, .jpeg"
                error={errors.photo}
                name="photo"
                onChange={this.handlePhoto}
                className={classnames("", {
                  invalid: errors.photo
                })}
                required
              >
              </input>
              <span className="red-text">{errors.photo}</span>
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
                  required
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
                  maxLength={11}
                  className={classnames("", {
                    invalid: errors.partita_iva
                  })}
                />
                <label htmlFor="partita_iva">Partita Iva (non obbligatoria)</label>
                <span className="red-text">{errors.partita_iva}</span>
              </div>
              <div className="input-field col s12">
                <input 
                  onChange={this.onChange}
                  value={this.state.tel_number}
                  error={errors.tel_number}
                  id="tel_number"
                  type="tel"
                  maxLength={10}
                  className={classnames("", {
                    invalid: errors.tel_number
                  })}
                  required
                />
                <label htmlFor="tel_number">Numero di telefono</label>
                <span className="red-text">{errors.tel_number}</span>
              </div>
              <div 
              style={{}}
              className={classnames("", {
                invalid: errors.categories
              })}
              >Scegli una o più categorie
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
                                key={index}>{Object.keys(mapCategories)[index]}
                  </ToggleButton>
                </ToggleButtonGroup>
                )}
              </CategoriesAndCo>
              <span className="red-text">{errors.categories}</span>

              {"\n"}
              <div style={{}} 
                className={classnames("", {
                invalid: errors.clickedSubCategories
              })}
              >
              Scegli una o più sottocategorie</div>
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
              <span className="red-text">{errors.clickedSubCategories}</span>
              {"\n"}
              <div 
                style={{}}
                className={classnames("", {
                  invalid: errors.clickedSections
                })}
                >Scegli una o più sezioni</div>
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
              <span className="red-text">{errors.clickedSections}</span>
              <div className="input-field col s12">
                <input 
                  onChange={this.onChange}
                  value={this.state.address}
                  error={errors.address}
                  id="address"
                  type="text"
                  className={classnames("", {
                    invalid: errors.address
                  })}
                  required
                />
                <label htmlFor="address">Indirizzo </label>
                <span className="red-text">{errors.address}</span>
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
                  required
                />
                <label htmlFor="latitude">Latitudine </label>
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
                  required
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


