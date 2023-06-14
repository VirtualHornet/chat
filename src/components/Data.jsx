import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from './logo.png';
import styled from "styled-components";
import {RiSendPlane2Line} from 'react-icons/ri';
import useSound from 'use-sound';
import mySound from './newMessage.mp3';

function Data ({onLogout}){

    const [active, setActive] = useState(true);
    const [users, setUsers] = useState([]);
    const [chatPartner, setChatPartner] = useState("");
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [notification, setNotification]= useState("");
    const [actialChatPartner, setActiualChatPartner] = useState(0);
   // const [position, setPosition] = useState('absolute');
    const divRef = useRef(null);
    const [playSound] = useSound(mySound);
    const [mobileNavChat, setMobileNavChat] = useState(false);

    const param = useParams();
    const navigate = useNavigate();

   /* useEffect(() => {
        const handleScroll = () => {
          const divElement = divRef.current;
          if (divElement) {
            const { top, height } = divElement.getBoundingClientRect();
            const windowHeight = window.innerHeight;
    
            if (top + height / 2 >= windowHeight / 2) {
              setPosition('sticky');
            } else {
              setPosition('absolute');
            }
          }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);*/

    useEffect(() => {
        // Define your function here
        const yourFunction = () => {
            startChat(chatPartner);
          // Perform any actions you want here
        };
    
        // Call your function immediately when the component mounts
        yourFunction();
    
        // Set up the interval to call your function every 10 seconds
        const interval = setInterval(yourFunction, 10000);
    
        // Clean up the interval when the component unmounts
        return () => {
          clearInterval(interval);
        };
      }, [chatPartner]);


      const scrollToBottom = () => {
        if (divRef.current) {
          divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      };
    

      useEffect(()=>{
        const handleTabClose = event =>{
        event.preventDefault();

        console.log('beforeunload event triggered');
        logOut();
        onLogout();
        return (event.returnValue =
          'Are you sure you want to exit?');
      };
    
      window.addEventListener('beforeunload', handleTabClose);
    
      return () => {
        window.removeEventListener('beforeunload', handleTabClose);
      };
    },[])  

    useEffect(()=>{ 
        scrollToBottom();
        getUsers();
        if(active === 1){
            onLogout();
            navigate("/chat/login");
        }
    },[active,response])

  

    const logOut = async ()=>{
        const formData = new FormData();
        formData.append('id',param.id);
        const api = await fetch('https://celluskachatapp.000webhostapp.com/logout.php',{
            method: 'POST',
            body: formData
        });
        const data = await api.json();
        console.log(data);
        setActive(data);
    }

    const getUsers = async ()=>{
        const api = await fetch('https://celluskachatapp.000webhostapp.com');
        const data = await api.json();
        console.log(data);
        setUsers(data);
        Object.values(data).map(item=>{
            if(Number(item.id)===Number(param.id)){
                console.log("message:"+item.message);
                setNotification(item.message);
            }
        })
    }

    const startChat = async (ID2)=>{
        const formData = new FormData();
        formData.append('id1',param.id);
        formData.append('id2',ID2);
        console.log(ID2);
        const api = await fetch('https://celluskachatapp.000webhostapp.com/handlerTable.php',{
            method: 'POST',
            body: formData
        });
        const data = await api.json();
        console.log(data);
        setActive(data);
        setActiualChatPartner(ID2);
    }

    const addNotification = (id)=>{
        if(notification==='0'){
            return "";
        }else if(Number(notification) === id){   
            playSound()
            return(
                <p>NEW MESSAGE</p> 
            )
        }else{
            var numbers = notification.split('d');
            if (numbers.includes(id.toString())){
                playSound();
                 return(
                    <p>NEW MESSAGE</p>
                )
            }
        }
    }

    const delNotififation = async(ID)=>{   
        
        const formData = new FormData();
        formData.append('id',param.id);
        if(notification.length === 1){
            formData.append('message',"0");
        }else{
            let numbers = notification.split('d');
            let arr = [];
            let stringa= ID.toString();
            for(let i = 0; i!=numbers.length;i++){
                if(numbers[i] !== stringa){
                    arr.push(numbers[i]);
                }
            }
            let res = arr.join('d');
            formData.append('message',res);
        }
     
        const api = await fetch('https://celluskachatapp.000webhostapp.com/notificationDel.php',{
            method: 'POST',
            body: formData
        });
        const data = await api.json();
        console.log(data);
    }

    const setInputPosition = ()=>{
        let input = document.getElementById('input');
        let pos = input.position();
    }
   

    const sendMessage= async (event)=>{
        event.preventDefault();
        let input = document.getElementById('input');
        input.value = '';
        const formData = new FormData();
        formData.append('from', param.id);
        formData.append('to',chatPartner);
        formData.append('message', message);
        const api = await fetch('https://celluskachatapp.000webhostapp.com/sendMessage.php',{
            method: 'POST',
            body: formData
        });
        const data = await api.json();
        console.log(data);
        setResponse(data);
        startChat(data); 
        //sendNotification(chatPartner);
    }

    return(
        <Wrapper>     
           
            <Active >
            <LogOut onClick={logOut}>LOG OUT</LogOut>    
                <Logos><img src={Logo} alt="logo"/><h1>Chat App</h1></Logos>
                { 
                Object.values(users).map(item=>{
                    if(Number(item.id) === Number(param.id)){
                        return(
                        <Welcome>
                             Welcome {item.user}
                       </Welcome> )
                    }
        })}
                <Partners>
                        <p>Your chat partners</p>
                        <ul>
                        {Object.values(users).map(item=>{
                            if(item.id=== chatPartner){
                                return(
                                    <li key={item.id}>
                                    {(Number(item.active)===1)?<ActualGreen onClick={()=>{setChatPartner(item.id);startChat(item.id);setActiualChatPartner(item.id);delNotififation(item.id);}}><h2>{item.user}</h2>{addNotification(item.id)}</ActualGreen>:<ActualGrey onClick={()=>{setChatPartner(item.id);startChat(item.id);setActiualChatPartner(item.id);delNotififation(item.id);}}><h2>{item.user}</h2>{addNotification(item.id)}</ActualGrey>}
                                </li>
                                )
                            }else{
                                 return(
                                <li key={item.id}>
                                    {(Number(item.active)===1)?<Green onClick={()=>{setChatPartner(item.id);startChat(item.id);setActiualChatPartner(item.id)}}><h2>{item.user}</h2>{addNotification(item.id)}</Green>:<Grey onClick={()=>{setChatPartner(item.id);startChat(item.id);setActiualChatPartner(item.id)}}><h2>{item.user}</h2>{addNotification(item.id)}</Grey>}
                                </li>
                            )
                            }
                           
                        })}
                        </ul>
                </Partners>
            </Active> 
           
            <Chat>
            {!mobileNavChat?"":<MobileChatPartners>
                    <Partners>
                        <p>Your chat partners</p>
                        <ul>
                        {Object.values(users).map(item=>{
                            if(item.id=== chatPartner){
                                return(
                                    <li key={item.id}>
                                    {((Number(item.active)===1))?<ActualGreen onClick={()=>{setChatPartner(item.id);startChat(item.id);setActiualChatPartner(item.id);delNotififation(item.id);setMobileNavChat(!mobileNavChat)}}><h2>{item.user}</h2>{addNotification(item.id)}</ActualGreen>:<ActualGrey onClick={()=>{setChatPartner(item.id);startChat(item.id);setActiualChatPartner(item.id);delNotififation(item.id);setMobileNavChat(!mobileNavChat)}}><h2>{item.user}</h2>{addNotification(item.id)}</ActualGrey>}
                                </li>
                                )
                            }else{
                                 return(
                                <li key={item.id}>
                                    {((Number(item.active)===1))?<Green onClick={()=>{setChatPartner(item.id);startChat(item.id);setActiualChatPartner(item.id);setMobileNavChat(!mobileNavChat)}}><h2>{item.user}</h2>{addNotification(item.id)}</Green>:<Grey onClick={()=>{setChatPartner(item.id);startChat(item.id);setActiualChatPartner(item.id);setMobileNavChat(!mobileNavChat)}}><h2>{item.user}</h2>{addNotification(item.id)}</Grey>}
                                </li>
                            )
                            }
                           
                        })}
                        </ul>
                    </Partners>
            </MobileChatPartners>}
            {mobileNavChat?"":<Messages>  
                
                
                { Object.values(users).map(item=>{
                    if(item.id === chatPartner){
                        return(
                    
                        <Flex> 
                            <MobileNav onClick={()=>{setMobileNavChat(!mobileNavChat);console.log(mobileNavChat);}}><p>Chat</p></MobileNav>
                            <ChatTitle>    
                                {item.user}
                            </ChatTitle> 
                            <MobileLogOut onClick={logOut}>X</MobileLogOut>  
                            
                        </Flex>
                      
                        )
                       }
             })}  
               
            
                {(active===0|| chatPartner==="")?<Hello>Let's start chatting  <MobileNav onClick={()=>{setMobileNavChat(!mobileNavChat);console.log(mobileNavChat);}}><p>Chat</p></MobileNav></Hello>:Object.values(active).map(item=>{
                    return(
                    (Number(item.user1)===Number(param.id))? 
                    <Right key={item.id}>
                        <p>{item.message}</p>
                        <i>{item.time}</i>
                    </Right>
                :   
                    <Left key={item.id}>
                        <p>{item.message}</p>
                        <i>{item.time}</i>
                    </Left>
               
              )})}
              </Messages>}
              {(active===0|| chatPartner==="")?"":<Form onSubmit={sendMessage} ref={divRef}>
                <input id="input" type="text" name="message" onChange={(e)=>setMessage(e.target.value)} placeholder="message" />
                <button type="submit"><RiSendPlane2Line/></button>
              </Form>}
            </Chat>      
              
        </Wrapper>
    )
}

