import logo from './logo.svg';
import React from 'react';

import {Link} from 'react-router-dom';

function Homepage() {
    return (
        <div>
            <Link to="/editor">Go to card editor</Link>
            <br/>
            <Link to="/viewer">Go to card viewer</Link>
        </div>
    )
}

export default Homepage;