import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import data from "./data.json";
import './index.css';

const ChartTable = () => {
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const handleRowClick = (index) => {
        setSelectedRowIndex(selectedRowIndex === index ? null : index);
    };

    const calculateChange = (today, yesterday) => {
        if (yesterday === 0) return 0;
        return (((today - yesterday) / yesterday) * 100).toFixed(2);
    };

    const formatNumber = (num) => num.toLocaleString("ru-RU");

    const calculateWeeklySum = (values) => values.reduce((sum, val) => sum + val, 0);

    return (
        <div className="container">
            <table className="data-table">
                <thead>
                <tr>
                    <th>Показатель</th>
                    <th className="today">Текущий день</th>
                    <th>Вчера</th>
                    <th>Этот день недели</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => {
                    const today = row.data[0].value;
                    const yesterday = row.data[1].value;
                    const weeklySum = calculateWeeklySum(row.data.map(el => el.value));
                    const change = calculateChange(today, yesterday);
                    const isPositive = change >= 0;
                    return (
                        <React.Fragment key={index}>
                            {selectedRowIndex === index && (
                                <tr className="chart-row">
                                    <td colSpan="5">
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={250}>
                                                <LineChart data={row.data}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="value" stroke="#4CAF50" strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            <tr
                                className="table-row"
                                onClick={() => handleRowClick(index)}
                            >
                                <td className="label">{row.label}</td>
                                <td className="today">{formatNumber(today)}</td>
                                <td className={isPositive ? "positive-bg" : "negative-bg"}>
                                    {formatNumber(yesterday)} <span className="change">{change}%</span>
                                </td>
                                <td>{formatNumber(weeklySum)}</td>
                            </tr>
                        </React.Fragment>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default ChartTable;
