import React from 'react'
import { Button, makeStyles } from '@material-ui/core'

const useStyle = makeStyles((theme) => ({
    button: {
        backgroundColor: theme.palette.grey["300"],
        fontSize: 16,
        height: 40,
        marginBottom: 16,
        width: 140,
    }
}))

const GreyButton = (props) => {
    const classes = useStyle()
    return (
        <Button className={classes.button} variant="contained" disabled={props.disabled} onClick={() => props.onClick()}>
            {props.label}
        </Button>
    )
}

export default GreyButton
