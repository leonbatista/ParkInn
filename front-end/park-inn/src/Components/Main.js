import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./HomePage/Home";
import Statistics from "./StatisticsPage/Statistics";
import Events from "./EventsPage/Events";
import Incidents from "./IncidentsPage/Incidents";
import Management from "./ManagementPage/Management";
import Renderer from "./Renderer/Renderer";
import Profile from "./Profile";
import Login from "./LoginPage/Login"
import PrivateRoute from "./PrivateRoute";

export default () => {
    return (
        <main>
            <Switch>
                <Route exact path="/" component={Login} />
                {/* need to edit this route for the add/manage lot page */}
                <PrivateRoute exact path="/dash" component={Home} />
                <PrivateRoute exact path="/statistics" component={Statistics} />
                <PrivateRoute exact path="/events" component={Events} />
                <PrivateRoute exact path="/incidents" component={Incidents} />
                <PrivateRoute exact path="/management" component={Management} />
                <PrivateRoute exact path="/renderer" component={Renderer} />
                <PrivateRoute exact path="/profile" component={Profile}/>
            </Switch>
        </main>
    );
};
