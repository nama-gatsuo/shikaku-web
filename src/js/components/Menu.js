import React from 'react'
import { Link } from 'react-router'
import $ from 'jquery'

import data from '../data'

/* 環境依存 */
var dir = data.dir.test;

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [
                { name: 'top', path: dir },
                { name: 'artist', path: dir + 'artist/' },
                { name: 'concept', path: dir + 'concept/' },
                { name: 'info', path: dir + 'info/' },
                { name: 'special', path: dir + 'special/' }
            ],
            open: props.open
        };

    }

    open() {
        var $items = $(".menu-item");

        for (var i = 0; i < $items.length; i++) {
            $($items[i]).velocity({
                top: (54 * i) + "px", opacity: 1.0
            }, {
                duration: 1000, easing: "ease-out", delay: i * 100
            });
        }
    }

    close() {

        var $items = $(".menu-item");

        for (var i = 0; i < $items.length; i++) {
            $($items[i]).velocity({
                top: "0px", opacity: .0
            }, {
                duration: 1000, easing: "ease-out", delay: i * 100,
                complete: ()=> { this.setState({ open: false }) }
            });
        }

    }

    componentDidUpdate() {

        if (this.state.open) this.open();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.open) this.setState({ open: nextProps.open });
        else this.close();

    }

    render() {
        return this.state.open ? (
            <nav id='menu'>
                <ul className='menu-ul'>
                {this.state.items.map((item) => {
                    return (
                        <li className='menu-item' key={item.path}>
                            <Link to={item.path} activeClassName="active">{item.name}</Link>
                        </li>
                    );
                })}
                </ul>
            </nav>
        ) : null;
    }
}
