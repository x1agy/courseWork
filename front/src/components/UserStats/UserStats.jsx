import { Tabs, Tooltip } from "antd"
import { Bar, BarChart, CartesianGrid, Legend } from "recharts"
import useScreenSize from "../../hooks/useScreenSize";
import { formatWeekDataFromUser, formatYearDataFromUser } from "../../utils/formatDataForCharts";
import { randomHexColor } from "../../utils/default";
import { useContext } from "react";
import { UserContext } from "../../App";

import styles from './UserStats.module.css'

export const UserStats = () => {
    const {userContext} = useContext(UserContext);
    const screenSize = useScreenSize(700);
    const chartData = formatWeekDataFromUser(userContext ?? []);
    const chartDataKeys= chartData
        ?.reduce((acc, item) => [...acc, ...Object.keys(item)], [])
        ?.reduce((acc, item) => acc.includes(item) ? acc : [...acc, item],[]);
    
    const yearData = formatYearDataFromUser(userContext ?? []);
    console.log(yearData, chartData)
    

    const tabsItems = [
        {
            key: 'part-1',
            label: 'Неделя',
            children: <BarChart
                        width={screenSize.width > 700 ? 500 : 400}
                        height={300}
                        data={chartData.slice(-7)}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 30,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        {chartDataKeys.map((item, index) => {
                            return(
                                <Bar key={index} dataKey={item} stackId={index} fill={randomHexColor()} />
                            )
                        })}
                    </BarChart>
        },
        {
            key: 'part-2',        
            label: 'Месяц',
            children: <BarChart
                        width={screenSize.width > 700 ? 500 : 400}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 30,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        {chartDataKeys.map((item, index) => {
                            return(
                                <Bar key={index} dataKey={item} stackId={index} fill={randomHexColor()} />
                            )
                        })}
                    </BarChart>
        },
        {
            key: 'part-3',
            label: 'Год',
            children: <BarChart
                        width={screenSize.width > 700 ? 500 : 400}
                        height={300}
                        data={yearData}
                        barSize={100}
                        barGap='10px'
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 30,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        {yearData.map((_, index) => {
                            return(
                                <Bar key={index} dataKey={index} fill={randomHexColor()} />
                            )
                        })}
                    </BarChart>
        },
    ]
    
    return(
        <>
            <Tabs
                direction="horizontal"
                className={styles.tabs}
                items={tabsItems}
            />
        </>
    )
}