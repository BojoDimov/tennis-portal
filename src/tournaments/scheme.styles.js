export default (theme) => ({
  root: {
    padding: '2em'
  },
  heading: {
    fontWeight: 700,
    fontSize: '1.3em'
  },
  info_bar_root: {
    display: 'flex',
    justifyContent: 'flex-start',
    color: theme.palette.primary.light,
    marginBottom: '1em',
    '& > *': {
      color: theme.palette.primary.light,
      fontWeight: 600,
      marginRight: '.5em',
      display: 'flex',
      alignItems: 'center'
    }
  },
  widgets_root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  schemes_widget: {
    display: 'flex',
    padding: '2em',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  schemes_widget_tile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '.3em 1em',
    background: 'linear-gradient(0deg, rgb(255, 232, 217) 0%, rgb(255, 255, 255) 100%)',
    color: theme.palette.secondary.main,
    cursor: 'pointer'
  },
  register_widget: {
    display: 'flex',
    flexDirection: 'column',
    padding: '.5em 1.5em',
    '& .buttons': {
      marginTop: '1em',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    }
  }
});