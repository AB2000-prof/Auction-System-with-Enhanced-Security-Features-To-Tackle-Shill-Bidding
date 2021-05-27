import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { Button,TextField } from '@material-ui/core';
import firebase from '../../../config/firebase'

export default function MoneyModal(props){

    var modal = props.modal
    const toggle = () => props.setModal(!modal);
    const [amount, setAmount] = useState([])

    const onSubmit=()=>{
        firebase.database()
        .ref('users/Buyer')
        .child(props.user.key)
        .child('wallet')
        .set(firebase.database.ServerValue.increment(parseInt(amount)))
        props.setModal(false)
    }


    return(
        <Modal centered isOpen={modal} toggle={toggle}>
            <ModalBody>
            <TextField id="outlined-basic" fullWidth label="Amount" variant="outlined" type="number" onChange={(e)=>setAmount(e.target.value)}/><br/>
            <Button variant="contained" className="mt-3" color="primary" fullWidth onClick={onSubmit}>Transfer</Button>
            </ModalBody>
        </Modal>
    )
  

}