import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import Sites from "./components/siteManager/Sites";
import Users from "./components/userManager/Users";
import Ledge from "./components/Ledgemanager/Ledgemanager";
import Login from "./components/login/LoginDemo";
import { Route, Switch } from "react-router-dom";
function App() {
    return (
        <div class="wrapper">
            <Navbar />
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/users" component={Users} />
                <Route path="/sites" component={Sites} />
                <Route path="/ledgermanager" component={Ledge} />
            </Switch>
            <ToastContainer />
        </div>
    );
}

export default App;
