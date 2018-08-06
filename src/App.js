import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';

const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {}
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (user) => {
    this.setState({
      user: user
    });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFaces.map((clarifaiFace) => {
      const boundingBox = clarifaiFace.region_info.bounding_box;
      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - (boundingBox.right_col * width),
        bottomRow: height - (boundingBox.bottom_row * height)
      };
    });
  }

  displayFaceBox = (boxes) => {
    this.setState({
      boxes: boxes
    });
  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value
    });
  }

  onButtonSubmit = () => {
    this.setState({
      imageUrl: this.state.input
    });

    fetch(`${process.env.REACT_APP_API_BASE_URL}/imageurl`, {
      method:'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/image`, {
          method:'put',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: this.state.user.id,
            entries: response.outputs[0].data.regions.length
          })
        }).then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {
              entries: count
            }));
          })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    } else if(route === 'home') {
      this.setState({isSignedIn: true});
      this.setState({route: route});
    } else {
      this.setState({route: route});
    }
  }

  render() {
    return (
      <div className="App">
        <Particles
          className='particles'
          params={particleOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home'
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageUrl={this.state.imageUrl} boxes={this.state.boxes} />
         </div>
        : (
          this.state.route === 'signin'
          ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        )
        }
        
      </div>
    );
  }
}

export default App;
