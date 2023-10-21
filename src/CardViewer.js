import logo from './logo.svg';
import React from 'react';
import './CardViewer.css';

import {Link} from 'react-router-dom';

class CardViewer extends React.Component {
    constructor(props)  {
        super(props);
        const order = [];
        for(let i = 0; i < props.cards.length; i++)  {
            order[i] = i;
        }
        this.escFunction = this.escFunction.bind(this);

        this.state = { 
            front: this.props.cards[0].front, 
            back: this.props.cards[0].back, 
            flipped: false, 
            text: this.props.cards[0].front, 
            index: 0,
            order: order,
            starOnly: false
        };
    }

    escFunction(event){
        if (event.key === " ") {
            this.flip();
        } else if(event.key === "ArrowRight") {
            this.changeCard(this.state.index+1);
        } else if(event.key === "ArrowLeft") {
            this.changeCard(this.state.index-1);
        } else if(event.key === "s" || event.key === "S")  {
            this.props.starCard(this.state.order[this.state.index]);
        }
    }
    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }

    flip = () => {
       this.setState({flipped: !this.state.flipped, text: this.state.flipped ? this.state.front : this.state.back });
    };

    changeCard = index => {
        if(index < 0 || index >= this.state.order.length)  {
            return;
        }
        this.setState({
            flipped: false,
            front: this.props.cards[this.state.order[index]].front,
            back: this.props.cards[this.state.order[index]].back,
            text: this.props.cards[this.state.order[index]].front,
            index
        });
    };

    shuffle = array => {
        let copy = array.slice();
        let size = array.length;
        let newArray = [];
      
        // Pick a random remaining element each time
        for (let i = 0; i < size; i++) {
            let randomIndex = Math.floor(Math.random() * (size - i));

            newArray[i] = copy[randomIndex];
            copy.splice(randomIndex, 1);
        }
      
        return newArray;
      };

    starFlip = () => {
        const order = [];
        if(this.state.starOnly)  {
            for(let i = 0; i < this.props.cards.length; i++)  {
                order[i] = i;
            }

        } else  {
            this.starOnly = true;
            let numStarred = 0;
            let index = 0;
            this.props.cards.forEach(card => {
                if(card.starred)  {
                    order[numStarred] = index;
                    numStarred++;
                }
                index++;
            });

            // Avoid errors if no term is starred
            if(numStarred === 0) return;
        }

        this.setState({index: 0, order, front:this.props.cards[order[0]].front,
            back:this.props.cards[order[0]].back, text:this.props.cards[order[0]].front, starOnly: !this.state.starOnly});
    };

    resetOrder = () => {
        const order = this.state.order.slice();
        order.sort();
        this.setState({index: 0, order, front:this.props.cards[this.state.order[0]].front,
            back:this.props.cards[this.state.order[0]].back, text:this.props.cards[this.state.order[0]].front});
    };

    render() {

        let card;
        if(this.props.cards[this.state.order[this.state.index]].starred)  {
            card = (<button className="starredCard" onClick={this.flip}>{this.state.text}</button>);
        } else  { 
            card = (
            <button className="card"
            onClick={this.flip}>
                {this.state.text}
            </button>);
        }

        let starText = this.state.starOnly ? "All Terms" : "Only Starred Terms";

        return (
            
            <div>
                <h2>Card Viewer</h2>
                <div className="card-view">
                    {card}
                </div>

                <button onClick={() => {this.changeCard(this.state.index-1)} }>Previous</button>
                <button onClick={() => {this.changeCard(this.state.index+1)} }>Next</button>
                &nbsp; Card {this.state.index + 1} / {this.state.order.length}

                <br/>

                <hr/>

                <button onClick={() => {
                    const newOrder = this.shuffle(this.state.order);
                    this.setState({index: 0, order: newOrder, front:this.props.cards[newOrder[0]].front,
                        back:this.props.cards[newOrder[0]].back, text:this.props.cards[newOrder[0]].front});
                } }>Randomize</button>

                <button onClick={this.resetOrder}>Normal Order</button>

                <button onClick={this.starFlip}>{starText}</button>
                
                <hr/>

                <Link to="/editor">Go to card editor</Link>
            </div>
        );
    }
}

export default CardViewer;