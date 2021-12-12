import * as React from 'react';
import './AddImage.scss';
import CreateIcon from '@mui/icons-material/Create';
import Typography from '@mui/material/Typography';

export class AddImage extends React.Component {

  constructor(props) {
    super(props);
    this.fileSelectInputRef = React.createRef();
    this.state = {newImage: null};
  }

  emitFileInputClick() {
    this.fileSelectInputRef?.current?.click();
  }


  setNewImage(ev) {
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
       this.setState({ newImage: reader.result });
       this.props.onImageLoaded(this.state.newImage);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    ev.stopPropagation();
  }

  render() {
    return(
      <div className="AddFile" style={{'backgroundImage': `url(${this.state.newImage || this.props.imageUrl})`}}>
        {!this.props.imageUrl && !this.state.newImage ? <Typography variant={'h5'} align={'center'}>No image selected</Typography> : ''}
        <div className="icon" onClick={this.emitFileInputClick.bind(this)}><CreateIcon htmlColor={'#FFF'}/></div>
        <input type="file" ref={this.fileSelectInputRef} onChange={this.setNewImage.bind(this)}/>
      </div>
    );
  }
}
