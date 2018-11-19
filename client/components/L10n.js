import React from 'react';
import { EnumLocalization } from '../enums';

class L10n extends React.Component {
  render() {
    const { children, translate, style } = this.props;
    return <span style={style}>{l10n_text(children, translate)}</span>
  }
}

export function l10n_text(value, translate) {
  const l10n = EnumLocalization[translate];
  return l10n[value];
}

export default L10n;