import cx from 'classnames';
import React from 'react';

export default function App (props) {
  return (
    <>
      <div id="screen" className={cx('screen')}>
        {props.children}
      </div>
    </>
  );
}
