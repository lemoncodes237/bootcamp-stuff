import logo from './logo.svg';
import React from 'react';
import CardEditor from './CardEditor';
import CardViewer from './CardViewer';
import Homepage from './Homepage';

import {Switch,Route} from 'react-router-dom';

class App extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      cards: [
        { front: 'front', back: 'back', starred: false }
      ]
    }
  }

  addCard = card => {
    const cards = this.state.cards.slice().concat(card);
    this.setState({ cards });
  };

  deleteCard = index =>  {
    const cards = this.state.cards.slice();
    cards.splice(index, 1);
    this.setState({ cards });
  };

  starCard = index => {
    const cards = this.state.cards.slice();
    cards[index].starred = !cards[index].starred;
    this.setState({ cards });
  }

  changeCard = (index, name, value) => {
    const cards = this.state.cards.slice();
    if(name === "front") {
      cards[index].front = value;
    } else  {
      cards[index].back = value;
    }
    this.setState({ cards });
  }

  render() {

    return (
      <Switch>
        <Route exact path="/editor">
        <CardEditor 
        addCard={this.addCard}
        deleteCard={this.deleteCard}
        cards={this.state.cards}
        changeCard={this.changeCard}
        starCard={this.starCard}
      />
        </Route>
        <Route exact path="/viewer">
        <CardViewer 
        nextCard={this.nextCard}
        cards={this.state.cards}
        starCard={this.starCard}
      />
        </Route>
        <Route exact path="/">
          <Homepage

          />
        </Route>
      </Switch>
    );

    if(this.state.editor)  {
      return <CardEditor 
        addCard={this.addCard}
        deleteCard={this.deleteCard}
        cards={this.state.cards}
        switchMode={this.switchMode}
        changeCard={this.changeCard}
        starCard={this.starCard}
      />;
    } else  {
      return <CardViewer 
        switchMode={this.switchMode}
        nextCard={this.nextCard}
        cards={this.state.cards}
        starCard={this.starCard}
      />;
    }
  }
}

export default App;
