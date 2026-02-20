import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Container, Typography, Modal, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton,
  Table, TableBody, TableContainer, TableHead, TableRow, Checkbox, TablePagination, Tooltip, InputAdornment, Paper, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getAllComplains, updateComplain, deleteComplain } from '../../../redux/complainRelated/complainHandle';
import CustomLoader from '../../../components/CustomLoader';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user)

  // Modal State
  const [open, setOpen] = useState(false);
  const [selectedComplain, setSelectedComplain] = useState(null);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");

  // Search State
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Table State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Tabs State
  const [tabValue, setTabValue] = useState(0);

  // Delete Confirmation State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'single' or 'multi'
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  const handleRefresh = () => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  };

  if (error) {
    console.log(error);
  }

  // DEBUG LOG
  console.log("Complains List:", complainsList);

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0); // Reset pagination on tab switch
    setSelectedIds([]); // Clear selection on tab switch
    setIsEdit(false); // Reset edit mode
    setSearch(""); // Reset search on tab switch
  };

  // Helper to open modal
  const handleOpen = (complain) => {
    setSelectedComplain(complain);
    setStatus(complain.status || "Pending");
    setReply(complain.relatedAdminResponse || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedComplain(null);
    setStatus("");
    setReply("");
  };



  const handleMultiDeleteClick = () => {
    setDeleteType('multi');
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setDeleteTargetId(null);
    setDeleteType(null);
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'single') {
      dispatch(deleteComplain(deleteTargetId, "Complain"));
    } else if (deleteType === 'multi') {
      // We need to delete multiple items. Since deleteComplain is singular, we iterate.
      // In a real app, backend should support bulk delete.
      // For now, we will dispatch delete for each ID.
      selectedIds.forEach(id => {
        dispatch(deleteComplain(id, "Complain"));
      });
      setSelectedIds([]);
      setIsEdit(false);
    }

    // Refresh list
    // Refresh list handled by Redux optimistic update
    // setTimeout(() => {
    //   dispatch(getAllComplains(currentUser._id, "Complain"));
    // }, 500);

    handleCloseConfirm();
  };

  // Filter complaints based on tab
  const studentComplains = complainsList?.filter(complain => complain.model_type === 'student') || [];
  const teacherComplains = complainsList?.filter(complain => complain.model_type === 'teacher') || [];

  // Sort complaints by date (Latest first); if dates equal, use ID (creation time)
  const sortComplains = (a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return String(b._id).localeCompare(String(a._id));
  };

  if (studentComplains.length > 0) {
    studentComplains.sort(sortComplains);
  }
  if (teacherComplains.length > 0) {
    teacherComplains.sort(sortComplains);
  }

  const currentComplains = tabValue === 0 ? studentComplains : teacherComplains;

  const complainRows = currentComplains.map((complain) => {
    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      user: complain.user?.name || "Unknown User",
      rollNum: complain.user?.rollNum || "",
      sclassName: complain.user?.sclassName?.sclassName || "",
      complaint: complain.complaint,
      date: dateString,
      status: complain.status || "Pending",
      id: complain._id,
      original: complain, // Keep original data for modal
    };
  });

  // Filter rows based on search
  // Filter rows based on search and status
  const filteredRows = complainRows.filter((row) => {
    const matchesSearch = row.user.toLowerCase().includes(search.toLowerCase()) ||
      row.complaint.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || row.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Selection Logic
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n) => n.id);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1),
      );
    }
    setSelectedIds(newSelected);
  };

  const isSelected = (id) => selectedIds.indexOf(id) !== -1;

  // Submit Handler
  const handleUpdate = () => {
    const fields = { status, relatedAdminResponse: reply };
    dispatch(updateComplain(selectedComplain._id, fields, "Complain"));
    handleClose();
    // Optional: Refresh list after delay or handle in useEffect
    setTimeout(() => {
      dispatch(getAllComplains(currentUser._id, "Complain"));
    }, 500);
  };

  return (
    <>
      <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Complains
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Search Complaints..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: 'var(--bg-paper)',
                }
              }}
              sx={{ width: '260px' }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Filter By Status' }}
                sx={{ borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--bg-paper)' }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Mode">
              <IconButton onClick={() => setIsEdit(!isEdit)} color={isEdit ? "primary" : "default"}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Selected">
              <span>
                <IconButton
                  onClick={handleMultiDeleteClick}
                  disabled={selectedIds.length === 0}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="complaint tabs">
            <Tab label="Student Complaints" />
            <Tab label="Teacher Complaints" />
          </Tabs>
        </Box>

        {loading ?
          <CustomLoader />
          :
          <>
            {filteredRows.length === 0 && search === "" && currentComplains.length === 0 ?
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Paper sx={{ width: '100%', overflow: 'hidden', padding: '40px 16px', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'none', backgroundColor: 'var(--bg-paper)', textAlign: 'center' }}>
                  <Typography variant="h5" color="text.primary" gutterBottom>No Complains</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {tabValue === 0 ? "No complaints from students found." : "No complaints from teachers found."}
                  </Typography>
                </Paper>
              </Box>
              :
              <Box sx={{
                borderRadius: 'var(--border-radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-paper)',
              }}>
                <TableContainer sx={{ maxHeight: '75vh', overflowX: 'auto' }}>
                  <Table stickyHeader aria-label="complaint table">
                    <TableHead>
                      <TableRow>
                        {isEdit && (
                          <StyledTableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              indeterminate={selectedIds.length > 0 && selectedIds.length < filteredRows.length}
                              checked={filteredRows.length > 0 && selectedIds.length === filteredRows.length}
                              onChange={handleSelectAll}
                            />
                          </StyledTableCell>
                        )}
                        <StyledTableCell>User</StyledTableCell>
                        {tabValue === 0 && (
                          <>
                            <StyledTableCell>Roll Number</StyledTableCell>
                            <StyledTableCell>Class</StyledTableCell>
                          </>
                        )}
                        <StyledTableCell>Complaint</StyledTableCell>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell align="center">Actions</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRows.length > 0 ? (
                        filteredRows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            const isItemSelected = isSelected(row.id);
                            return (
                              <StyledTableRow
                                hover
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.id}
                                selected={isItemSelected}
                              >
                                {isEdit && (
                                  <StyledTableCell padding="checkbox">
                                    <Checkbox
                                      color="primary"
                                      checked={isItemSelected}
                                      onChange={(event) => handleSelectOne(event, row.id)}
                                    />
                                  </StyledTableCell>
                                )}
                                <StyledTableCell>{row.user}</StyledTableCell>
                                {tabValue === 0 && (
                                  <>
                                    <StyledTableCell>{row.rollNum}</StyledTableCell>
                                    <StyledTableCell>{row.sclassName}</StyledTableCell>
                                  </>
                                )}
                                <StyledTableCell>{row.complaint}</StyledTableCell>
                                <StyledTableCell>{row.date}</StyledTableCell>
                                <StyledTableCell>
                                  <Box sx={{
                                    display: 'inline-block',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: row.status === 'Done' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                    color: row.status === 'Done' ? 'green' : 'orange',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem'
                                  }}>
                                    {row.status}
                                  </Box>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                    <Button variant="contained" color="primary" size="small" onClick={() => handleOpen(row.original)}>
                                      Resolve/View
                                    </Button>
                                    {/* Also trigger delete from here if there's a delete button, although the task might assume main delete button */}
                                  </Box>
                                </StyledTableCell>
                              </StyledTableRow>
                            );
                          })
                      ) : (
                        <TableRow>
                          <StyledTableCell colSpan={isEdit ? 6 : 5} align="center">
                            <Typography variant="h6" color="textSecondary">
                              No results found matching "{search}"
                            </Typography>
                          </StyledTableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={filteredRows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: '1px solid var(--border-color)',
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      fontFamily: 'var(--font-family-sans)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      display: { xs: 'none', sm: 'block' }
                    },
                  }}
                />
              </Box>
            }
          </>
        }
      </Container>

      {/* Update Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Update Complaint
          </Typography>
          <Typography variant="body2" mb={2}>
            <strong>Complaint:</strong> {selectedComplain?.complaint}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Admin Response"
            multiline
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>Update</Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deleteType === 'multi'
              ? `Are you sure you want to delete ${selectedIds.length} complaints? This action cannot be undone.`
              : "Are you sure you want to delete this complaint? This action cannot be undone."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SeeComplains;