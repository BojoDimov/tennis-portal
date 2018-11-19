import React from 'react';
import { EnumLocalization } from '../enums';

class L10n extends React.Component {
  render() {
    const { children, type, translate, style } = this.props;
    return <span style={style}>{l10n_text(children, type, translate)}</span>
  }
}

export function l10n_text(value, type, translate) {
  const l10n = EnumLocalization[translate];
  //const l10key = Object.keys(type).find(key => type[key] === value);
  //return l10n[l10key];
  return l10n[value];
}

export default L10n;