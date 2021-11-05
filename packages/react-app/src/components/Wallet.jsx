import React, { useState } from "react";
import { KeyOutlined, WalletOutlined, QrcodeOutlined, SendOutlined } from "@ant-design/icons";
import { Row, Col, Tooltip, Spin, Modal, Button, Typography, message } from "antd";
import QR from "qrcode.react";
import { parseEther } from "@ethersproject/units";
import { useUserAddress } from "eth-hooks";
import { Transactor } from "../helpers";
import Address from "./Address";
import Balance from "./Balance";
import AddressInput from "./AddressInput";
import EtherInput from "./EtherInput";
import { ethers } from "ethers";

import { Blockie } from "."

const { Text, Paragraph } = Typography;



/*
  ~ What it does? ~

  Displays a wallet where you can specify address and send USD/ETH, with options to
  scan address, to convert between USD and ETH, to see and generate private keys,
  to send, receive and extract the burner wallet

  ~ How can I use? ~

  <Wallet
    provider={userProvider}
    address={address}
    ensProvider={mainnetProvider}
    price={price}
    color='red'
  />

  ~ Features ~

  - Provide provider={userProvider} to display a wallet
  - Provide address={address} if you want to specify address, otherwise
                                                    your default address will be used
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide color to specify the color of wallet icon
*/

