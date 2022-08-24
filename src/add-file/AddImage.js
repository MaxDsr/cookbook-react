import * as React from 'react';
import CreateIcon from '@mui/icons-material/Create';
import Typography from '@mui/material/Typography';
import { AddImageWrap } from "./AddImageStyles";
import { useRef, useState } from "react";

export function AddImage(props) {
  const [newImage, setNewImage] = useState(null);
  const fileSelectInputRef = useRef();

  const emitFileInputClick = () => fileSelectInputRef?.current?.click();
  const onImageSelectChange = (ev) => {
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result);
      props.onImageLoaded(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    ev.stopPropagation();
  }

  return(
      <AddImageWrap style={{'backgroundImage': `url(${newImage || props.imageUrl})`}}>
        {!props.imageUrl && !newImage ? <Typography variant={'h5'} align={'center'}>No image selected</Typography> : ''}
        <div className="icon" onClick={emitFileInputClick}><CreateIcon htmlColor={'#FFF'}/></div>
        <input type="file" ref={fileSelectInputRef} onChange={onImageSelectChange}/>
      </AddImageWrap>
  );
}
