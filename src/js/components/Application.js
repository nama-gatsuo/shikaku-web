import React from 'react'
import Shikaku from './wgl/Shikaku'

export default class Application extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.shikaku = new Shikaku();

        this.updateShikakuView();

    }

    updateShikakuView() {
        var s = this.props.params.slug;
        if (s) {
            this.shikaku.moveCamera(s);

            if (s == "special") {
                this.shikaku.createGame();
            } else {
                this.shikaku.deleteGame();
            }

        } else {
            this.shikaku.moveCamera("top");
            this.shikaku.deleteGame();
        }
    }


    componentDidUpdate() {

        this.updateShikakuView();

    }

    render() {
        return (
            <div>
                <div id='container-gl' />
                {this.props.children}
            </div>
        );
    }
}
