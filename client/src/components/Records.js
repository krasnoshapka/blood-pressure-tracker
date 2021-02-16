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
import TextField from '@material-ui/core/TextField';

import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import { API_ROUTE } from "../constants/routes";
import {GlobalContext} from "../context/GlobalState";
import Chart from "./Chart";

const styles = ((theme) => ({
    uiProgress: {
      position: 'absolute',
      zIndex: '1000',
      top: 'calc(50% - 75px)',
      left: 'calc(50% - 75px)'
    },
    filters: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      marginBottom: 20,
    },
  })
);

const Records = (props) => {
  const {records, setRecords, deleteRecord} = useContext(GlobalContext);
  const [uiLoading, setUiLoading] = useState(false);
  const {filters, setFilters} = useContext(GlobalContext);

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

  const loadRecords = (loadFilters) => {
    setUiLoading(true);
    authMiddleWare(props.history);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = {Authorization: `${authToken}`};
    axios
      .get(`${API_ROUTE}/records/`, {
        params: {
          start: loadFilters.start,
          end: loadFilters.end
        }
      })
      .then((response) => {
        setRecords(response.data);
        setUiLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // This check is needed to load records only once after user logged in or during page reload.
    // In other cases when Records component is rendered it should use Context.
    if (records === null) {
      loadRecords(filters);
    }
  }, []);

  const { classes } = props;
  const Filters = (
    <form className={classes.filters} noValidate>
      <TextField
        id="startDate"
        label="Start date"
        type="date"
        defaultValue={filters.start}
        margin="normal"
        onChange={(event) => {setFilters({start: event.target.value, end: filters.end}, loadRecords)}}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="endDate"
        label="End date"
        type="date"
        defaultValue={filters.end}
        margin="normal"
        onChange={(event) => {setFilters({start: filters.start, end: event.target.value}, loadRecords)}}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
  );

  if (records === null || uiLoading === true) {
    return (
      <CircularProgress size={150} className={classes.uiProgress} />
    );
  } else if (records.length === 0) {
    return (
      <React.Fragment>
        {Filters}
        <Typography paragraph>
          No pressure records. Please add using button below.
        </Typography>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        {Filters}

        <Chart records={records} />

        <Typography paragraph>
          Recent pressure records
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small" aria-label="blood pressure table">
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
