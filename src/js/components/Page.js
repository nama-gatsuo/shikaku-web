import React from 'react'
import $ from 'jquery'

import Menu from './Menu'
import GameButtons from './GameButtons'

export default class Page extends React.Component {

    constructor(props) {
        super(props);
        // Menu に渡す flag をstateに保持

        this.state =  {
            showMenu: false,
            isGame: props.params.slug == "special"
        };
    }

    componentDidMount() {
        this.fadeInSubTitle();
    }

    componentDidUpdate() {
        this.fadeInSubTitle();
    }

    fadeInSubTitle() {
        // 初回訪問、ページ更新時にアニメーション
        $("#header-title-sub").css({
            opacity: 0.0
        }).velocity({
            opacity: 1.0
        }, { duration: 1000 });
    }

    componentWillReceiveProps(nextProps) {
        // 新しくpropsが渡った時、つまりurlが変わった時、
        // メニューを閉じ、/special/であれば flagをたてる

        if (nextProps.params.slug == "special") {
            this.setState({ showMenu: false, isGame: true });
        } else {
            this.setState({ showMenu: false, isGame: false });
        }
    }

    onClick() {

        if (this.state.showMenu) {

            this.setState({ showMenu: false });

            $("#header-switch").velocity({
                rotateZ: "+=360deg"
            }, { duration: 500, easing: "ease-out" });

        } else {

            this.setState({ showMenu: true });

            $("#header-switch").velocity({
                rotateZ: "-=360deg"
            }, { duration: 500, easing: "ease-out" });
        }

    }

    render() {
        var t;
        if (this.props.route.path) {
            t = " ." + this.props.params.slug;
        } else {
            t = " ";
        }

        return (
            <div>
                <header id="header">
                    <div className="header-title">
                        <span>SHIKAKU</span>
                        <span id="header-title-sub">{t}</span>
                    </div>
                    <div id="header-switch" onClick={ this.onClick.bind(this) }></div>
                    {this.props.children}
                </header>
                <Menu open={this.state.showMenu} />
                <GameButtons open={this.state.isGame} />
            </div>
        );
    }
}
