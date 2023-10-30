import React from 'react';
import './Home.css';

import {Link} from 'react-router-dom';
import {firebaseConnect,isLoaded} from 'react-redux-firebase';
import {connect} from 'react-redux';
import {compose} from 'redux';

class Homepage extends React.Component {

    constructor(props)  {
        super(props);
    }

    render()  {

        if(!isLoaded(this.props.pages))  {
            return <div>Loading...</div>;
        }

        const allCards = Object.keys(this.props.pages).map((key) =>  {
            let path = '/viewer/' + key;
            return (
                <div key={key}>
                    <Link to={path}>
                        <div className="select_card">
                            <div className="select_card-front">{this.props.pages[key]['name']}</div>
                            <div className="select_card-back">{this.props.pages[key]['name']}</div>
                        </div>
                    </Link>
                    <br/>
                </div>
            );
        });

        /*for(let i = 0; i < this.props.pages.length; i++)  {
            let path = '/viewer/' + ids[i].
            allCards += <Link to={path}>{this.props.pages[ids[i]]['name']}</Link>;
        }*/

        return (
            <div>
                <div className="header">Datamatch Comp-let (Totally not a plagiarized Quizlet nope)</div>
                <br/>

                <div className="center">
                <Link to="/editor" className="fiftypercent">
                    <div className="editor_card">
                        <div className="editor_card-front">Create new flashcard</div>
                        <div className="editor_card-back">Create new flashcard</div>
                    </div>
                </Link>
                </div>

                <br/>
                <div className="header2">Flashcards</div>
                <div className="grid-container">{allCards}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const pages = state.firebase.data['homepage'];
    return { pages: pages };
};

export default compose(
    firebaseConnect(['/homepage']),

    connect(mapStateToProps)
)(Homepage);