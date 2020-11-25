import React, { useContext } from 'react'
import { useMutation } from '@apollo/client';
import { IconButton, Divider } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import styles from './DepartmentList.module.css';
import { GreyButton, TextInput } from '../UI-kit';
import { StateContext } from '../../context/StateContext';
import {
    CREATE_DEPARTMENT,
    DELETE_DEPARTMENT,
    GET_DEPARTMENTS,
    GET_EMPLOYEES,
} from '../../queries';

const DepartmentList = ({ dataDepartments }) => {
    const { deptName, setDeptName } = useContext(StateContext);

    const [ createDept ] = useMutation(CREATE_DEPARTMENT, {
        refetchQueries: [{ query: GET_DEPARTMENTS }]
    });
    const [ deleteDept ] = useMutation(DELETE_DEPARTMENT, {
        refetchQueries: [{ query: GET_DEPARTMENTS }, { query: GET_EMPLOYEES }]
    });

    return (
        <div>
            <h2 className={styles.deptList__title}>部署リスト</h2>
            <div className="module-spacer--extra-small" />
            <div className={styles.deptList}>
            <TextInput
                type="text" value={deptName} label="新規部署名" multiline={false}
                rows={1} fullWidth={true} required={true}
                onChange={e => setDeptName(e.target.value)}
            />
            <div className="module-spacer--extra-small" />
            <GreyButton
                label="新規部署登録"
                disabled={!deptName}
                onClick={async () => {
                    try {
                        await createDept({
                            variables: { deptName: deptName, }
                        });
                    } catch (error) {
                        alert(error.message);
                    }
                    setDeptName("")
                }}
            />
            <ul className={styles.deptList__list}>
                {dataDepartments &&
                    dataDepartments.allDepartments &&
                    dataDepartments.allDepartments.edges.map(employee => (
                        <li className={styles.deptList__item} key={employee.node.id}>
                            <span>{employee.node.deptName}</span>
                            <Divider />
                            <div>
                                <IconButton
                                    className={styles.deptList__delete}
                                    onClick={async () => {
                                        try {
                                            await deleteDept({
                                                variables: { id: employee.node.id }
                                            });
                                        } catch (error) {
                                            alert(error.message);
                                        }
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                                <Divider />
                            </div>
                        </li>
                    ))
                }
            </ul>
            </div>
        </div>
    )
}

export default DepartmentList;
