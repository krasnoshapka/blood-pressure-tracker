import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  topBar: {
    zIndex: theme.zIndex.drawer + 1
  }
});

const Header = (props) => {
  const {classes} = props;
  return (
    <AppBar position="fixed" className={classes.topBar}>
      <Toolbar>
        <Typography variant="h5" noWrap>
          Blood Pressure Tracker
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(Header);
