import { useEffect, useState } from 'react';
import { Tooltip, Box, TextField, InputAdornment, Typography, Container, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { GreenButton, ActionIconButtonPrimary, ActionIconButtonError, ActionIconButtonSuccess, ActionIconButtonInfo } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SchoolIcon from '@mui/icons-material/School';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Popup from '../../../components/Popup';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import CustomLoader from '../../../components/CustomLoader';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import axios from 'axios';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const ShowClasses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  const { currentUser } = useSelector(state => state.user)

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const deleteHandler = (deleteID, address) => {
    setClassToDelete({ id: deleteID, address });
    setDeleteDialogOpen(true);
  }

  const confirmDelete = () => {
    if (!classToDelete) return;
    setActionLoading(true);
    dispatch(deleteUser(classToDelete.id, classToDelete.address))
      .then(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
        setActionLoading(false);
        setDeleteDialogOpen(false);
        setClassToDelete(null);
      })
      .catch(() => {
        setActionLoading(false);
        setDeleteDialogOpen(false);
      });
  }

  const handleAssignTeacher = async () => {
    setActionLoading(true);
    try {
      if (selectedTeacherId === "remove") {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/RemoveSclassTeacher/${selectedClassId}`);
        setMessage("Class teacher removed successfully");
      } else {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/SclassTeacher/${selectedClassId}`, { teacherId: selectedTeacherId });
        setMessage("Class teacher updated successfully");
      }
      setSeverity("success");
      setShowPopup(true);
      dispatch(getAllSclasses(adminID, "Sclass"));
      setAssignDialogOpen(false);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Error updating class teacher";
      setMessage(errorMsg);
      setSeverity("error");
      setShowPopup(true);
    } finally {
      setActionLoading(false);
    }
  }

  const openAssignModal = (sclassId, currentTeacherId) => {
    setSelectedClassId(sclassId);
    setSelectedTeacherId(currentTeacherId || "");
    setAssignDialogOpen(true);
  }

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
    { id: 'teacher', label: 'Class Teacher', minWidth: 170 },
  ]

  const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
    return {
      name: sclass.sclassName,
      teacher: sclass.classTeacher ? sclass.classTeacher.name : "Not Assigned",
      teacherId: sclass.classTeacher ? sclass.classTeacher._id : null,
      id: sclass._id,
    };
  })

  const filteredRows = sclassRows && sclassRows.filter((row) => {
    return row.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const SclassButtonHaver = ({ row }) => {
    return (
      <>
        <Tooltip title="View" arrow>
          <ActionIconButtonPrimary
            onClick={() => navigate("/Admin/classes/class/" + row.id)}>
            <VisibilityOutlinedIcon />
          </ActionIconButtonPrimary>
        </Tooltip>
        <Tooltip title="Edit" arrow>
          <ActionIconButtonSuccess
            onClick={() => navigate(`/Admin/classes/class/edit/${row.id}`)}>
            <EditIcon />
          </ActionIconButtonSuccess>
        </Tooltip>
        <Tooltip title="Add Subjects" arrow>
          <ActionIconButtonSuccess
            onClick={() => navigate("/Admin/addsubject/" + row.id)}>
            <PostAddIcon />
          </ActionIconButtonSuccess>
        </Tooltip>
        <Tooltip title="Add Student" arrow>
          <ActionIconButtonInfo
            onClick={() => navigate("/Admin/class/addstudents/" + row.id)}>
            <PersonAddAlt1Icon />
          </ActionIconButtonInfo>
        </Tooltip>
        <Tooltip title="Delete" arrow>
          <ActionIconButtonError
            onClick={() => deleteHandler(row.id, "Sclass")}>
            <DeleteOutlineIcon />
          </ActionIconButtonError>
        </Tooltip>
        <Tooltip title={row.teacherId ? "Change Class Teacher" : "Assign Class Teacher"} arrow>
          <ActionIconButtonInfo
            onClick={() => openAssignModal(row.id, row.teacherId)}>
            {row.teacherId ? <RefreshIcon /> : <SchoolIcon />}
          </ActionIconButtonInfo>
        </Tooltip>
      </>
    );
  };


  return (
    <Container maxWidth={false} sx={{ mt: 0, mb: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 1, gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
          Classes
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Search classes..."
            variant="outlined"
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <Tooltip title="Promote Students">
            <IconButton
              onClick={() => navigate("/Admin/classes/promote")}
              sx={{
                bgcolor: 'var(--color-secondary-500)', color: 'white',
                '&:hover': { bgcolor: 'var(--color-secondary-600)' },
                borderRadius: 'var(--border-radius-md)'
              }}
            >
              <TrendingUpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Class">
            <IconButton
              onClick={() => navigate("/Admin/addclass")}
              sx={{
                bgcolor: 'var(--color-primary-600)', color: 'white',
                '&:hover': { bgcolor: 'var(--color-primary-700)' },
                borderRadius: 'var(--border-radius-md)'
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {loading ?
        <CustomLoader />
        :
        <>
          {getresponse ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")}>
                Add Class
              </GreenButton>
            </Box>
            :
            <>
              {Array.isArray(filteredRows) && filteredRows.length > 0 &&
                <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={filteredRows} />
              }
            </>}
        </>
      }
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this class? This will also delete all associated students, subjects, and teachers. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={actionLoading}>
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>{selectedTeacherId ? "Change Class Teacher" : "Assign Class Teacher"}</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Select Teacher</InputLabel>
            <Select
              value={selectedTeacherId}
              label="Select Teacher"
              onChange={(e) => setSelectedTeacherId(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {teachersList && teachersList.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
              {selectedTeacherId && <MenuItem value="remove" sx={{ color: 'error.main' }}>Remove Class Teacher</MenuItem>}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
          <Button onClick={handleAssignTeacher} color="primary" variant="contained" disabled={actionLoading}>
            {actionLoading ? "Processing..." : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} severity={severity} />
    </Container>
  );
};

export default ShowClasses;