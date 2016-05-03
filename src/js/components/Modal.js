import React from 'react'
import Link from 'react-router'

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("modal");
    }

    componentDidUpdate() {

    }

    render() {
        return (
            <div>Modal</div>
        );
    }
}