export default Data;

const Wrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: row;
`
const Active = styled.div`
    width: 30%;
    height: 100vh;
    overflow: hidden;
    position: fixed;
    min-height: 100vh;
    background: #2c3968;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 700px) {
        display: none;
    }
` 
const MobileNav = styled.div`
    display:none;
    @media screen and (max-width: 700px) {
        display: flex;
        position: sticky;
        top: 10%;
        margin-left: 1%;
        margin-right: 1%;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        p{   
        border-radius: 10px;
        width: 100%;
        background: #2c3968;
        color:#fff;
        font-weight: 500;
        text-align: center;
        padding:10px ;
        }
    }
`
const MobileChatPartners = styled.div`
    z-index: 10;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    background: #2c3968;
    overflow-y: hidden;
`
const Chat = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    margin-left: 31%;
    margin-right: 1%;
    width: 70%;
    min-height: 100vh;
    background:#fff;
    @media screen and (max-width: 700px) {
        margin-left: 0;
        width: 100%;
    }
`
const Partners = styled.div`
    background-color: #c9c9c9;
    width: 90%;
    min-height: 30vh;
    border-radius: 10px;
    margin-top: 5%;
    margin-bottom: 5%;
    p{
        text-align: center;
        font-weight: 700;
    }
`
const Green = styled.div`
    cursor: pointer;
    display: flex;
    margin-top: 10px;
    background-color: #bcb7b7;
    width: 90%;
    border-radius: 10px;
    align-items: center;
    h2{
        margin:5px 0 ;
    }
    &::before{
        content: '';
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: green;
        margin: 5px;
    }
    &:hover{
        transition:all 0.3s ease-in;
        outline: none !important;
        border: 1px solid #2c3968;
    }
    p{
        margin-left: 15px;
        font-weight: 700;
    }
`
const Messages = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: 40vh;
    background:#fff;
    margin-bottom: 40px;
