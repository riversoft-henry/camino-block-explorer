import React from 'react'
import { typeBlockchainDataChart } from './ChartSelector'
import { Grid, useTheme } from '@mui/material'
import moment from 'moment'

export const TextBlockchainDatachart = ({
    typeStatistic,
    startDate,
    endDate,
    dataStatistics,
    Text,
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    return (
        <>
            <Grid xs={12} md={6}>
                {typeStatistic === typeBlockchainDataChart.DAILY_TRANSACTIONS && (
                    <Text backgroundColor={isDark ? '#0f172a' : '#F5F6FA'}>
                        Highest number of {dataStatistics.highestValue} transactions on <br />
                        {`${moment(startDate).format('dddd, MMMM DD, YYYY')}`}
                    </Text>
                )}
                {typeStatistic === typeBlockchainDataChart.UNIQUE_ADRESSES && (
                    <Text backgroundColor={isDark ? '#0f172a' : '#F5F6FA'}>
                        Highest increase of {dataStatistics.highestValue} new addresses was recorded
                        on <br /> {`${moment(startDate).format('dddd, MMMM DD, YYYY')}`}
                    </Text>
                )}
                {typeStatistic === typeBlockchainDataChart.ACTIVE_ADDRESSES && (
                    <Text backgroundColor={isDark ? '#0f172a' : '#F5F6FA'}>
                        Highest number of {dataStatistics.highestValue} addresses on <br />
                        {`${moment(startDate).format('dddd, MMMM DD, YYYY')}`}
                    </Text>
                )}
            </Grid>
            <Grid xs={12} md={6}>
                {typeStatistic === typeBlockchainDataChart.DAILY_TRANSACTIONS && (
                    <Text backgroundColor={isDark ? '#0f172a' : '#F5F6FA'}>
                        Lowest number of {dataStatistics.lowerValue} transactions on <br />
                        {`${moment(endDate).format('dddd, MMMM DD, YYYY')}`}
                    </Text>
                )}
                {typeStatistic === typeBlockchainDataChart.UNIQUE_ADRESSES && (
                    <Text backgroundColor={isDark ? '#0f172a' : '#F5F6FA'}>
                        Lowest increase of {dataStatistics.lowestValue} new addresses was recorded
                        on <br /> {`${moment(startDate).format('dddd, MMMM DD, YYYY')}`}
                    </Text>
                )}
                {typeStatistic === typeBlockchainDataChart.ACTIVE_ADDRESSES && (
                    <Text backgroundColor={isDark ? '#0f172a' : '#F5F6FA'}>
                        Lowest number of {dataStatistics.lowestValue} addresses on <br />
                        {`${moment(startDate).format('dddd, MMMM DD, YYYY')}`}
                    </Text>
                )}
            </Grid>
        </>
    )
}
