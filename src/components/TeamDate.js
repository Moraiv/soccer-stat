import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import Container from "@material-ui/core/Container";
import 'date-fns';
import Calendar from "./Calendar";


const TeamDate = () => {
    const {teamId} = useParams()
    const [teamMatches, setTeamMatches] = useState([])
    const {search} = useLocation()

const responseTeams = () => {
        fetch(`http://api.football-data.org/v2/teams/${teamId}/matches`, {
            method: 'GET',
            headers: new Headers({
                'X-Auth-Token': process.env.REACT_APP_API_KEY,
            })
        })
            .then(res => res.json())
            .then(res => setTeamMatches(res.matches))
            .catch(err => console.log(err))
    }
    useEffect(() => {
        responseTeams()
    }, [search])
console.log(teamMatches)

    return (
        <Container>
            <Calendar data={teamMatches} tableHeader={'League'} type={'team'} />
        </Container>
    );
}
export default TeamDate;
