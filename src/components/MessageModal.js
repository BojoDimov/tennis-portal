import React from 'react';
import FormModal from './FormModal';
import Button from '@material-ui/core/Button';

class MessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activation != this.props.activation && this.props.activation)
      this.show();
  }

  show() {
    this.setState({ open: true });
    setTimeout(() => this.setState({ open: false }), 10 * 1000);
  }

  render() {
    const { open } = this.state;

    const closeBtn = <Button
      variant="outlined"
      onClick={() => this.setState({ open: false })}
    >
      Добре
    </Button>;

    if (open)
      return <FormModal
        title={null}
        body={this.props.children}
        actions={closeBtn}
        onClose={() => this.setState({ open: false })}
      />;
    else
      return null;
  }
}

export default MessageModal;