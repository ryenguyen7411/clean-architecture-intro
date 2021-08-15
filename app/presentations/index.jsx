import cx from 'classnames';
import React from 'infra/renderer';

export default function App (props) {
  return (
    <div id="screen" className={cx('screen')}>
      {props.children}
    </div>
  );
}
