import React, { Component } from 'react';
import logo from '../../logo.svg';
import styles from './App.scss';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <img src={logo} className={styles.logo} alt="logo" />
          <h1 className="App-title">Welcome to React with SCSS and CSS Modules</h1>
        </header>
        <p className={styles.intro}>
          This App.js file's styles comes from importing App.scss. Using CSS Modules, the styles are scoped locally to this App component.
        </p>
      </div>
    );
  }
}

export default App;
