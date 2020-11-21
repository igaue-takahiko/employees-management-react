import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client';
import jwtDecode from 'jwt-decode';
import { FlipCameraAndroid } from '@material-ui/icons';
import { Typography, makeStyles, Button } from '@material-ui/core';

import { GET_TOKEN, CREATE_USER } from '../queries';
import { TextInput } from './UI-kit';
import styles from './Auth.module.css';

const useStyle = makeStyles(theme => ({
    "button":{
        backgroundColor: theme.palette.primary.main,
        color: "#000",
        fontSize: 16,
        height: 48,
        marginBottom: 16,
        width: 256,
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        }
    }
}))

const Auth = () => {
    const classes = useStyle()
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ isLogin, setIsLogin ] = useState(true);

    const [ getToken ] = useMutation(GET_TOKEN);
    const [ createUser ] = useMutation(CREATE_USER);

    const authUser = async event => {
        event.preventDefault();
        if (isLogin) {
            try {
                const result = await getToken({
                    variables: { username: username, password: password },
                });
                localStorage.setItem("token", result.data.tokenAuth.token);
                result.data.tokenAuth.token && (window.location.href = "/employees")
            } catch (error) {
                alert(error.message);
            }
        } else {
            try {
                await createUser({
                    variables: { username: username, password: password },
                });
                const result = await getToken({
                    variables: { username: username, password: password },
                });
                localStorage.setItem("token", result.data.tokenAuth.token);
                result.data.tokenAuth.token && (window.location.href = "/employees");
            } catch (error) {
                alert(error.message);
            }
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            const decodedToken = jwtDecode(localStorage.getItem("token"));
            if (decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
            } else {
                window.location.href = "/employees";
            }
        }
    },[])

    return (
        <div className={styles.auth}>
            <form onSubmit={authUser}>
            <Typography variant="h4" color="primary">{isLogin ? "Sign in" : "Sign up"}</Typography>
                <div className={styles.auth__input}>
                    <TextInput
                        type="text" value={username} label="Username" multiline={false}
                        rows={1} fullWidth={true} required={true}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className={styles.auth__input}>
                    <TextInput
                        type="password" value={password} label="Password" multiline={false}
                        rows={1} fullWidth={true} required={true}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="module-spacer--small" />
                <Button className={classes.button} type="submit">
                    {isLogin ? "Login with JWT": "Create new user"}
                </Button>
                <div>
                    <FlipCameraAndroid
                        className={styles.auth__toggle}
                        onClick={() => setIsLogin(!isLogin)}
                    />
                </div>
            </form>
        </div>
    )
}

export default Auth
