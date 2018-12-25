import React from 'react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class SchemeDetails extends React.Component {
  render() {
    const { scheme } = this.props;

    return (
      <Card {...this.props.CardProps}>
        <CardContent>
          <Typography variant="headline">{scheme.name}</Typography>
          <Typography variant="caption">{scheme.info}</Typography>
          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <Typography
              variant="caption"
              style={{ paddingRight: '1rem' }}
            >
              Регистрация от
              <Typography>
                {moment(scheme.registrationStart).format('DD.MM.YYYY')}
              </Typography>
            </Typography>
            <Typography
              variant="caption"
              style={{ paddingRight: '1rem' }}
            >
              Регистрация до
              <Typography>
                {moment(scheme.registrationEnd).format('DD.MM.YYYY')}
              </Typography>
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default SchemeDetails;