export default function Wallet(props) {
  const signerAddress = useUserAddress(props.provider);
  const selectedAddress = props.address || signerAddress;

  const [open, setOpen] = useState();
  const [qr, setQr] = useState();
  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();

  const [showPrivate, setShowPrivate] = useState();

  const providerSend = props.provider ? (
    <Tooltip title="Private Keys">
      <KeyOutlined style={{fontSize:32,color:props.invert?"#FFFFFF":""}} onClick={() => {
          setOpen(!open);
      }}/>
    </Tooltip>
  ) : (
    ""
  );

  let display;
  let receiveButton;
  let privateKeyButton
  /*if (qr) {
    display = (
      <div>
        <div>
          <Text copyable>{selectedAddress}</Text>
        </div>
        <QR
          value={selectedAddress}
          size="450"
          level="H"
          includeMargin
          renderAs="svg"
          imageSettings={{ excavate: false }}
        />
      </div>
    );
    receiveButton = ""
    privateKeyButton = (
     <Button key="hide" onClick={()=>{setPK(selectedAddress);setQr("")}}>
       <KeyOutlined /> Private Key
     </Button>
   )
 }else if(pk){
*/



   const punkSize = 45


   let pk = localStorage.getItem("metaPrivateKey")
   let wallet = new ethers.Wallet(pk)

   if(wallet.address!==selectedAddress){
     display = (
       <div>
         <b>*injected account*, private key unknown</b>
       </div>
     )
   }else{

     let extraPkDisplayAdded = {}
     let extraPkDisplay = []
     let mypart1 = wallet.address && wallet.address.substr(2,20)
     let mypart2= wallet.address && wallet.address.substr(22)
     const myx = parseInt(mypart1, 16)%100
     const myy = parseInt(mypart2, 16)%100
     extraPkDisplayAdded[wallet.address] = true
     extraPkDisplay.push(
       <div style={{fontSize:38,fontWeight:"bolder",padding:2,backgroundStyle:"#89e789"}}>
          <a href={"/pk#"+pk}>
            <Blockie address={wallet.address} scale={4}/> {wallet.address.substr(0,6)}
          </a>
       </div>
     )
     for (var key in localStorage){
       if(key.indexOf("metaPrivateKey_backup")>=0){
         //console.log(key)
         let pastpk = localStorage.getItem(key)
         let pastwallet = new ethers.Wallet(pastpk)
         if(!extraPkDisplayAdded[pastwallet.address] /*&& selectedAddress!=pastwallet.address*/){
           extraPkDisplayAdded[pastwallet.address] = true
           let part1 = pastwallet.address && pastwallet.address.substr(2,20)
           let part2= pastwallet.address && pastwallet.address.substr(22)
           const x = parseInt(part1, 16)%100
           const y = parseInt(part2, 16)%100
           extraPkDisplay.push(
             <div style={{fontSize:32}}>
                <a href={"/pk#"+pastpk}>
                  <Blockie address={pastwallet.address} scale={3.8}/> {pastwallet.address.substr(0,6)}
                </a>
             </div>
           )
         }
       }
     }

     let currentButton = (
      <span style={{marginRight:4}}><span style={{marginRight:8}}>⛔️</span> Reveal </span>
     )
     let privateKeyDisplay = ""
     if(showPrivate){
       currentButton = (
         <span style={{marginRight:4}}><span style={{marginRight:8}}>😅</span> Hide </span>
       )
       privateKeyDisplay = (
         <div>
         <b>Private Key:</b>
           ☢️ DO NOT SHARE THIS WITH ANYONE, EVER ☢️
         <div>
          <Text style={{fontSize:11}} copyable>{pk}</Text>
         </div>
         <div style={{cursor:"pointer"}} onClick={()=>{
              const el = document.createElement('textarea');
              el.value = window.origin+"/pk#"+pk;
              document.body.appendChild(el);
              el.select();
              document.execCommand('copy');
              document.body.removeChild(el);
              message.success(
                <span style={{position:"relative"}}>
                 Copied Private Key Link
                </span>
              );
         }}>
           <QR value={window.origin+"/pk#"+pk} size={"450"} level={"H"} includeMargin={true} renderAs={"svg"} imageSettings={{excavate:false}}/>
         </div>
         </div>
       )
     }



     display = (
       <div>
         {privateKeyDisplay}
         <div style={{marginBottom:32,paddingBottom:32,borderBottom:"1px solid #CCCCCC"}}>
            <Button style={{marginTop:16}} onClick={()=>{
              setShowPrivate(!showPrivate)
            }}> {currentButton} Private Key</Button>
         </div>
         {/*extraPkDisplay?(
           <div style={{paddingBottom:32,borderBottom:"1px solid #CCCCCC"}}>
             <h3>
              Known Private Keys:
             </h3>
             {extraPkDisplay}
             <Button style={{marginTop:16}} onClick={()=>{
               let currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
               if(currentPrivateKey){
                 window.localStorage.setItem("metaPrivateKey_backup"+Date.now(),currentPrivateKey);
               }
               const randomWallet = ethers.Wallet.createRandom()
               const privateKey = randomWallet._signingKey().privateKey
               window.localStorage.setItem("metaPrivateKey",privateKey);
               window.location.reload()
             }}>
             <span style={{marginRight:8}}>⚙️</span>Generate
             </Button>
           </div>
         ):""*/}

       </div>
     )
   }

  /*} else {
    const inputStyle = {
      padding: 10,
    };

    display = (
      <div>
        <div style={inputStyle}>
          <AddressInput
            autoFocus
            ensProvider={props.ensProvider}
            placeholder="to address"
            address={toAddress}
            onChange={setToAddress}
          />
        </div>
        <div style={inputStyle}>
          <EtherInput
            price={props.price}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
        </div>
      </div>
    );
    receiveButton = (
      <Button
        key="receive"
        onClick={() => {
          setQr(selectedAddress);
          setPK("");
        }}
      >
        <QrcodeOutlined /> Receive
      </Button>
    );
    privateKeyButton = (
      <Button key="hide" onClick={()=>{setPK(selectedAddress);setQr("")}}>
        <KeyOutlined /> Private Key
      </Button>
    );
  }*/

  return (
    <span style={{ verticalAlign: "middle", paddingLeft: 16,fontSize: 32 }}>
      {providerSend}
      <Modal
        visible={open}
        title={
          <div>
            {selectedAddress ? <Address address={selectedAddress} ensProvider={props.ensProvider} /> : <Spin />}
            <div style={{ float: "right", paddingRight: 25 }}>
              <Row >
                <Col style={{textAlign:"right"}}>
                  <Balance value={props.gtgsCoinBalance} size={18} /><span style={{verticalAlign:"middle"}}></span>
                </Col>
                <Col style={{opacity:0.5,textAlign:"left"}}>
                  (⛽️<Balance value={props.yourLocalBalance} size={14} />)
                </Col>
              </Row>
            </div>
          </div>
        }
        onOk={() => {
          setOpen(!open);
        }}
        onCancel={() => {
          setOpen(!open);
        }}
        footer={[
          privateKeyButton, receiveButton,
          <Button
            key="submit"
            type="primary"
            disabled={!amount || !toAddress || qr}
            loading={false}
            onClick={() => {
              setOpen(!open);
            }}
          >
           Hide
          </Button>,
        ]}
      >
        {display}
      </Modal>
    </span>
  );
}
