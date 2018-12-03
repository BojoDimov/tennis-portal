import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import PhotoIcon from '@material-ui/icons/Photo';

class FileUpload extends React.Component {
  render() {
    const { value, onChange, style } = this.props;

    return (
      <span onClick={e => this.inputRef.click()} style={style}>
        <input ref={ref => this.inputRef = ref} onChange={onChange} type="file" style={{ display: 'none' }} />
        {this.props.children}
      </span>
    );
  }
}

export default FileUpload