import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ({records}) => {
  function formatChartDate(el) {
    const d = new Date(el.datetime);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const datetime = `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : '' }${month}`;
    return {...el, datetime};
  }

  const data = records.map(formatChartDate).reverse();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="sys" stroke="#8884d8" strokeWidth={3} name="Systolic" />
        <Line type="monotone" dataKey="dia" stroke="#367d3e" strokeWidth={3} name="Diastolic" />
        <Line type="monotone" dataKey="pul" stroke="#702e3c" strokeWidth={3} name="Pulse" />
        <CartesianGrid stroke="#ccc" />
        <Tooltip />
        <XAxis dataKey="datetime" />
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Chart;