`
const Hello = styled.h1`
    text-align: center;
`
const ActualGreen= styled.div`
    cursor: pointer;
    display: flex;
    margin-top: 10px;
    background-color: #2c3968;
    color: #fff;
    width: 90%;
    border-radius: 10px;
    align-items: center;
    h2{
        margin:5px 0 ;
    }
    &::before{
        content: '';
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: green;
        margin: 5px;
    }
    &:hover{
        transition:all 0.3s ease-in;
        outline: none !important;
        border: 1px solid #2c3968;
    }
    p{
        margin-left: 15px;
        font-weight: 700;
    }
`
const Grey = styled.div`
    cursor: pointer;
    display: flex;
    margin-top: 10px;
    background-color: #bcb7b7;
    width: 90%;
    border-radius: 10px;
    align-items: center;
    h2{
        margin:5px 0 ;
    }
    &::before{
        content: '';
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: grey;
        margin: 5px;
    }
    &:hover{
        transition:all 0.3s ease-in;
        outline: none !important;
        border: 1px solid #2c3968;
    }
    p{
        margin-left: 15px;
        font-weight: 700;
    }
`
const ActualGrey= styled.div`
    cursor: pointer;
    display: flex;
    margin-top: 10px;
    background-color: #2c3968;
    color: #fff;
    width: 90%;
    border-radius: 10px;
    align-items: center;
    h2{
        margin:5px 0 ;
    }
    &::before{
        content: '';
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: grey;
        margin: 5px;
    }
    &:hover{
        transition:all 0.3s ease-in;
        outline: none !important;
        border: 1px solid #2c3968;
    }
    p{
        margin-left: 10%;
        font-weight: 800;
    }
