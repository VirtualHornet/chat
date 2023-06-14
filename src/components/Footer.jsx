import{Link} from 'react-router-dom';
import styled from 'styled-components';

function Footer(){
        return(
            <Foo>©2023 Created by <Link to="https://github.com/VirtualHornet?tab=repositories">Attila Celluska </Link> </Foo>
        )
}



const Foo = styled.div`
    display: flex;
    bottom: 5px;
    color: #fff;
    margin-top: 10px;
    a{
        text-decoration: none;
        color: #fff;
        padding-left: 5px;
    }
    @media only screen and (max-width: 912px) {
        font-size: 11px;
    }

`
export default Footer;