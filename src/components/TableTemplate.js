import React, { useState } from 'react'
import { StyledTableCell, StyledTableRow } from './styles';
import { Table, TableBody, TableContainer, TableHead, TablePagination, Box, Typography } from '@mui/material';

const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    return (
        <Box sx={{
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-paper)',
        }}>
            <TableContainer>
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
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
            {rows.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
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