`
const Right = styled.p`
    margin: 0;
    margin-bottom: 10px;
    cursor: pointer;
    i{
        display: none;
    }
    p{
        display: inline-block;
        float: right;
        border-radius: 10px ;
        flex-wrap: nowrap;
        text-align: right;
        background: #0084FF;
        color: white;
        padding: 10px;
        margin: 10px; 
        max-width: 50%;
    }
    &:hover{
        i{  
            display: inline;
            margin-top: 20px;
            float: right;
            color: #3a3a3a;
        }
    }
`
const Left = styled.p`
    float: left;
    margin: 0;
    margin-bottom: 10px;
    i{
        display: none;
    }
    p{
        display: inline-block;
        text-align: left;
        background: #E4E6EB;
        border-radius: 10px ;
        color: #000;
        margin: 10px;
        padding: 10px;
        max-width: 50%;
    }
    &:hover{
        i{  
            display: inline;
            margin-top: 20px;
            color: #3a3a3a;
        }
    }
`

const Form = styled.form`
    display: flex;
    justify-content: flex-end;
    justify-content: center;
    width: 100%;
    position:absolute;
    bottom: 10px;
    margin-top: 5px;
    input{
        padding: 10px;
        border: none;
        background: #dadada;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        width: 100%;
    }
    input:focus{
        outline: none !important;
        border: 2px solid #2c3968;
    }
    button{
        background: #2c3968;
        border: none;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        color: #fff;
        cursor: pointer;
        font-size: 1.1rem;
        width: 50px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    button:hover{
        transition: all 0.3s ease-in;
        color: #2c3968;
        background-color: #fff;
    }
`
const Logos = styled.div`
    display: flex;
    justify-content:center;
    align-items: center;
    width: 80%;
    margin-bottom: 10%;
    color: #fff;
    img{
        width: 70px;
        height: 70px;
        margin-right: 10px;
    }
`

const Welcome = styled.h2`
    color: #fff;
`

const ChatTitle = styled.h2`
    position: sticky;
    top: 1%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    background: #2c3968;
    width: 30%;
    color: #fff;
    padding: 5px;
    border-radius: 10px;
`
const MobileLogOut = styled.button`
    display: none;
    @media screen and (max-width: 700px) {
        display: flex;
        justify-content: center;
        align-items: center;
        position: sticky;
        cursor: pointer;
        padding: 10px;
        border: none;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 10px;
        background:#000;
        color: #fff;
        top: 2%;
        left: 10%;
        z-index: 10;
        text-align: right;
        height: 50%;
        &:hover{
            transition: all 0.3s ease-in-out;
            background: #2c3968;
            color: #fff;
        }
    }
`
const Flex = styled.div`
    display: flex;
    justify-content: space-between;
    position: sticky;
    height: 90px;
    background: #fff;
    top:0px;
`

const LogOut = styled.button`
    position: absolute;
    cursor: pointer;
    padding: 10px;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 10px;
    background:#000;
    color: #fff;
    top: 5%;
    left: 10%;
    z-index: 10;
    text-align: right;
    width: 100px;
    &:hover{
        transition: all 0.3s ease-in-out;
        background: #fff;
        color: #000;

    }
    @media only screen and (max-width: 912px) {
        top: 7%;

    }
   
`