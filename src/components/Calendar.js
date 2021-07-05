import React, {useEffect, useState} from "react";
import {Link, useHistory, useLocation} from "react-router-dom";
import {
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell, Button, FormControl
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";


const useStyles = makeStyles({
    tableTeams: {
        maxWidth: 1200,
        margin: 'auto'
    },
    select: {
        width: 80
    },
    pickerContainer: {
        display: 'flex',
        padding: 0
    },
    backButton: {
        borderRadius: 50,
        marginLeft: 20,
        marginTop: 10
    },
    link: {
        textDecoration: 'none'
    },
    pickerBlock: {
        marginBottom: 10
    },
    tableHead: {
        backgroundColor: '#3f51b5',

    },
    tableHeadText: {
        color: 'white'
    },
});

const Calendar = ({data, tableHeader, type}) => {
    const stateDate = (new Date().getFullYear() + 1).toString()
    const valueTable = tableHeader
    const classes = useStyles()
    const [dataTable, setDataTable] = useState(data)
    const [endDate, setEndDate] = useState(new Date(stateDate));
    const [startDate, setStartDate] = useState(new Date('2015-01-01T00:00:00'))
    const [season, setSeason] = useState('season')
    let history = useHistory()
    const {search, pathname} = useLocation()

    useEffect(() => {
        setDataTable(data)
    }, [data])
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };
    const handleEndDateChange = (date) => {
        setEndDate(date);
    };
    useEffect(() => {
        const params = new URLSearchParams(search);
        ((season !== 'season') ? params.set('season', season) : params.delete('season'))
        params.set('dateFrom',
            `${startDate.getFullYear()}-${getParamDate(startDate, 'month')}-${getParamDate(startDate, 'day')}`)
        params.set('dateTo',
            `${endDate.getFullYear()}-${getParamDate(endDate, 'month')}-${getParamDate(endDate, 'day')}`)

        history.push({
            pathname,
            search: params.toString()
        })
    }, [startDate, endDate, season])

    useEffect(() => {
        const params = new URLSearchParams(search);
        const seasonPar = params.get('season');
        if (seasonPar != null) {
            setSeason(seasonPar)
        }
    }, [])
    const getParamDate = (date, type) => {
        let result
        if (type === 'month') {
            result = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
        } else if (type === 'day') {
            result = (date.getDate() < 10 ? '0' : '') + (date.getDate())
        }
        return result
    }

    const getDateMatch = (date) => {
        let getDate = new Date(date)
        let day = (getDate.getDate() < 10 ? '0' : '') + getDate.getDate()
        let month = (getDate.getMonth() + 1 < 10 ? '0' : '') + (getDate.getMonth() + 1)
        let hour = (getDate.getHours() < 10 ? '0' : '') + getDate.getHours()
        let minutes = (getDate.getMinutes() < 10 ? '0' : '') + getDate.getMinutes()
        let year = getDate.getFullYear()
        return `${day}.${month}.${year} - ${hour}:${minutes}`
    }

    const renderMenuItem = () => {
        let years = []
        for (let i = endDate.getFullYear(); i >= startDate.getFullYear(); i--) {
            years.push(i)
        }
        return years.map(i => <MenuItem value={i.toString()}>{i.toString()}</MenuItem>)
    }

    const filterDate = (startDate, endDate) => {
        return dataTable.filter(item => startDate <= new Date(item.utcDate) &&
            new Date(item.utcDate) <= endDate)
    }

    const filterYear = (startDate, endDate) => {
        let seasonFormat = (season === 'season') ? '' : season
        return filterDate(startDate, endDate).filter(item =>
            new Date(item.utcDate).getFullYear().toString().includes(seasonFormat.toString()))
    }
    return (
        <Container className={classes.pickerBlock}>
            <Link to={`/`} className={classes.link}>
                <Button variant="contained" color="primary" className={classes.backButton}>
                    Back</Button>
            </Link>
            <Container className={classes.pickerContainer}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Container>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Start date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="End date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <FormControl>
                            <InputLabel id="demo-simple-select-readonly-label">Season</InputLabel>
                            <Select className={classes.select}
                                    labelId="demo-simple-select-readonly-label"
                                    id="demo-simple-select-readonly"
                                    value={season}
                                    onChange={(event => {
                                            setSeason(event.target.value)
                                        }
                                    )}
                            >
                                <MenuItem value={'season'}>All</MenuItem>
                                {renderMenuItem()}
                            </Select>
                        </FormControl>
                    </Container>
                </MuiPickersUtilsProvider>
            </Container>
            <TableContainer component={Paper} className={classes.tableTeams}>
                {(type === 'league') ?
                    <Table>
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell><Typography variant='h6' className={classes.tableHeadText}>Date</Typography></TableCell>
                                <TableCell><Typography variant='h6' className={classes.tableHeadText}>Teams</Typography></TableCell>
                                <TableCell><Typography variant='h6' className={classes.tableHeadText}>Score</Typography></TableCell>
                                <TableCell><Typography variant='h6'
                                                       className={classes.tableHeadText}>Status</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterYear(startDate, endDate).map(i =>
                                <TableRow>
                                    <TableCell>{getDateMatch(i.utcDate)}</TableCell>
                                    <TableCell>{i.homeTeam.name} - {i.awayTeam.name}</TableCell>
                                    <TableCell>
                                        <Typography variant="h7" component="h2">
                                            {(i.score.fullTime.homeTeam !== null) ? i.score.fullTime.homeTeam : '-'}:
                                            {(i.score.fullTime.awayTeam !== null) ? i.score.fullTime.awayTeam : '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{i.status.toLowerCase()}</TableCell>
                                </TableRow>
                            )
                            }
                        </TableBody>
                    </Table>
                    :
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant='h6' className={classes.tableHeadText}>Date</Typography></TableCell>
                                <TableCell><Typography variant='h6'
                                                       className={classes.tableHeadText}>{valueTable}</Typography></TableCell>
                                <TableCell><Typography variant='h6' className={classes.tableHeadText}>Home -
                                    Away</Typography></TableCell>
                                <TableCell><Typography variant='h6'
                                                       className={classes.tableHeadText}>Status</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterYear(startDate, endDate).map(i =>
                                <TableRow>
                                    <TableCell>{getDateMatch(i.utcDate)}</TableCell>
                                    <TableCell>{i.competition.name}</TableCell>
                                    <TableCell>
                                        {i.homeTeam.name}
                                        {(i.score.fullTime.homeTeam !== null) ? ' ' + i.score.fullTime.homeTeam : '-'}:{(i.score.fullTime.awayTeam !== null) ? i.score.fullTime.awayTeam + ' ' : '-'}
                                        {i.awayTeam.name}
                                    </TableCell>
                                    <TableCell>{i.status}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                }
            </TableContainer>
        </Container>
    );
}

export default Calendar;
