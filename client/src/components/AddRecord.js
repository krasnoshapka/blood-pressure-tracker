import React, {useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import {useRecords} from "../context/RecordsContext";

const styles = ((theme) => ({
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    submit: {
      marginTop: theme.spacing(3),
    }
  })
);

const AddRecord = ({classes, history, setPage}) => {
  const [record, setRecord] = useState({
    sys: '',
    dia: '',
    pul: ''
  });
  const {add, errors} = useRecords();

  const handleChange = (event) => {
    let newRecord = {...record};
    newRecord[event.target.name] = event.target.value;
    setRecord(newRecord);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newRecord = {
      sys: parseInt(record.sys),
      dia: parseInt(record.dia),
      pul: parseInt(record.pul)
    };

    // LEGACY REST API
    // const authToken = localStorage.getItem('AuthToken');
    // axios.defaults.headers.common = { Authorization: `${authToken}` };
    // axios
    //   .post(`${API_ROUTE}/records/`, newRecord)
    //   .then((response) => {
    //     addRecord(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    add(newRecord).then((res) => {
      if (res) {
        setPage('pressure');
      }
    });
  };

  return (
    <form className={classes.form} noValidate>
      <Typography paragraph>
        Enter your pressure
      </Typography>
      <TextField
        variant="outlined"
        required
        fullWidth
        margin="normal"
        id="sys"
        label="Systolic"
        name="sys"
        autoComplete="Systolic"
        helperText={errors && errors.sys}
        value={record.sys}
        error={errors && errors.sys ? true : false}
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        required
        fullWidth
        margin="normal"
        id="dia"
        label="Diastolic"
        name="dia"
        autoComplete="Diastolic"
        helperText={errors && errors.dia}
        value={record.dia}
        error={errors && errors.dia ? true : false}
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        required
        fullWidth
        margin="normal"
        id="pul"
        label="Pulse"
        name="pul"
        autoComplete="Pulse"
        helperText={errors && errors.pul}
        value={record.pul}
        error={errors && errors.pul ? true : false}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" size="large" onClick={handleSubmit} startIcon={<SaveIcon />} className={classes.submit}>Save</Button>
    </form>
  )
}

export default (withStyles(styles)(AddRecord));
