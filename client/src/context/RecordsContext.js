import React, {useContext, createContext, useState} from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {processErrors} from '../util/errors';

const RECORDS_QUERY = gql`
  query ($start: Date, $end: Date) {
    records(start: $start, end: $end) {
      id
      sys
      dia
      pul
      datetime
    } 
  }
`;

const ADD_RECORD_MUTATION = gql`
  mutation addRecord($sys: Int!, $dia: Int!, $pul: Int!) {
    addRecord(sys: $sys, dia: $dia, pul:$pul) {
      id
    }
  }
`;

const DELETE_RECORD_MUTATION = gql`
  mutation deleteRecord($id: ID!) {
    deleteRecord(id: $id) 
  }
`;

let currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 1);

const RecordsContext = createContext({
  records: null
});

function RecordsProvider(props) {
  const [filters, setFilters] = useState({
    start: currentDate.toISOString().slice(0,10),
    end: (new Date()).toISOString().slice(0,10)
  });
  const { loading: _loadingRecords, data, error: _recordsError, refetch } = useQuery(RECORDS_QUERY, {
    variables: {...filters}
  });
  const [addRecord, {error: _addRecordError, loading: _loadingAdd}] = useMutation(ADD_RECORD_MUTATION);
  const [deleteRecord, {error: _deleteRecordError, loading: _loadingDelete}] = useMutation(DELETE_RECORD_MUTATION);

  const add = async (record) => {
    try {
      const res = await addRecord({ variables: { ...record } });
      if (res && res.data && res.data.addRecord) {
        await refetch();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const del = async (id) => {
    try {
      const res = await deleteRecord({ variables: { id } });
      if (res && res.data && res.data.deleteRecord) {
        await refetch();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const loading = _loadingRecords || _loadingAdd || _loadingDelete;
  const errors = processErrors(_recordsError) ||
    processErrors(_addRecordError) ||
    processErrors(_deleteRecordError);
  return (
    <RecordsContext.Provider
      value={{ loading, errors, 'records': (data ? data.records : null), filters, setFilters, add, del }}
      {...props}
    />
  );
}

const useRecords = () => useContext(RecordsContext);

export { RecordsProvider, useRecords };
