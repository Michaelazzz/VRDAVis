import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50false%)',
  width: 400,
  bgcolor: 'background.paper',
//   border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BasicButtonModal = ({buttonText, open, handleOpen, handleClose, children}: any) => {
  return (
    <div>
        <Button onClick={handleOpen}>{buttonText}</Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
			{/* @ts-ignore */}
            <Box sx={style}>
                {children}
            </Box>
        </Modal>
    </div>
  );
}

export default BasicButtonModal;