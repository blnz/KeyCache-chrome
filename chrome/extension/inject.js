import React, { Component } from 'react';
import { render } from 'react-dom';
import Dock from 'react-dock';

//
// inserts an iframe with the KeyCache UI
//
export default class InjectApp extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false };
  }

  buttonOnClick = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  iaStyle = {
    position: "absolute",
    top: 0,
    right: 0
  }
  render() {
    return (
        <div style={this.iaStyle} >
        <button onClick={this.buttonOnClick}>
          KeyCache
        </button>
        <Dock
          position="right"
          dimMode="transparent"
          defaultSize={0.4}
          isVisible={this.state.isVisible}
        >
          <iframe
            style={{
              width: '100%',
              height: '100%',
            }}
            frameBorder={0}
            allowTransparency="true"
            src={chrome.extension.getURL(`inject.html?protocol=${location.protocol}`)}
          />
        </Dock>
      </div>
    );
  }
}

// window.addEventListener('load', () => {
//   const injectDOM = document.createElement('div');
//   injectDOM.className = 'inject-keycache';
//   injectDOM.style.textAlign = 'center';
//   document.body.appendChild(injectDOM);
//   render(<InjectApp />, injectDOM);
// });
