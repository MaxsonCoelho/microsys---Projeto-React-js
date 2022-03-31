import { Switch } from "react-router-dom";
import Route from "./Route";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import GerencyUsers from "../pages/GerencyUsers";
import CollectionBactery from '../pages/CollectionBactery';
import CollectionFungic from '../pages/CollectionFungic';
import AddFungic from "../pages/AddFungic";
import AddBactery from "../pages/AddBactery";
import Profile from "../pages/Profile";

export default function Routes(){
    
    return(
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/home/" component={Home} isPrivate />
            <Route exact path="/profile/" component={Profile} isPrivate />
            <Route exact path="/colecao-bacteriana" component={CollectionBactery} isPrivate/>
            <Route exact path="/colecao-fungica" component={CollectionFungic} isPrivate/>
            <Route exact path="/gerenciamento-de-usuarios/" component={GerencyUsers} isPrivate/>
            <Route exact path="/adicao-fungica" component={AddFungic} isPrivate/>
            <Route exact path="/adicao-bacteriana/" component={AddBactery} isPrivate/>
        </Switch>
    )
}