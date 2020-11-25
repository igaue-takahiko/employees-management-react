import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import styles from './SearchByAnd.module.css';
import { TextInput } from '../UI-kit';
import { SEARCH_AND_EMPLOYEE } from '../../queries';

const SearchByAnd = () => {
    const [ searchName, setSearchName ] = useState("");
    const [ searchJoin, setSearchJoin ] = useState(2020);
    const [ searchDept, setSearchDept ] = useState("");

    const [
        searchAndEmployee,
        { data: dataSearchAnd, error: errorSearchAnd },
    ] = useLazyQuery(SEARCH_AND_EMPLOYEE, {
        fetchPolicy: "network-only",
    });

    return (
        <>
            <h2 className={styles.searchByAnd__title}>従業員検索</h2>
            <div className="c-section-container">
            <TextInput
                type="text" value={searchName} label="従業員名" multiline={false}
                rows={1} fullWidth={true} required={true}
                onChange={e => setSearchName(e.target.value)}
            />
            <TextInput
                type="number" value={searchJoin} label="勤務開始年" multiline={false}
                rows={1} fullWidth={true} required={true} min="0"
                onChange={e => setSearchJoin(e.target.value || 0)}
            />
            <TextInput
                type="text" value={searchDept} label="部署名" multiline={false}
                rows={1} fullWidth={true} required={true}
                onChange={e => setSearchDept(e.target.value)}
            />
            </div>
            <IconButton
                className={styles.searchByAnd__searchIcon}
                onClick={async () => {
                    let tempData;
                    if (searchJoin === 0) {
                        tempData = null;
                    } else {
                        tempData = searchJoin;
                    }
                    await searchAndEmployee({
                        variables: {
                            name: searchName,
                            joinYear: tempData,
                            dept: searchDept,
                        }
                    });
                    setSearchName("");
                    setSearchJoin(0);
                    setSearchDept("");
                }}
            >
                <Search />
            </IconButton>
            <div className="module-spacer--extra-small"/>
            <ul className={styles.searchByAnd__list}>
                {errorSearchAnd && <h2>{errorSearchAnd.message}</h2>}
                {dataSearchAnd &&
                    dataSearchAnd.allEmployees &&
                    dataSearchAnd.allEmployees.edges.map(employee => (
                        <li className={styles.searchByAnd__item} key={employee.node.id}>
                            {employee.node.name}{" / "}
                            {employee.node.joinYear}{" / "}
                            {employee.node.department.deptName}
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default SearchByAnd
