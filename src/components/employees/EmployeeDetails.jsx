import React, { useContext } from 'react';
import { StateContext } from '../../context/StateContext';
import { Divider } from '@material-ui/core';

import styles from './EmployeeDetails.module.css';

const EmployeeDetails = () => {
    const { dataSingleEmployee, errorSingleEmployee } = useContext(StateContext)

    return (
        <>
            <h2 className={styles.employeeDetails__title}>従業員詳細情報</h2>
            <div className="module-spacer--small" />
            {errorSingleEmployee && errorSingleEmployee.message}
            {dataSingleEmployee && dataSingleEmployee.employee && (
                <div className={styles.employeeDetails__list}>
                    <div className="module-spacer--small" />
                    <h2>{`ID: ${dataSingleEmployee.employee.id}`}</h2>
                    <Divider />
                    <div className="module-spacer--small" />
                    <h2>{`名前 ${dataSingleEmployee.employee.name}`}</h2>
                    <Divider />
                    <div className="module-spacer--small" />
                    <h2>{`勤務開始年 ${dataSingleEmployee.employee.joinYear}`}</h2>
                    <Divider />
                    <div className="module-spacer--small" />
                    <h2>{`部署名 ${dataSingleEmployee.employee.department.deptName}`}</h2>
                    <Divider />
                    <div className="module-spacer--small" />
                </div>
            )}
        </>
    )
}

export default EmployeeDetails
