import React from 'react';
import styles from './Header.scss';

//stateless functional component for Header view
const Header = () => {
  return (
    <div className={styles.headerContent}>
      <h1 className={styles.headline}>Art Scramble</h1>
      <p className={styles.subheader}>Unscramble the paintings of the Rijksmuseum.</p>
    </div>
  ) 
};

export default Header;
