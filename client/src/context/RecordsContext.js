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
  const { loading, data, error, refetch } = useQuery(RECORDS_QUERY, {
    variables: {...filters}
  });
  const [addRecord, {error: _addRecordError}] = useMutation(ADD_RECORD_MUTATION);

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

  return (
    <RecordsContext.Provider
      value={{ loading, error, 'records': (data ? data.records : null), filters, setFilters,
        add, addRecordError: processErrors(_addRecordError)}}
      {...props}
    />
  );
}

const useRecords = () => useContext(RecordsContext);

export { RecordsProvider, useRecords };
