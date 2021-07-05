import React, {useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/styles";
import {Container, Grid} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import emblem from "../assets/emblem.jpg"
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Link, useHistory, useLocation} from "react-router-dom";
import GroupIcon from '@material-ui/icons/Group';
import EventNoteIcon from '@material-ui/icons/EventNote';


const useStyles = makeStyles({
    root: {
        minHeight: 150,
        minWidth: 170,
        backgroundColor: '#3f51b5',
        display: 'flex',
        padding: 10,
        color: 'white',
    },
    media: {
        minHeight: 85,
        minWidth: 120,
        margin: 'auto',
        padding: 'auto',
        border: 'solid',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: '1.7px'
    },
    linkTeam: {
        textDecoration: "none",
        marginRight: 30,
        width: 10,
        height: 10

    },
    linkCalendar: {
        textDecoration: "none"
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        width: 170,
    },
    leagues: {
        marginTop: 10
    },
    filterPanel: {
        marginBottom: 15
    },
    icons: {
        color: 'white',
        marginRight: 0
    }

});

const LeaguesList = () => {
    const classes = useStyles();
    const [league, setLeague] = useState([])
    const [filter, setFilter] = useState({year: 'all', leagueName: ''})
    let history = useHistory()
    const {search, pathname} = useLocation()

    useEffect(() => {
        responseLeague()
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(search);
        if (filter.year !== 'all') {
            params.set('year', filter.year)
        } else {
            params.delete('year')
        }
        if (filter.leagueName !== '') {
            params.set('searchLeague', filter.leagueName)
        } else {
            params.delete('searchLeague')
        }
        history.push({
            pathname,
            search: params.toString()
        })
    }, [filter])

    useEffect(() => {
        const params = new URLSearchParams(search);
        const yearPar = params.get('year');
        const searchPar = params.get('searchLeague');
        console.log(yearPar)
        console.log(searchPar)
        if (yearPar != null) {
            setFilter({year: yearPar, leagueName: filter.leagueName})
        }
        if (searchPar != null) {
            setFilter({year: filter.year, leagueName: searchPar})
        }
    }, [])
    const responseLeague = () => {
        fetch('http://api.football-data.org/v2/competitions/?plan=TIER_ONE', {
            method: 'GET',
            headers: new Headers({
                'X-Auth-Token': process.env.REACT_APP_API_KEY,
            })
        })
            .then(res => res.json())
            .then(res => setLeague(res.competitions))
            .catch(err => console.log(err))
    }

    const leagueFilter = league.filter(league => {
        return league.name.toLowerCase().includes(filter.leagueName.toLowerCase())
    })

    const yearFilter = leagueFilter.filter(league => {
            let filteredLeague
            if (filter.year === 'all') {
                filteredLeague = league
            } else if (league.currentSeason && league.currentSeason.startDate) {
                filteredLeague = league.currentSeason.startDate.toString().includes(filter.year.toLowerCase())
            }
            return filteredLeague
        }
    )

    return (
        <div>
            <Container fixed>
                <div className={classes.filterPanel}>
                    <FormControl variant="outlined">
                        <Input
                            placeholder='Search'
                            onChange={(event => {
                                    setFilter({year: filter.year, leagueName: event.target.value})
                                }
                            )}
                        />
                    </FormControl>
                    <FormControl>
                        <Select
                            placeholder={'year'}
                            value={filter.year}
                            onChange={(event => {
                                    setFilter({year: event.target.value, leagueName: filter.leagueName})
                                }
                            )}
                        >
                            <MenuItem value={'all'}>All years</MenuItem>
                            <MenuItem value={'2021'}>2021</MenuItem>
                            <MenuItem value={'2020'}>2020</MenuItem>
                            <MenuItem value={'2019'}>2019</MenuItem>
                            <MenuItem value={'2018'}>2018</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <Grid container spacing={7}>
                    {yearFilter.map((i, index) =>
                        <Grid item key={index} xs={12} sm={9} md={4}>
                            <Card className={classes.root}>

                                <div className={classes.details}>
                                    <CardContent>
                                    <span key={index}>
                                    <Link to={{pathname: `/league/${i.id}/teams`, id: i.id}}
                                          className={classes.linkTeam}>
                                        <GroupIcon className={classes.icons}/></Link>
                                    <Link to={{pathname: `/league/${i.id}/calendar`, id: i.id}}
                                          className={classes.linkCalendar}>
                                        <EventNoteIcon className={classes.icons}/></Link>
                                    </span>
                                        <Typography variant="subtitle1: 'h2'" component="h3">
                                            {i.area.name}.
                                        </Typography>
                                        <Typography variant="body2: h1" component="h4" className={classes.leagues}>
                                            {i.name}
                                        </Typography>
                                    </CardContent>
                                </div>

                                <CardMedia className={classes.media}
                                           image={(i.area.ensignUrl) ? i.area.ensignUrl : emblem}
                                           title='League' borderRadius="borderRadius" border={1}/>
                            </Card>
                        </Grid>)}
                </Grid>
            </Container>
        </div>
    );
}
export default LeaguesList;
