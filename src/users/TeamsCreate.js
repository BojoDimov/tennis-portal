import React from 'react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SingleSelect from '../components/select';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  entered: {
    overflow: 'initial'
  },
  button: {
    marginLeft: '1rem'
  }
});

class TeamCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user1: null,
      user2: null,
    }
  }

  save() {
    this.setState({ user1: null, user2: null });
  }

  handleChange(name, selected) {
    const { user1, user2 } = this.state;

    if (!selected) {
      let state = this.state;
      state[name] = null;
      this.setState(state);
    }
    else if (name == 'user1' && user2 && user2.value == selected.value)
      this.setState({ user1: selected, user2: user1 });
    else if (name == 'user2' && user1 && user1.value == selected.value)
      this.setState({ user1: user2, user2: selected });
    else if (name == 'user1')
      this.setState({ user1: selected });
    else this.setState({ user2: selected });
  }

  render() {
    const { user1, user2 } = this.state;
    let { users, classes } = this.props;

    return (
      <ExpansionPanel
        CollapseProps={
          { classes: { entered: classes.entered } }
        }>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Нова двойка</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ display: 'block' }}>
          <SingleSelect
            style={{ marginBottom: '1rem' }}
            placeholder="Избор на играч 1"
            items={users}
            value={user1}
            onChange={(id) => this.handleChange('user1', id)}
          />
          <SingleSelect
            style={{ marginBottom: '1rem' }}
            placeholder="Избор на играч 2"
            items={users}
            value={user2}
            onChange={(id) => this.handleChange('user2', id)}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disabled={!user1 || !user2}
            onClick={() => this.save()}
          >
            Създай
          </Button>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(TeamCreate);