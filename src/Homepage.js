import logo from './logo.svg';
import React from 'react';

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
                    {this.props.pages[key]['name']}
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
                <h2>Homepage</h2>
                <Link to="/editor">Create new flashcard</Link>
                <br/>
                <h3>Flashcards</h3>
                {allCards}
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