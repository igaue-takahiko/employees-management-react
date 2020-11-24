import React from 'react';
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import styles from './App.module.css';
import { Auth, MainPage } from './components';
import StateContextProvider from './context/StateContext';

const client = new ApolloClient({
    uri: "http://127.0.0.1:8000/graphql/",
    headers: {
        Authorization: localStorage.getItem("token")
            ? `JWT ${localStorage.getItem("token")}`
            : "",
    },
    cache: new InMemoryCache()
});

const App = () => {
    return (
        <ApolloProvider client={client}>
            <StateContextProvider>
                <div className={styles.app}>
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={Auth} />
                            <Route exact path="/employees" component={MainPage} />
                        </Switch>
                    </BrowserRouter>
                </div>
            </StateContextProvider>
        </ApolloProvider>
    );
}

export default App;
