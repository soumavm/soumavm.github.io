import React, { useState } from 'react';
import { StyledRow, StyledContainer, StyledButton, StyledColumn, StyledControlButton, ControlColumn } from "./styles"
import { Column, Row, Heading5} from "../../theme"
import { getDatabase, ref, set} from "firebase/database"

const controlButtons = ["red", "orange", "yellow", "Chartreuse", "aqua", "violet", "HotPink", "grey", "black", "white"]

let colCount = 27
let rowCount = 14
let clickedButtons = Array(colCount*rowCount).fill(null);

const DrawBoard = ({db}) =>{

    let rowArray = [];
    let buttonArray = [];
    
    const [currentColour, setCurrentColour] = useState("red");

    const handleButtonClick = (event) => {
        event.target.style.backgroundColor = currentColour;
        
        const RGBColour = window.getComputedStyle(document.getElementById(event.target.getAttribute("id"))).backgroundColor;
        //turns to array of [R,G,B]
        const RGBArray = RGBColour.match(/\d+/g).map(Number);
        RGBArray.unshift(Number(event.target.getAttribute("id")))
        clickedButtons[event.target.getAttribute("id")] = RGBArray

    };

    const handleInput = (event) => {
        setCurrentColour(event.target.value);
    };

    const sendToDB = () => {
        clickedButtons = clickedButtons.filter(element => element !== null)
        let chosenArray =[]
        clickedButtons.forEach(element => chosenArray.push(element[0]))

        const data ={
            num_clicked : clickedButtons.length,
            tiles: chosenArray
        }

        //adds js object to data for each tile ex "1": [255,255,255]
        clickedButtons.forEach(element => data[element[0]] = [element[1], element[2], element[3]] )

        set(ref(db, "tileData"), data)
        .then(() => {
            console.log("Data written successfully");
        })
        .catch((error) => {
            console.error("Error writing data:", error);
        });

    };

    for (let rownum = 0; rownum < rowCount; rownum++) {
        for(let colnum = 0; colnum < colCount; colnum++){
            rowArray.push(<StyledColumn count={colCount}>
                            <StyledButton onClick={handleButtonClick} key={colnum + rownum*colCount} id={colnum + rownum*colCount}></StyledButton>
                          </StyledColumn>
                         );
        }
        buttonArray.push(<Row>{rowArray}</Row>);
        buttonArray.push('\n');
        rowArray = [];
    }
    return(
        <>
        <StyledContainer>
            <StyledRow>
                {buttonArray}
            </StyledRow>
            <Heading5>Choose a colour:</Heading5>
            <Row>
                <Column count={controlButtons.length+1}>
                    <ControlColumn>
                        <input type="color" value={"white"} onChange={handleInput} />
                        Pick your own Colour
                    </ControlColumn>
                </Column>
                {controlButtons.map((buttonColour) => {
                    return(
                        <Column count={controlButtons.length+1}>
                            <ControlColumn>
                                <StyledControlButton startColour={buttonColour} onClick={() => setCurrentColour(buttonColour)}></StyledControlButton>
                            </ControlColumn>
                        </Column>
                    )
                })}
            </Row>

            <button onClick={sendToDB}>send to DB</button>
        </StyledContainer>
        
        
        </>

    )
}

export default DrawBoard