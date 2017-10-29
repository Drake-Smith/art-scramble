import React  from 'react';
import styles from './Header.scss';

//stateless functional component for Header view
const Header = () => {
  return (
    <div className={styles.headerContent}>
      <h1 className={styles.headline}>Art Scramble</h1>
      <p className={styles.subheader}>Click on a tile and swap with another tile to unscramble the paintings of the Rijksmuseum.</p>
    </div>
  ) 
};

export default Header;
