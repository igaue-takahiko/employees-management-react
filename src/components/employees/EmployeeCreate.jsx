import React, { useContext } from 'react'
import { useMutation } from '@apollo/client';
import { makeStyles, Button, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';

import styles from './EmployeeCreate';
import { TextInput } from '../UI-kit';
import { StateContext } from '../../context/StateContext';
import { CREATE_EMPLOYEE, GET_EMPLOYEES, UPDATE_EMPLOYEE } from '../../queries';

const useStyle = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 140,
    },
    button: {
        backgroundColor: theme.palette.primary.main,
        color: "#000",
        fontSize: 16,
        height: 48,
        marginBottom: 16,
        width: 140,
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        }
    }
}))

const EmployeeCreate = ({ dataDepartments }) => {
    const classes = useStyle()

    const {
        name,
        setName,
        joinYear,
        setJoinYear,
        selectedDept,
        setSelectedDept,
        editedId,
        setEditedId,
    } = useContext(StateContext);

    const [ createEmployee ] = useMutation(CREATE_EMPLOYEE, {
        refetchQueries: [{ query: GET_EMPLOYEES }],
    });
    const [ updateEmployee ] = useMutation(UPDATE_EMPLOYEE, {
        refetchQueries: [{ query: GET_EMPLOYEES }],
    });

    const selectOption = dataDepartments?.allDepartments.edges.map(dept => (
        <MenuItem key={dept.node.id} value={dept.node.id}>
            {dept.node.deptName}
        </MenuItem>
    ));

    return (
        <>
            <div className={styles.employeeCreate__input}>
                <TextInput
                    type="text" value={name} label="Employee name"
                    rows={1} fullWidth={true} required={true}
                    multiline={false}
                    onChange={e => setName(e.target.value)}
                />
                <TextInput
                    type="number" value={joinYear} label="year of join"
                    rows={1} fullWidth={true} required={true}
                    multiline={false}
                    onChange={e => setJoinYear(e.target.value)}
                />
            </div>
            <FormControl className={classes.formControl}>
                <InputLabel>select</InputLabel>
                <Select
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                >
                    {selectOption}
                </Select>
            </FormControl>
            <div className="module-spacer--extra-extra-small" />
            <Button
                className={classes.button}
                disabled={!selectedDept || !name || !joinYear}
                onClick={
                    editedId
                        ? async () => {
                            try {
                                await updateEmployee({
                                    variables : {
                                        id: editedId,
                                        name: name,
                                        joinYear: joinYear,
                                        department: selectedDept,
                                    }
                                });
                            } catch (error) {
                                alert(error.message);
                            };
                            setEditedId("");
                            setName("");
                            setJoinYear(2020);
                            setSelectedDept("");
                        }
                        : async () => {
                            try {
                                await createEmployee({
                                    variables: {
                                        name: name,
                                        joinYear: joinYear,
                                        department: selectedDept,
                                    }
                                });
                            } catch (error) {
                                alert(error.message)
                            };
                            setName("");
                            setJoinYear(2020);
                            setSelectedDept("");
                        }
                }
            >
                {editedId ? "Update" : "Create"}
            </Button>
        </>
    )
}

export default EmployeeCreate
