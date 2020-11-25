import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/client';
import { Grid, IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import styles from './Pagination.module.css';
import { TextInput, GreyButton } from '../UI-kit';
import {
    PAGINATION_FIRST_EMPLOYEE,
    PAGINATION_LAST_EMPLOYEE,
    PAGINATION_MORE_EMPLOYEE,
} from '../../queries';

const NUM_PAGE = 3;

const Pagination = () => {
    const [ first, setFirst ] = useState(0);
    const [ last, setLast ] = useState(0);

    const [
        paginationFirst,
        { data: dataFirst, error: errorFirst },
    ] = useLazyQuery(PAGINATION_FIRST_EMPLOYEE, {
        fetchPolicy: "cache-and-network",
    });

    const [
        paginationLast,
        { data: dataLast, error: errorLast },
    ] = useLazyQuery(PAGINATION_LAST_EMPLOYEE, {
        fetchPolicy: "cache-and-network",
    });

    const {
        data: dataPages,
        error: errorPages,
        loading: LoadingPages,
        fetchMore,
    } = useQuery(PAGINATION_MORE_EMPLOYEE, {
        variables: { first: NUM_PAGE, after: null },
        fetchPolicy: "cache-and-network",
    });

    if (LoadingPages) {
        return <h1>Loading from server...</h1>;
    }

    return (
        <div>
            <Grid container>
                <Grid item xs={4}>
                    <h2>ページネーション(最初)</h2>
                    <div className="module-spacer--extra-small"/>
                    <TextInput
                        type="number" value={first} label="部署名" multiline={false}
                        rows={1} fullWidth={true} required={true} min="0"
                        onChange={e => setFirst(e.target.value)}
                    />
                    <div className="module-spacer--extra-small"/>
                    <IconButton
                        className={styles.pagination__searchIcon}
                        onClick={async () => {
                            await paginationFirst({
                                variables: { first: first },
                            })
                            setFirst(0);
                        }}
                    >
                        <Search />
                    </IconButton>
                    <ul className={styles.pagination__list}>
                        {errorFirst && <h2>{errorFirst.message}</h2>}
                        {dataFirst &&
                            dataFirst.allEmployees &&
                            dataFirst.allEmployees.edges.map(employee => (
                                <li className={styles.pagination__item} key={employee.node.id}>
                                    {employee.node.name}{" / "}
                                    {employee.node.joinYear}{" / "}
                                    {employee.node.department.deptName}
                                </li>
                            ))
                        }
                    </ul>
                </Grid>
                <Grid item xs={4}>
                    <h2>ページネーション(ラスト)</h2>
                    <div className="module-spacer--extra-small"/>
                    <TextInput
                        type="number" value={last} label="部署名" multiline={false}
                        rows={1} fullWidth={true} required={true} min="0"
                        onChange={e => setLast(e.target.value)}
                    />
                    <div className="module-spacer--extra-small"/>
                    <IconButton
                        className={styles.pagination__searchIcon}
                        onClick={async () => {
                            await paginationLast({
                                variables: { last: last, }
                            });
                            setLast(0)
                        }}
                    >
                        <Search />
                    </IconButton>
                    <ul className={styles.pagination__list}>
                        {errorLast && <h2>{errorLast.message}</h2>}
                        {dataLast &&
                            dataLast.allEmployees &&
                            dataLast.allEmployees.edges.map(employee => (
                                <li className={styles.pagination__item} key={employee.node.id}>
                                    {employee.node.name}{" / "}
                                    {employee.node.joinYear}{" / "}
                                    {employee.node.department.deptName}
                                </li>
                            ))
                        }
                    </ul>
                </Grid>
                <Grid item xs={4}>
                    <h2>ページネーション(more)</h2>
                    <ul>
                        {errorPages && <h2>{errorPages.message}</h2>}
                        {dataPages &&
                            dataPages.allDepartments &&
                            dataPages.allDepartments.edges.map(employee => (
                                <li className={styles.pagination__item} key={employee.node.id}>
                                    {employee.node.deptName}
                                </li>
                            ))
                        }
                    </ul>
                    <div className="module-spacer--extra-small"/>
                    {dataPages.allDepartments.pageInfo.hasNextPage && (
                        <GreyButton
                            label="load more"
                            onClick={() => {
                                fetchMore({
                                    variables: {
                                        first: NUM_PAGE,
                                        after: dataPages.allDepartments.pageInfo.endCursor || null,
                                    },
                                    updateQuery: (prevLoad, { fetchMoreResult }) => {
                                        fetchMoreResult.allDepartments.edges = [
                                            ...prevLoad.allDepartments.edges,
                                            ...fetchMoreResult.allDepartments.edges,
                                        ];
                                        return fetchMoreResult;
                                    }
                                })
                            }}
                        />
                    )}
                </Grid>
            </Grid>
        </div>
    )
}

export default Pagination
