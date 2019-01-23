import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReplyIcon from '@material-ui/icons/Reply';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { BracketStatus } from '../../enums';
class SchemeDetails extends React.Component {
  render() {
    const { scheme, enableEditionLink } = this.props;

    return (
      <Card {...this.props.CardProps}>
        <CardContent>
          <Typography variant="headline">{scheme.name}</Typography>
          <Typography variant="caption">{scheme.info}</Typography>

          {enableEditionLink && <Typography variant="caption" style={{ marginTop: '.5rem' }}>
            Турнир
            <Link to={`/editions/${scheme.editionId}`}>
              <Typography variant="body2">
                <ReplyIcon style={{ fontSize: '14px' }} />
                {scheme.edition.name}
              </Typography>
            </Link>
          </Typography>}

          <div style={{ display: 'flex', flexWrap: 'wrap', margin: '.5rem 0' }}>
            <Typography
              variant="caption"
              style={{ paddingRight: '1rem' }}
            >
              Регистрация от
              <Typography>
                {moment(scheme.registrationStart).format('DD.MM.YYYY / HH:mm')}
              </Typography>
            </Typography>
            <Typography
              variant="caption"
              style={{ paddingRight: '1rem' }}
            >
              Регистрация до
              <Typography>
                {moment(scheme.registrationEnd).format('DD.MM.YYYY / HH:mm')}
              </Typography>
            </Typography>
          </div>

          <Typography variant="caption">
            Описание
            <Typography>
              {getSchemeTraits(scheme)}
            </Typography>
          </Typography>
        </CardContent>
        <CardActions disableActionSpacing={true}>
          {this.props.actions}
        </CardActions>
      </Card>
    );
  }
}

function getSchemeTraits(scheme) {
  const traits = [];
  if (scheme.hasGroupPhase)
    traits.push('Групова фаза, елиминации');
  else
    traits.push('Елиминации');

  if (scheme.singleTeams)
    traits.push('сингъл');
  else
    traits.push('двойки');

  if (scheme.maleTeams)
    traits.push('мъже');

  if (scheme.femaleTeams)
    traits.push('жени');

  if (scheme.mixedTeams)
    traits.push('микс');

  if (scheme.ageFrom || scheme.ageTo) {
    const ageTrait = [];
    if (scheme.ageFrom)
      ageTrait.push(`от ${scheme.ageFrom}`);

    if (scheme.ageTo)
      ageTrait.push(`до ${scheme.ageTo}`);

    ageTrait.push('години');
    traits.push(ageTrait.join(' '));
  }

  return traits.join(', ');
}

export default SchemeDetails;