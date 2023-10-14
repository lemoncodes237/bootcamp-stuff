import logo from './logo.svg';
import React from 'react';
import CardEditor from './CardEditor';
import CardViewer from './CardViewer';

class App extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      cards: [
        { front: 'front', back: 'back', starred: false }
      ],
      editor: true
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

  switchMode = () => {
    if(this.state.cards.length == 0) return;
    this.setState({editor: !this.state.editor});
  };

  render() {
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
