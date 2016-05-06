import React from 'react'
import { render } from 'react-dom'
import { Route, Router, IndexRoute } from 'react-router'
import { createHistory } from 'history'

import Application from './components/Application'
import Page from './components/Page'

/* 環境依存 */
var rootPath = '/';

render(
    <Router history={ createHistory() }>
        <Route path={rootPath} component={Application}>

            <IndexRoute component={Page} />
            <Route path=':slug' component={Page} />

        </Route>
    </Router>,
    document.getElementById('container')
);
