import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import BuildIcon from '@material-ui/icons/Build';

import UserService from '../../services/user.service';

class SchemeActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: null
    };

    this.closeMenu = () => {
      this.setState({ menuAnchor: null });
    };
  }

  render() {
    const { menuAnchor } = this.state;

    return (
      <React.Fragment>
        <Hidden smDown>
          <div className="spacing">
            <Button variant="contained" size="small" color="primary">Промяна</Button>
            <Button variant="contained" size="small" color="primary">Чернова</Button>
            <Button variant="contained" size="small" color="primary">Публикуване</Button>
            <Button variant="contained" size="small" color="primary">Финализиране</Button>
            <Button variant="contained" size="small" color="primary">Изтриване</Button>
          </div>
        </Hidden>

        <Hidden mdUp>
          <Button
            aria-owns={menuAnchor ? 'admin-actions' : null}
            aria-haspopup="true"
            color="primary" size="small"
            onClick={(e) => this.setState({ menuAnchor: e.target })}
          >
            <BuildIcon />
          </Button>
          <Menu
            id="admin-actions"
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={this.closeMenu}
          >
            <MenuItem onClick={this.closeMenu}>
              Промяна
            </MenuItem>
            <MenuItem onClick={this.closeMenu}>
              Чернова
            </MenuItem>
            <MenuItem onClick={this.closeMenu}>
              Публикуване
            </MenuItem>
            <MenuItem onClick={this.closeMenu}>
              Финализиране
            </MenuItem>
            <MenuItem onClick={this.closeMenu}>
              Изтриване
            </MenuItem>
          </Menu>
        </Hidden>
      </React.Fragment>
    );
  }
}

export default SchemeActions;