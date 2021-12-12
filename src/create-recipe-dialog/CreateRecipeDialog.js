import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { AddImage } from '../add-file/AddImage';
import './CreateRecipeDialog.scss';
import Typography from '@mui/material/Typography';

export class CreateRecipeDialog extends React.Component {

  // imageUrl = 'https://lh3.googleusercontent.com/proxy/hqzahEujHdyMIkt13cJFyfTaVNyWvMVQIjZXawCvu0aR4EIbs7m0yqH4Aei066C_9VQj7pcybDZN8felUfy0IEDf58kOk3KAszKXtYwrmo7O-ffwpTkHyA7cOV7Xn42GxS75LCGgfDWsXI-0mnw';
  imageUrl = null;

  constructor(props) {
    super(props);
    this.state = { selectedImage: null };
  }

  handleClose = () => {
    console.log('onClose from dialog parent component');
    this.props.onClose();
  };

  onNewImageSelect = (newImage) => this.setState({selectedImage: newImage});

  render() {
    return (
      <Dialog className="CreateRecipeDialog" maxWidth={'lg'} onClose={this.handleClose} open={this.props.open}>
        <DialogTitle>Add new recipe</DialogTitle>
        <DialogContent>
          <div className="content-wrap">
            <Typography variant={'h6'}>Add Image</Typography>
            <AddImage imageUrl={this.imageUrl} onImageLoaded={this.onNewImageSelect}></AddImage>
          </div>
        </DialogContent>
        <DialogActions>
          <Button>Disagree</Button>
          <Button autoFocus>Agree</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
