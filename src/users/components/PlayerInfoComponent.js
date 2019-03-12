import React from 'react';
import Typography from '@material-ui/core/Typography';
import { l10n_text } from '../../components/L10n';

class PlayerInfoComponent extends React.Component {
  render() {
    const { user, style } = this.props;
    return (
      <div style={style}>
        <Typography variant="caption">
          Играе от
          <Typography>{user.startedPlaying ? user.startedPlaying + 'г.' : 'няма'}</Typography>
        </Typography>

        <Typography variant="caption">
          Играе с
          <Typography>{l10n_text(user.playStyle, "PlayStyle") || 'няма'}</Typography>
        </Typography>

        <Typography variant="caption">
          Бекхенд
          <Typography>{l10n_text(user.backhandType, "BackhandType") || 'няма'}</Typography>
        </Typography>

        <Typography variant="caption">
          Любима настилка
          <Typography>{l10n_text(user.courtType, "CourtType") || 'няма'}</Typography>
        </Typography>
      </div>
    );
  }
}

export default PlayerInfoComponent;