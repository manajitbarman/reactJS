import React from 'react'
import { connect } from 'react-redux';

class Demo extends React.Component {
    render() {
        return(
            <div>Demo</div>
        )
    }
}

export default connect(null, null)(Demo);