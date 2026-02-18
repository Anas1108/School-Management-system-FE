import React, { useState } from 'react'
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination, Box, Typography } from '@mui/material';

const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows, count, page: propPage, rowsPerPage: propRowsPerPage, onPageChange, onRowsPerPageChange }) => {
    const [internalPage, setInternalPage] = useState(0);
    const [internalRowsPerPage, setInternalRowsPerPage] = useState(5);

    // Determine if we are using server-side pagination
    const isServerSide = count !== undefined;

    const page = isServerSide ? propPage : internalPage;
    const rowsPerPage = isServerSide ? propRowsPerPage : internalRowsPerPage;
    const totalCount = isServerSide ? count : rows.length;

    const handleChangePage = (event, newPage) => {
        if (isServerSide) {
            onPageChange(event, newPage);
        } else {
            setInternalPage(newPage);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        if (isServerSide) {
            onRowsPerPageChange(event);
        } else {
            setInternalRowsPerPage(parseInt(event.target.value, 10));
            setInternalPage(0);
        }
    };

    return (
        <Box sx={{
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-paper)',
        }}>
            <TableContainer sx={{ maxHeight: '75vh' }}>
                <Table stickyHeader aria-label="data table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="center">
                                Actions
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 ? (
                            (isServerSide ? rows : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage))
                                .map((row) => {
                                    return (
                                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <StyledTableCell key={column.id} align={column.align}>
                                                        {
                                                            column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value
                                                        }
                                                    </StyledTableCell>
                                                );
                                            })}
                                            <StyledTableCell align="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'nowrap' }}>
                                                    <ButtonHaver row={row} />
                                                </Box>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={columns.length + 1} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                                        No records found
                                    </Typography>
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {(rows.length > 0 || isServerSide) && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: '1px solid var(--border-color)',
                        '& .MuiTablePagination-toolbar': {
                            fontFamily: 'var(--font-family-sans)',
                            color: 'var(--text-secondary)',
                        },
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontFamily: 'var(--font-family-sans)',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                        },
                        '& .MuiTablePagination-select': {
                            fontFamily: 'var(--font-family-sans)',
                        },
                    }}
                />
            )}
        </Box>
    )
}

export default TableTemplate