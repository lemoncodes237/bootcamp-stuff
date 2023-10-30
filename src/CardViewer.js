import React from 'react';
import './CardViewer.css';
import './CardEditor.css';
import './Home.css';

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
            orderLoaded: false,
            currCard: null
        };
    }

    escFunction(event){
        if(event.key === "ArrowRight") {
            this.changeCard(this.state.index+1);
        } else if(event.key === "ArrowLeft") {
            this.changeCard(this.state.index-1);
        } else if(event.key === "s" || event.key === "S")  {
            const newStar = !this.props.cards[this.state.order[this.state.index]]['starred'];

            const deckId = this.props.match.params.deckId;

            this.props.firebase.ref('/flashcards/' + deckId + '/cards/' + this.state.order[this.state.index]).update({'starred':newStar});

            this.updateCard(this.state.order, this.state.index, this.state.flipped, false, true, newStar);
        } else if(event.key === " ")  {
            this.flip();
        }
    }
    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }

    flip = () => {
       this.setState({flipped: !this.state.flipped });
       this.updateCard(this.state.order, this.state.index, !this.state.flipped);
    };

    changeCard = index => {
        if(index < 0 || index >= this.state.order.length)  {
            return;
        }
        this.setState({
            flipped: false,
            index
        });

        this.updateCard(this.state.order, index, false, true);
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

        this.updateCard(order, 0, false);
    };

    resetOrder = () => {
        const order = this.state.order.slice();
        order.sort();
        this.setState({index: 0, order});

        this.updateCard(order, 0, false);
    };

    componentDidUpdate(prevProps) {
        // Check that the state array isn't initialized yet
        if (this.props.cards !== prevProps.cards && !this.state.orderLoaded) {
            let order = [];
            for(let i = 0; i < this.props.cards.length; i++)  {
                order[i] = i;
            }
            
            this.setState({ order, orderLoaded: true });

            this.updateCard(order, 0, false);
        }
    }
    
    updateCard = (order, index, flipped, moving, checkStar, starred) => {
        if(!isLoaded(this.props.cards))  {
            return;
        }
        let classes = "card hundredpercent";
        if(checkStar)  {
            if(starred)  {
                classes = classes + " starredCard";
            }
        } else if(this.props.cards[order[index]]['starred'])  {
            classes = classes + " starredCard";
        }
        if(flipped)  {
            classes = classes + " reverse";
        }
        if(moving)  {
            classes = classes + " quickchange";
        }
        let currCard = (
            <div className={classes} onClick={this.flip}>
                <div className="card-front">
                    {this.props.cards[order[index]]['front']}
                </div>
                <div className="card-back">
                    {this.props.cards[order[index]]['back']}
                </div>
            </div>
        )
        this.setState({currCard});
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

        let starText = this.state.starOnly ? "All Terms" : "Only Starred Terms";

        return (
            
            <div>
                <div className="centerviewer bgheader">
                    <div className="onefivevw">{this.props.name}</div>
                    <div className="break"></div>
                    <div className="onevw">Card {this.state.index + 1} / {order.length}</div>
                </div>
                <br/>
                <div className="center">
                    <div className="fiftypercent">
                        {this.state.currCard}
                    </div>
                    <div className="break"></div>
                    <button onClick={() => {this.changeCard(this.state.index-1)} }>←</button>
                    <div className="horizontalgap" style={{width:"10px"}}></div>
                    <button onClick={() => {this.changeCard(this.state.index+1)} }>→</button>
                </div>

                <br/>

                <hr/>

                <div className="center smallheight">

                    <button onClick={() => {
                        const newOrder = this.shuffle(order);
                        this.setState({index: 0, order: newOrder, flipped: false });
                        this.updateCard(newOrder, 0, false, true);
                    } }>Shuffle</button>

                    <div className="horizontalgap" style={{width:"10px"}}></div>

                    <button onClick={this.resetOrder}>Normal Order</button>

                    <div className="horizontalgap" style={{width:"10px"}}></div>

                    <button onClick={this.starFlip}>{starText}</button>

                </div>
                
                <hr/>

                <Link to="/" className="onevw">Back to Home</Link>
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