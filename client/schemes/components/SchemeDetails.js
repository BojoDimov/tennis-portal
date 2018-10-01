import React from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class SchemeDetails extends React.Component {
  render() {
    const { scheme } = this.props;

    return (
      <Card>
        <CardContent>
          <Typography variant="headline">{scheme.name}</Typography>
          <Typography variant="caption">{scheme.info}</Typography>
          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <Typography variant="subheading" style={{ paddingRight: '1rem' }}>Регистрация от
              <Typography>{new Date(scheme.registrationStart).toLocaleDateString()}</Typography>
            </Typography>
            <Typography variant="subheading" style={{ paddingRight: '1rem' }}>Регистрация до
              <Typography>{new Date(scheme.registrationStart).toLocaleDateString()}</Typography>
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default SchemeDetails;