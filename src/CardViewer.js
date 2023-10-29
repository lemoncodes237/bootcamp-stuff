import logo from './logo.svg';
import React from 'react';
import './CardViewer.css';
import './CardEditor.css';

import {Link,withRouter} from 'react-router-dom';
import {firebaseConnect,isLoaded,isEmpty} from 'react-redux-firebase';
import {connect} from 'react-redux';
import {compose} from 'redux';

class CardViewer extends React.Component {
    constructor(props)  {
        super(props);

        this.escFunction = this.escFunction.bind(this);

        this.state = { 
            flipped: false, 
            index: 0,
            order: null,
            starOnly: false,
            orderLoaded: false
        };
    }

    escFunction(event){
        if(event.key === "ArrowRight") {
            this.changeCard(this.state.index+1);
        } else if(event.key === "ArrowLeft") {
            this.changeCard(this.state.index-1);
        } else if(event.key === "s" || event.key === "S")  {
            //console.log("Hi");
            //this.props.cards[this.state.order[this.state.index]]['starred'] = !this.props.cards[this.state.order[this.state.index]]['starred'];
            const newStar = !this.props.cards[this.state.order[this.state.index]]['starred'];
            /*starCard = index =>  {
                const cards = this.state.cards.slice();
                cards[index]['starred'] = !cards[index]['starred'];
                this.setState({ cards });
            };
            this.props.starCard(this.state.order[this.state.index]);*/

            const deckId = this.props.match.params.deckId;

            this.props.firebase.ref('/flashcards/' + deckId + '/cards/' + this.state.order[this.state.index]).update({'starred':newStar});
        }
    }
    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }

    flip = (card) => {
       this.setState({flipped: !this.state.flipped });
       card.target.classList.toggle('flipped');
    };

    changeCard = index => {
        if(index < 0 || index >= this.state.order.length)  {
            return;
        }
        this.setState({
            flipped: false,
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

        this.setState({index: 0, order, starOnly: !this.state.starOnly});
    };

    resetOrder = () => {
        const order = this.state.order.slice();
        order.sort();
        this.setState({index: 0, order});
    };

    componentDidUpdate(prevProps) {
        // Check that the state array isn't initialized yet
        if (this.props.cards !== prevProps.cards && !this.state.orderLoaded) {
            let order = [];
            for(let i = 0; i < this.props.cards.length; i++)  {
                order[i] = i;
            }

            console.log("Order reset");
            
            this.setState({ order, orderLoaded: true });
        }
    }

    render() {

        if(!isLoaded(this.props.cards))  {
            return <div>No one is ever gonna read this. So why do I bother? Uhh fun fact: I once ordered lemon slices at McDonald's</div>;
        }

        if(isEmpty(this.props.cards))  {
            return <div>Page not found</div>;
        }

        let order = [];

        if(!this.state.order)  {
            for(let i = 0; i < this.props.cards.length; i++)  {
                order[i] = i;
            }
        } else  {
            order = this.state.order.slice();
        }
        let card;
        /*if(this.props.cards[this.state.order[this.state.index]].starred)  {
            card = (<button className="starredCard" onClick={this.flip}>{this.state.text}</button>);
        } else  { */

        let classes = "card";
        if(this.props.cards[order[this.state.index]]['starred'])  {
            classes = classes + " starredCard";
        }
        if(this.state.flipped)  {
            classes = classes + " reverse";
        }

        card = (
            <div className={classes} onClick={this.flip}>
                <div className="card-front">
                    {this.props.cards[order[this.state.index]]['front']}
                </div>
                <div className="card-back">
                    {this.props.cards[order[this.state.index]]['back']}
                </div>
            </div>
        )


        /*if(!this.state.flipped)  {
            if(this.props.cards[order[this.state.index]]['starred'])  {
                card = (
                    <div className="card starredCard" onClick={this.flip}>
                        <div className="card-front">
                            {this.props.cards[order[this.state.index]]['front']}
                        </div>
                        <div className="card-back">
                            {this.props.cards[order[this.state.index]]['back']}
                        </div>
                    </div>
                )
            } else  {
                card = (
                    <div className="card" onClick={this.flip}>
                        <div className="card-front">
                            {this.props.cards[order[this.state.index]]['front']}
                        </div>
                        <div className="card-back">
                            {this.props.cards[order[this.state.index]]['back']}
                        </div>
                    </div>
                )
            }

        } else  {
            if()  {
                card = (
                    <div className="card reverse" onClick={this.flip}>
                        <div className="card-front">
                            {this.props.cards[order[this.state.index]]['front']}
                        </div>
                        <div className="card-back">
                            {this.props.cards[order[this.state.index]]['back']}
                        </div>
                    </div>
                )
            } else  {
                card = (
                    <div className="card reverse" onClick={this.flip}>
                        <div className="card-front">
                            {this.props.cards[order[this.state.index]]['front']}
                        </div>
                        <div className="card-back">
                            {this.props.cards[order[this.state.index]]['back']}
                        </div>
                    </div>
                )
            }
        }*/

        /*if(!this.state.flipped)  {
            if(this.props.cards[order[this.state.index]]['starred'])  {
                card = (
                    <button className="card starredCard"
                    onClick={this.flip}>
                        {this.props.cards[order[this.state.index]]['front']}
                    </button>);
            } else  {
                card = (
                <button className="card"
                onClick={this.flip}>
                    {this.props.cards[order[this.state.index]]['front']}
                </button>);
            }
        } else  {
            if(this.props.cards[order[this.state.index]]['starred'])  {
                card = (
                    <button className="card starredCard reverse"
                    onClick={this.flip}>
                        {this.props.cards[order[this.state.index]]['back']}
                    </button>);
            } else  {
                card = (
                <button className="card reverse"
                onClick={this.flip}>
                    {this.props.cards[order[this.state.index]]['back']}
                </button>);
            }
        }*/
        //}

        let starText = this.state.starOnly ? "All Terms" : "Only Starred Terms";

        return (
            
            <div>
                <h2 className="twovw">{this.props.name}</h2>
                <div className="card-view">
                    {card}
                </div>

                <button onClick={() => {this.changeCard(this.state.index-1)} }>Previous</button>
                <button onClick={() => {this.changeCard(this.state.index+1)} }>Next</button>
                &nbsp; <text>Card {this.state.index + 1} / {order.length}</text>

                <br/>

                <hr/>

                <button onClick={() => {
                    const newOrder = this.shuffle(order);
                    this.setState({index: 0, order: newOrder, flipped: false });
                } }>Randomize</button>

                <button onClick={this.resetOrder}>Normal Order</button>

                <button onClick={this.starFlip}>{starText}</button>
                
                <hr/>

                <Link to="/" className="onevw">Home</Link>
            </div>
        );
    }
}

const mapStateToProps = (state,props) => {
    const deck = state.firebase.data[props.match.params.deckId];
    const name = deck && deck.name;
    const cards = deck && deck.cards;
    return { cards: cards, name: name };
};

export default compose(
    withRouter,

    firebaseConnect(props => {
        const deckId = props.match.params.deckId;
        
        return [
            {path: '/flashcards/' + deckId, storeAs: deckId}
        ]
    }),
    
    connect(mapStateToProps)
)(CardViewer);