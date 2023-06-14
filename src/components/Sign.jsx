import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Footer from "./Footer";

function Sign (){

   

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [response, setResponse] = useState("");
    
    const handlerSubmit = (event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('age', age);
        formData.append('pass', password);


        fetch('https://celluskachatapp.000webhostapp.com/sign.php',{
            method: 'POST',
            body: formData
        })
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data.message);
            setResponse(data.message);
        })
        .catch((error)=>{
            console.error('error', error);
        })
    }


    return(
        <Wrapper>   
        <Form onSubmit={handlerSubmit}> 
        <h2>Sign up </h2>
        {response===1?<p>You signed up successfully <Link to="/chat/login">Click here to login</Link></p>:response===0?<p>Email address or username is already registered</p>:""}
            <label>
                <p>Name:</p>
                <input type="text" value={name} onChange={(e)=> setName(e.target.value)} placeholder="Enter your username" required/>
            </label>
            <br/>
            <label>
                <p>Email:</p>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" required/>
            </label>
            <br/>
            <label>
                <p>Age:</p>
                <input type="number" value={age} onChange={(e)=>setAge(e.target.value)} placeholder="Enter your age" required/>
            </label>
            <br/>
            <label>
                <p>Password:</p>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password" required/>
            </label>
            <br/>
            <button type="submit">Submit</button>
        </Form>
        <Footer/>
        </Wrapper>
    )
}
export default Sign;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #2c3968;
    width: 100%;
    min-height: 100vh;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #e3e3e3;
    width: 40%;
    min-height: 50vh;
    box-shadow: 20px 20px 20px 20px rgb(0 0 0 / 0.3);
    border-radius: 10px;
    label{
        display: flex;
        flex-direction: column;
        text-align: left;
        padding: 15px;
        width: 60%;
    }
    label input{
        padding: 10px;
        border: none;
        background: #fff;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        border-radius: 10px;
    }
    label input:focus{
        outline: none !important;
        border: 2px solid #2c3968;
    }
    button{
        padding: 10px;
        border: none;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 10px;
        background: #2c3968;
        color: #fff;
        cursor: pointer;
        margin-bottom: 10px;
    }
    button:hover{
        transition: all 0.3s ease-in-out;
        background: #2c3968;
    }
    @media only screen and (max-width: 912px) {
        margin-top: 10px;
        margin-bottom: 20px;
        width: 90%;
        min-height: 90vh;
    }
`