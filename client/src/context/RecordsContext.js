import React, {useContext, createContext, useState} from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

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
  const { loading, data, error } = useQuery(RECORDS_QUERY, {
    variables: {...filters}
  });

  return (
    <RecordsContext.Provider
      value={{ loading, error, 'records': (data ? data.records : null), filters, setFilters }}
      {...props}
    />
  );
}

const useRecords = () => useContext(RecordsContext);

export { RecordsProvider, useRecords };
