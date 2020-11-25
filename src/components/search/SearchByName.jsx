import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import styles from './SearchByName.module.css';
import { TextInput } from '../UI-kit';
import { SEARCH_EMPLOYEE } from '../../queries';

const SearchByName = () => {
    const [ searchByName, setSearchByName ] = useState("");

    const [
        searchEmployee,
        { data: dataSearch, error: errorSearch },
    ] = useLazyQuery(SEARCH_EMPLOYEE, {
        fetchPolicy: "network-only"
    });

    return (
        <>
            <h2 className={styles.searchByName__title}>従業員名検索</h2>
            <div className="c-section-container">
            <TextInput
                type="text" value={searchByName} label="従業員名" multiline={false}
                rows={1} fullWidth={true} required={true}
                onChange={e => setSearchByName(e.target.value)}
            />
            <div className="module-spacer--extra-small"/>
            <IconButton
                className={styles.searchByName__searchIcon}
                onClick={async () => {
                    await searchEmployee({
                        variables: { name: searchByName },
                    });
                    setSearchByName("");
                }}
            >
                <Search />
            </IconButton>
            </div>
            <div className="module-spacer--extra-small"/>
            <ul className={styles.searchByName__list}>
                {errorSearch && <h3>{errorSearch.message}</h3>}
                {dataSearch &&
                    dataSearch &&
                    dataSearch.allEmployees &&
                    dataSearch.allEmployees.edges.map(employee => (
                        <li className={styles.searchByName__item} key={employee.node.id}>
                            {employee.node.name}{" / "}
                            {employee.node.department.deptName}
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default SearchByName
