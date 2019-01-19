import React from 'react';
import Typography from '@material-ui/core/Typography';
import PhotoIcon from '@material-ui/icons/Photo';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import FileUpload from './FileUpload';
import QueryService from '../services/query.service';

class ImageField extends React.Component {
  render() {
    const { value, onChange, style, imageStyle } = this.props;
    return (
      <span style={style}>
        <input ref={ref => this.inputRef = ref} onChange={onChange} type="file" style={{ display: 'none' }} />
        {value
          && <Typography>{value.name}</Typography>}
        {value
          && <img
            src={QueryService.getFileUrl(value.id)}
            style={imageStyle}
          />}
        <div>
          <PhotoIcon
            onClick={() => this.inputRef.click()}
            style={{ fontSize: '2rem', cursor: 'pointer' }}
            color="primary"
          />
          {value
            && <DeleteForeverIcon
              style={{ fontSize: '2rem', cursor: 'pointer' }}
              color="secondary"
              onClick={() => onChange(null)}
            />}
        </div>
      </span>
    );
  }
}

export default ImageField;
