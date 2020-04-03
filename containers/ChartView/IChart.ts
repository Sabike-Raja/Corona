export interface ChartApiData {
    cases_time_series: CaseTimeSeries[]
}

export interface CaseTimeSeries {
    dailyconfirmed: string,
    dailydeceased: string,
    dailyrecovered: string,
    date: string,
    death: string,
    rec: string,
    totalconfirmed: string,
    totaldeceased: string,
    totalrecovered: string
}