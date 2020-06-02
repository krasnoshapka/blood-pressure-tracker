import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import { API_ROUTE } from "../constants/routes";

const styles = ((theme) => ({
    uiProgess: {
      position: 'fixed',
      zIndex: '1000',
      height: '31px',
      width: '31px',
      left: '50%',
      top: '35%'
    },
    table: {
      // minWidth: 650,
    },
  })
);

class Records extends Component {
  constructor(props) {
    super(props);

    this.state = {
      records: [],
      uiLoading: true
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete = (id) => {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .delete(`${API_ROUTE}/records/${id}`)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillMount = () => {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get(`${API_ROUTE}/records/`)
      .then((response) => {
        this.setState({
          records: response.data,
          uiLoading: false
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { classes } = this.props;

    if (this.state.uiLoading === true) {
      return (
        <React.Fragment>
          {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
        </React.Fragment>
      );
    } else if (this.state.records.length === 0) {
      return (
        <React.Fragment>
          <Typography paragraph>
            No pressure records. Please add using button below.
          </Typography>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Typography paragraph>
            Recent pressure records
          </Typography>

          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="blood pressure table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Record</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell component="th" scope="row">
                      {(new Date(record.datetime)).toLocaleString('uk-UA')}
                    </TableCell>
                    <TableCell align="right">{`${record.sys}/${record.dia}/${record.pul}`}</TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="delete" size="small" onClick={() => this.handleDelete(record.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>
      );
    }
  }
}

export default (withStyles(styles)(Records));
