import './App.css';
import React from "react";
import TeamsList from "./components/TeamsList";
import LeaguesList from "./components/LeaguesList";
import {BrowserRouter as Router, HashRouter, Route, Switch} from "react-router-dom";
import LeaguesDate from "./components/LeaguesDate";
import TeamDate from "./components/TeamDate";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";


function App() {

    return (
        <div>
            <AppBar position="static">
        <Toolbar>
            <Typography variant="h6">
                SoccerStat
            </Typography>
        </Toolbar>
    </AppBar>
        <div className='wrapper'>
            <HashRouter>
            <Router>
                <Switch>
                    <Route exact path="/" component={LeaguesList} />
                    <Route path='/league/:number/teams' component={TeamsList}/>
                    <Route path='/league/:number/calendar' component={LeaguesDate}/>
                    <Route path='/league/team/:teamId/calendar' component={TeamDate}/>
                </Switch>
            </Router>
            </HashRouter>
        </div>
        </div>
    )
}

export default App;
