import {Grid} from "@mui/material";
import ProfileMenu from "../ProfileMenu/index.jsx";
import {useAuth0} from "@auth0/auth0-react";
import Button from "@mui/material/Button";


function TopBar({createRecipeButton}) {
  const {isLoading, user, loginWithRedirect} = useAuth0();

  return (
    <Grid container justifyContent="space-between" alignItems="center" marginY={3} paddingX={"2.5rem"}>
      <Grid item></Grid>
      <Grid item>
        {!!user && createRecipeButton}
      </Grid>

      <Grid item>
        {
          !!user && !isLoading
            ? <ProfileMenu/>
            : !user && !isLoading
              ? <Button variant="contained" onClick={() => loginWithRedirect()}>Log in</Button>
              : null
        }
      </Grid>
    </Grid>
  )
}


export default TopBar;
