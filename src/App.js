import logo from './logo.svg';
import './App.css';

import HomePage from './pages/HomePage';
import CreateMapPage from './pages/CreateMapPage';
import ViewMapPage from './pages/ViewMapPage';

import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/createmap"><CreateMapPage /></Route>
                </Switch>
                <Switch>
                    <Route path="/viewmap"><ViewMapPage /></Route>
                </Switch>
                <Switch>
                    <Route path="/" exact><HomePage /></Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
