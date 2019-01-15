import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class NotFoundPage extends React.Component {
  render() {
    return (
      <div className="container">
        <Paper style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography color="secondary" variant="headline">
            Страницата която търсите вече не съществува :(
      </Typography>
        </Paper>

      </div>
    );
  }
}

export default NotFoundPage;