import React from 'react';
import moment from 'moment-timezone';
import HeatIcon from './icons/HeatIcon';
import SnowIcon from './icons/SnowIcon';

const SeasonIcon = ({ date, height, width }) => {
  let month = moment(date).month();
  if (month > 3 && month < 9)
    return <HeatIcon width={width || '25px'} height={height || '25px'} />;
  else
    return <SnowIcon width={width || '25px'} height={height || '25px'} />;
}

export default SeasonIcon;