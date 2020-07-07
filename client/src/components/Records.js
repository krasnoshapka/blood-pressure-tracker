import React, { useState, useContext, useEffect } from 'react';
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
import {GlobalContext} from "../context/GlobalState";
import Chart from "./Chart";

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

const Records = (props) => {
  const {records, setRecords, deleteRecord} = useContext(GlobalContext);
  const [uiLoading, setUiLoading] = useState(false);

  const handleDelete = (id) => {
    setUiLoading(true);
    authMiddleWare(props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .delete(`${API_ROUTE}/records/${id}`)
      .then(() => {
        deleteRecord(id);
        setUiLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (records === null) {
      setUiLoading(true);
      authMiddleWare(props.history);
      const authToken = localStorage.getItem('AuthToken');
      axios.defaults.headers.common = {Authorization: `${authToken}`};
      axios
        .get(`${API_ROUTE}/records/`)
        .then((response) => {
          setRecords(response.data);
          setUiLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const { classes } = props;

  if (records === null || uiLoading === true) {
    return (
      <React.Fragment>
        {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
      </React.Fragment>
    );
  } else if (records.length === 0) {
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
        <Chart records={records} />

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
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell component="th" scope="row">
                    {(new Date(record.datetime)).toLocaleString('uk-UA')}
                  </TableCell>
                  <TableCell align="right">{`${record.sys}/${record.dia}/${record.pul}`}</TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="delete" size="small" onClick={() => handleDelete(record.id)}>
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

export default (withStyles(styles)(Records));
