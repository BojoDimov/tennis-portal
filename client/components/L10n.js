import React from 'react';
import * as Enums from '../enums';

class L10n extends React.Component {
  render() {
    const { children, type } = this.props;
    const l10n = Enums.EnumLocalization[type];
    const l10key = Object.keys(Enums[type]).find(key => Enums[type][key] === children);
    return <span>{l10n[l10key]}</span>
  }
}

export default L10n;