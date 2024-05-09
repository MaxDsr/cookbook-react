import {Avatar, Popover, List, ListItemButton, ListItemText} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import {useState} from "react";


function ProfileMenu() {
  const {logout, user} = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);

  const onLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      }
    });
  };

  const onClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'user-avatar-popover' : undefined;


  return (
    <>
      <Avatar
        alt="Avatar"
        src={user?.picture}
        aria-describedby={id}
        sx={{cursor: "pointer"}}
        onClick={onClick}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          <ListItemButton onClick={onLogout}>
            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </List>
      </Popover>
    </>
  )
}


export default ProfileMenu;
