import logo from './logo.svg';
import './CardEditor.css'
import React from 'react';
import './main.css'

import {Link,withRouter} from 'react-router-dom';
import {firebaseConnect} from 'react-redux-firebase';
import {compose} from 'redux';

class CardEditor extends React.Component {
    constructor(props)  {
        super(props);
        this.state = { front: '', back: '', invalid: false, starred: false,
        cards: [
            { front: 'front', back: 'back', starred: false }
          ],

        name: ''
         };
         
    }

    createDeck = () => {
        const deckId = this.props.firebase.push('/flashcards').key;
        const updates = {};
        const newDeck = {cards: this.state.cards, name: this.state.name};
        updates['/flashcards/' + deckId] = newDeck;
        updates['/homepage/' + deckId] = { name: this.state.name };
        const onComplete = () => {
            console.log('database updated!');
            this.props.history.push('/viewer/' + deckId);
        };
        // Always update simultaneously! (Something bad might happen between updates)
        this.props.firebase.update('/', updates, onComplete);
    }

    addCard = () => {
        this.setState({front: this.state.front.trim(), back: this.state.back.trim()});

        if(!this.state.front.trim() | !this.state.back.trim())  {
            this.setState({front: '', back: '', invalid: true});
            return;
        }

        const card = { front: this.state.front, back: this.state.back, starred: this.state.starred }
        const cards = this.state.cards.slice().concat(card);
        this.setState({front: '', back: '', invalid: false, cards});
    };

    changeCard = index => {
        return event => {
            const cards = this.state.cards.slice();
            if(event.target.name === "front") {
            cards[index].front = event.target.value;
            } else  {
            cards[index].back = event.target.value;
            }
            this.setState({ cards });
        //this.props.changeCard(index, event.target.name, event.target.value);
    };};

    deleteCard = index => {
        const cards = this.state.cards.slice();
        cards.splice(index, 1);
        this.setState({ cards });
    };
    

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    starCard = index =>  {
        const cards = this.state.cards.slice();
        cards[index]['starred'] = !cards[index]['starred'];
        this.setState({ cards });
    };

    render() {
        const cards = this.state.cards.map((card, index) =>  {
            let starButton;

            if(card.starred)  {
                starButton = (<button className="star" onClick={() => this.starCard(index)}>
                    Starred
                </button>);
            } else  {
                starButton = (<button onClick={() => this.starCard(index)}>
                    Add Star
                </button>);
            }

            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td><input
                    name="front"
                    onChange={this.changeCard(index)}
                    placeholder="Front of card"
                    value={this.state.cards[index].front}/></td>
                    
                    <td><input
                    name="back"
                    onChange={this.changeCard(index)}
                    placeholder="Back of card"
                    value={this.state.cards[index].back}/></td>

                    <td>
                        <button onClick={() => this.deleteCard(index)}>
                            Delete Card
                        </button>
                    </td>

                    <td>
                        {starButton}
                    </td>
                </tr>
            );
        });

        const invalidCard = this.state.invalid ? (<>&nbsp; Invalid Card</>) : (<></>);

        return (
            <div>
                <h2 className="twovw">Card Editor</h2>
                <div>
                    <text>Deck name:{' '}</text>
                    <input 
                        name='name'
                        onChange={this.handleChange} 
                        placeholder='Name of deck' 
                        value={this.state.name}
                    />
                </div>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Front</th>
                            <th>Back</th>
                            <th>Delete</th>
                            <th>Star</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards}
                    </tbody>
                </table>
                <br/>
                <input 
                name="front"
                onChange={this.handleChange} placeholder="Front of card" value={this.state.front} />
                
                <input 
                name="back"
                onChange={this.handleChange} placeholder="Back of card" value={this.state.back} />
                
                <button onClick={this.addCard}>Add Card</button>

                {invalidCard}
                <hr/>
                <div>
                    <button
                        disabled={this.state.name.trim() === '' || this.state.cards.length === 0}
                        onClick={this.createDeck}
                    >Create deck</button>
                </div>

                <br/>
            
                <Link to="/" className="onevw">Home</Link>
            </div>
        );
    }
}

export default compose(firebaseConnect(), withRouter)(CardEditor);