import React from 'react'
import $ from 'jquery'

import data from '../data'

/* 環境依存 */
var imgPath = data.imgPath;

export default class GameButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [ "play", "pause", "resset" ],
            open: props.open
        }
    }

    show() {
        console.log("show");

        $("#game-ul").velocity({
            bottom: "80px", opacity: 1.0
        }, {
            duration: 1000, easing: "ease-out"
        });

    }

    hide() {

        $("#game-ul").velocity({
            bottom: "-300px", opacity: .0
        }, {
            duration: 1000, easing: "ease-out",
        });

        this.setState({ open: false });
    }

    componentDidMount() {
        if (this.state.open) this.show();
    }

    componentDidUpdate() {
        if (this.state.open) this.show();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.open) this.setState({ open: nextProps.open });
        else this.hide();
    }

    render() {

        return (
            <ul id="game-ul">
                {this.state.items.map((item)=>{
                    return (
                        <li id={"game-" + item} className="game-button" key={item}>
                            <img src={imgPath + item + ".svg"} />
                        </li>
                    );
                })}
            </ul>
        );
    }
}
