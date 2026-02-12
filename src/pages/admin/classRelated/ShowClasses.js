import { useEffect, useState } from 'react';
import { Tooltip, Box, TextField, InputAdornment, Typography, Container, Paper, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { GreenButton, ActionIconButtonPrimary, ActionIconButtonError, ActionIconButtonSuccess, ActionIconButtonInfo } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Popup from '../../../components/Popup';

const ShowClasses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user)

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.")
    // dispatch(deleteUser(deleteID, address))
    //   .then(() => {
    //     dispatch(getAllSclasses(adminID, "Sclass"));
    //   })
  }

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
  ]

  const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
    return {
      name: sclass.sclassName,
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
      </>
    );
  };


  return (
    <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
      {loading ?
        <div>Loading...</div>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/Admin/addclass")}
                    sx={{
                      textTransform: 'none', fontWeight: 600, fontFamily: 'var(--font-family-sans)',
                      borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--color-primary-600)',
                      boxShadow: 'none', px: 2.5, whiteSpace: 'nowrap',
                      '&:hover': { backgroundColor: 'var(--color-primary-700)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                    }}
                  >
                    Add Class
                  </Button>
                </Box>
              </Box>
              {Array.isArray(filteredRows) && filteredRows.length > 0 &&
                <TableTemplate buttonHaver={SclassButtonHaver} columns={sclassColumns} rows={filteredRows} />
              }
            </>}
        </>
      }
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

    </Container>
  );
};

export default ShowClasses;