import logo from './logo.svg';
import './CardEditor.css'
import React from 'react';

class CardEditor extends React.Component {
    constructor(props)  {
        super(props);
        this.state = { front: '', back: '', invalid: false, starred: false };
    }

    addCard = () => {
        this.setState({front: this.state.front.trim(), back: this.state.back.trim()});

        if(!this.state.front.trim() | !this.state.back.trim())  {
            this.setState({front: '', back: '', invalid: true});
            return;
        }

        this.props.addCard(this.state);
        this.setState({front: '', back: '', invalid: false});
    };

    changeCard = index => {
        return event => {
        this.props.changeCard(index, event.target.name, event.target.value);
    };};

    deleteCard = index => this.props.deleteCard(index);
    

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    starCard = index =>  {
        this.props.starCard(index);
    };

    render() {
        const cards = this.props.cards.map((card, index) =>  {
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
                    value={this.props.cards[index].front}/></td>
                    
                    <td><input
                    name="back"
                    onChange={this.changeCard(index)}
                    placeholder="Back of card"
                    value={this.props.cards[index].back}/></td>

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
                <h2>Card Editor</h2>
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
                <button onClick={this.props.switchMode}>Go to Card Viewer</button>
            </div>
        );
    }
}

export default CardEditor;