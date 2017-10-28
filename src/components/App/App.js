import React from 'react';
import logo from '../../logo.svg';
import styles from './App.scss';

import Header from './../Header/Header'
import Grid from './../Grid/Grid'

import { API_KEY, API_URL } from '../../config-key.js'

// class App extends Component {
//   render() {
//     return (
//       <div className={styles.app}>
//         <header className={styles.header}>
//           <img src={logo} className={styles.logo} alt="logo" />
//           <h1 className="App-title">Art Scramble</h1>
//         </header>
//         <p className={styles.intro}>
//           This App.js file's styles comes from importing App.scss. Using CSS Modules, the styles are scoped locally to this App component.
//           { API_KEY } and {API_URL}
//         </p>
//       </div>
//     );
//   }
// }
class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Grid />
      </div>
    );
  }
}

export default App;
