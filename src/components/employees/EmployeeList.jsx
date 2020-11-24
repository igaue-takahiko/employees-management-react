import React, { useContext } from 'react';
import { IconButton, Divider } from '@material-ui/core';
import { Delete, DragIndicator, Edit } from '@material-ui/icons';
import { useMutation } from '@apollo/client';

import styles from './EmployeeList.module.css';
import { GET_EMPLOYEES, DELETE_EMPLOYEE } from '../../queries';
import { StateContext } from '../../context/StateContext';

const EmployeeList = ({ dataEmployees }) => {
    const {
        setName,
        setJoinYear,
        setEditedId,
        setSelectedDept,
        dataSingleEmployee,
        getSingleEmployee,
    } = useContext(StateContext);

    const [ deleteEmployee ] = useMutation(DELETE_EMPLOYEE, {
        refetchQueries: [{ query: GET_EMPLOYEES }],
    });

    return (
        <>
            <h2 className={styles.employeeList__title}>従業員リスト</h2>
            <div className="module-spacer--extra-extra-small" />
            <ul className={styles.employeeList__list}>
                {dataEmployees &&
                    dataEmployees.allEmployees &&
                    dataEmployees.allEmployees.edges.map((employee) => (
                        <li className={styles.employeeList__item} key={employee.node.id}>
                            <span>
                                {employee.node.name} {"/"}
                                {employee.node.joinYear} {"/"}
                                {employee.node.department.deptName}
                                <div className="module-spacer--extra-extra-small" />
                                <Divider />
                            </span>
                            <div>
                                <IconButton
                                    className={styles.employeeList__delete}
                                    onClick={async () => {
                                        try {
                                            await deleteEmployee({
                                                variables: { id: employee.node.id },
                                            });
                                        } catch (error) {
                                            alert(error.message);
                                        }
                                        if (employee.node.id === dataSingleEmployee?.employee.id) {
                                            await getSingleEmployee({
                                                variables: { id: employee.node.id },
                                            });
                                        }
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                                <IconButton
                                    className={styles.employeeList__edit}
                                    onClick={() => {
                                        setEditedId(employee.node.id);
                                        setName(employee.node.name);
                                        setJoinYear(employee.node.joinYear);
                                        setSelectedDept(employee.node.department.id);
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    className={styles.employeeList__delete}
                                    onClick={async () => {
                                        try {
                                            await getSingleEmployee({
                                                variables: { id: employee.node.id },
                                            });
                                        } catch (error) {
                                            alert(error.message);
                                        }
                                    }}
                                >
                                    <DragIndicator />
                                </IconButton>
                                <Divider />
                            </div>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default EmployeeList
