import React from 'react';
import { EnumLocalization } from '../enums';

class L10n extends React.Component {
  render() {
    const { children, type, translate, style } = this.props;
    const l10n = EnumLocalization[translate];
    const l10key = Object.keys(type).find(key => type[key] === children);
    return <span style={style}>{l10n[l10key]}</span>
  }
}

export default L10n;