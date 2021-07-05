import React, {useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import {Button, Container, Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import teamImage from "../assets/team.png";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/styles";
import {Link, useLocation, useParams, useHistory} from "react-router-dom";
import EventNoteIcon from "@material-ui/icons/EventNote";


const useStyles = makeStyles({
    root: {
        minHeight: 250,
        minWidth: 280,
        color: 'white'
    },
    media: {
        height: 0,
        padding: '50%',
    },
    search: {
        marginBottom: 15,
    },
    icons: {
        color: "white",
        paddingLeft: 30
    },
    cardInfo: {
        display: 'flex',
        backgroundColor: '#3f51b5',
        minHeight: 40,
        paddingBottom: 0,
        paddingTop: 10
    },
    cardInfoBottom: {
        backgroundColor: '#3f51b5',
        paddingTop: 0
    },
    cardText: {
        minHeight: 30,
        minWidth: 200
    },
    backButton: {
        opacity: 1,
        borderRadius: 50,
        marginRight: 25
    },
    link: {
        textDecoration: 'none'
    }
});

const TeamsList = () => {
    const classes = useStyles();
    const [team, setTeam] = useState([])
    const [value, setValue] = useState('')
    const {number} = useParams()
    let history = useHistory()
    const {pathname, search} = useLocation()

    const responseTeam = () => {
        fetch(`http://api.football-data.org/v2/competitions/${number}/teams`, {
            method: 'GET',
            headers: new Headers({
                'X-Auth-Token': process.env.REACT_APP_API_KEY,
            })
        })
            .then(res => res.json())
            .then(res => setTeam(res.teams))
            .catch(err => console.log(err))
    }
    useEffect(() => {
        responseTeam()
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(search)
        if (value !== '') {
            params.set('search', value)
        } else {
            params.delete('search')
        }
        history.push({
            pathname,
            search: params.toString()
        })
    }, [value])
    useEffect(() => {
        const params = new URLSearchParams(search);
        const searchValue = params.get('search');
        if (searchValue != null) {
            setValue(searchValue)
        }
    }, [])
    const teamFilter = team.filter(team => {
            return team.name.toLowerCase().includes(value.toLowerCase())
        }
    )

    return (
        <div>
            <Container fixed>
                <div className='sortPanel'>
                <Link to={`/`} className={classes.link}> <Button variant="contained" color="primary" className={classes.backButton}>back</Button></Link>
                    <FormControl variant="outlined" className={classes.search}>
                        <Input
                            id="standard-adornment-weight"
                            placeholder='Search'
                            onChange={(event => setValue(event.target.value))}
                        />
                    </FormControl>
                </div>
                <Grid container spacing={6}>
                    {teamFilter.map(i =>
                        <Grid item key={i.id} xs={9} sm={6} md={3}>
                            <Card className={classes.root}>
                                <CardMedia className={classes.media}
                                           image={(i.crestUrl) ? i.crestUrl : teamImage}
                                           title='Team'/>
                                <CardContent className={classes.cardInfo}>
                                    <Typography variant="h7" component="h4" className={classes.cardText}>
                                        {i.name}
                                    </Typography>
                                    <Link to={{pathname: `/league/team/${i.id}/calendar`, id: i.id, number: number}}
                                          className={classes.linkCalendar}>
                                        <EventNoteIcon className={classes.icons}/></Link>
                                </CardContent>
                                <CardContent className={classes.cardInfoBottom}>
                                    <Typography variant="h7" component="h5" className={classes.cardTextBottom}>
                                        {i.area.name}
                                    </Typography>
                                    <Typography variant="h7" component="h5" className={classes.cardTextBottom}>
                                        Founded in {i.founded}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    );
}
export default TeamsList;
