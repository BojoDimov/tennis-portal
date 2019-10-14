import React from 'react';

import QueryService from '../services/query.service';

export default class ThumbnailOrDefault extends React.Component {
  render() {
    let style = { borderRadius: '5px', height: '150px', width: '150px', ...this.props.style };
    let src = this.props.fileId ? QueryService.getFileUrl(this.props.fileId) : this.props.default;

    return <img src={src} style={style} />;
  }
}