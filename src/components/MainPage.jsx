import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import jwtDecode from 'jwt-decode';
import { Grid } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';

import styles from './MainPage.module.css';
import { GET_EMPLOYEES, GET_DEPARTMENTS } from '../queries';
import { EmployeeList, EmployeeCreate, EmployeeDetails } from './employees';

const MainPage = () => {
    const {
        loading: loadingEmployees,
        data: dataEmployees,
        error: errorEmployees,
    } = useQuery(GET_EMPLOYEES);

    const {
        loading: loadingDepartments,
        data: dataDepartments,
        error: errorDepartments,
    } = useQuery(GET_DEPARTMENTS);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            const decodedToken = jwtDecode(localStorage.getItem("token"));
            if (decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
            }
        } else {
            window.location.href = "/";
        }
    }, [errorEmployees, errorDepartments]);

    if (loadingEmployees || loadingDepartments) return <h1>Loading from server</h1>;
    else if (errorEmployees || errorDepartments)
        return (
            <>
                <h1>Employee data fetch error : {errorEmployees.message}</h1>
                <h1>department data fetch error : {errorDepartments.message}</h1>
            </>
        )

    return (
        <div className={styles.mainPage}>
            <h1>
                従業員管理システム
                <ExitToApp
                    className={styles.mainPage__out}
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }}
                />
            </h1>
            <div className="c-section-container">
                <EmployeeCreate dataDepartments={dataDepartments} />
            </div>
            <div className="module-spacer--extra-extra-small"/>
            <Grid container>
                <Grid item xs={5}>
                    <EmployeeList dataEmployees={dataEmployees} />
                </Grid>
                <Grid item xs={4}>
                    <EmployeeDetails />
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        </div>
    )
}

export default MainPage
