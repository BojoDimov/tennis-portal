import React from 'react';
import Button from '@material-ui/core/Button';

import ConfirmationDialog from '../../components/ConfirmationDialog';

export default function generateActions(onChange, onRemove) {
  return class extends React.Component {
    render() {
      const { edition } = this.props;

      return (
        <span>
          <Button onClick={onChange(edition)}>
            Редакция
        </Button>
          <Button onClick={onRemove(edition)}>
            Изтриване
        </Button>
        </span>
      );
    }
  }
}