import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import Container from "@material-ui/core/Container";
import 'date-fns';
import Calendar from "./Calendar";


const LeaguesDate = () => {
    const {number} = useParams()
    const [matches, setMatches] = useState([])
    const {search} = useLocation()

    const responseMatches = () => {
        fetch(`http://api.football-data.org/v2/competitions/${number}/matches`, {
            method: 'GET',
            headers: new Headers({
                'X-Auth-Token': process.env.REACT_APP_API_KEY,
            })
        })
            .then(res => res.json())
            .then(res => setMatches(res.matches))
            .catch(err => console.log(err))
    }
    useEffect(() => {
        responseMatches()
    }, [search])

    return (
        <Container>
          <Calendar data={matches} type={'league'}/>
        </Container>
    );
}
export default LeaguesDate;
