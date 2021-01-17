import React from "react";
import "main/App.css";
import { Container } from "react-bootstrap";
import { Route, Switch} from "react-router-dom";
import Game from "main/components/game";


function App() {
  return (
    <div className="App">
      <AppNavbar />
      <Container className="flex-grow-1 mt-5">
        <Switch>
          <Route exact path="/" component={Game} />
        </Switch>
      </Container>
      <AppFooter />
    </div>
  );
}

export default App;
