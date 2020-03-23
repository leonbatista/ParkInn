import React from "react";
import Konva from "konva";
import Modal from "react-modal";
import GenerateParkingLotForm from "./GenerateParkingLotForm";
import "./Renderer.css";
import { Stage, Layer, Star, Text, Line, Rect } from "react-konva";

export default class Renderer extends React.Component {
    state = {
        //state
        drawingState: "pan",

        //stage
        scale: 1,
        snappingRatio: 10,
        stage: {
            x: 0,
            y: 0
        },
        walls: [],
        parkingLines: [],
        parkingLabel: [],
        lotRect: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            visible: false
        },

        //UI
        showModal: false,

        //dev
        cursorLocation: {
            x: 0,
            y: 0
        },
        parkingCount: 123
    };

    //H3LP3R FUNCT1ONSS ----------------------------------------------------------------------------------------------------------------------------
    snapGrid(roundTo, num) {
        let rem = num % roundTo;
        if (rem < roundTo / 2) {
            return num - rem;
        } else {
            return num + (roundTo - rem);
        }
    }

    getRelativePointerPosition = s => {
        let pos = s.getPointerPosition();
        return {
            x: pos.x / this.state.scale - this.state.stage.x / this.state.scale,
            y: pos.y / this.state.scale - this.state.stage.y / this.state.scale
        };
    };

    //EVENT HANDLERS DOWN BELOOOOWW-----------------------------------------------------------------------------------------------------------------
    //stage handeling
    handleStageDrag = e => {
        if (this.state.drawingState === "pan") {
            this.setState({
                stage: {
                    x: e.target.attrs.x,
                    y: e.target.attrs.y
                }
            });
        }
    };

    //disable this for now sh1t is w0nky

    //used for zooming in and out of the map duh lmfao xd
    stageZoom = e => {
        //this is code copied from stack overflow dont ask me how it works lol
        e.evt.preventDefault();

        const scaleBy = 1.08;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale =
            e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        this.setState({
            scale: newScale,
            stage: {
                draggable: this.state.stage.draggable,
                x:
                    -(
                        mousePointTo.x -
                        stage.getPointerPosition().x / newScale
                    ) * newScale,
                y:
                    -(
                        mousePointTo.y -
                        stage.getPointerPosition().y / newScale
                    ) * newScale
            }
        });
    };

    //variables used for drawing
    isPaint = false;
    selectionBox = null;

    //this function is used for drawing rectangles, whatever we need
    startDrawing = e => {
        //create rectangle
        switch (this.state.drawingState) {
            case "drawWall": {
                //note we need these brackets here to create scope otherwise same scope for entire switch
                //enter here if we are finished painting object
                if (this.isPaint) {
                    this.isPaint = false;
                    let walls = this.state.walls;
                    let wall = walls[walls.length - 1];
                    if (wall.width === 0 || wall.height === 0) {
                        walls.pop();
                    }
                    this.setState({
                        walls: walls
                    });
                    return;
                }
                //else enter here to start drawing rectangle
                let stage = e.target.getStage();
                let walls = this.state.walls;
                let pos = this.getRelativePointerPosition(stage);
                this.setState({
                    cursorLocation: {
                        x: pos.x,
                        y: pos.y
                    }
                });
                walls.push({
                    x: this.snapGrid(this.state.snappingRatio, pos.x),
                    y: this.snapGrid(this.state.snappingRatio, pos.y),
                    width: 0,
                    height: 0
                });
                this.setState({
                    walls: walls
                });
                console.log(walls);
                this.isPaint = true;
                break;
            }
            case "drawParkingSpots": {
                if (this.isPaint) {
                    //set parking lot shit here
                    this.isPaint = false;
                    this.openParkingLotForm();
                    return;
                }
                let stage = e.target.getStage();
                let pos = this.getRelativePointerPosition(stage);

                this.setState({
                    lotRect: {
                        x: this.snapGrid(this.state.snappingRatio, pos.x),
                        y: this.snapGrid(this.state.snappingRatio, pos.y),
                        width: 0,
                        height: 0,
                        visible: true
                    }
                });

                this.setState({
                    cursorLocation: {
                        x: pos.x,
                        y: pos.y
                    }
                });
                this.isPaint = true;
                break;
            }
        }
    };
    //this function checks if we are currently drawing. if we are, then get out cursor position and use that to redefine the width of the box we are drawing
    sizeDrawing = e => {
        if (!this.isPaint) return;

        switch (this.state.drawingState) {
            case "drawWall": {
                let walls = this.state.walls;
                let wall = walls[walls.length - 1];
                let stage = e.target.getStage();

                let pos = this.getRelativePointerPosition(stage);

                wall.width = this.snapGrid(
                    this.state.snappingRatio,
                    pos.x - wall.x
                );
                wall.height = this.snapGrid(
                    this.state.snappingRatio,
                    pos.y - wall.y
                );

                this.setState({
                    walls: walls
                });
                break;
            }
            case "drawParkingSpots": {
                let stage = e.target.getStage();
                let pos = this.getRelativePointerPosition(stage);

                console.log(this.state.lotRect.x);
                console.log(this.state.lotRect.y);

                this.setState({
                    lotRect: {
                        x: this.state.lotRect.x,
                        y: this.state.lotRect.y,
                        width: this.snapGrid(
                            this.state.snappingRatio,
                            pos.x - this.state.lotRect.x
                        ),
                        height: this.snapGrid(
                            this.state.snappingRatio,
                            pos.y - this.state.lotRect.y
                        ),
                        visible: true
                    }
                });
                break;
            }
        }
    };

    objectClick = e => {
        switch (this.state.drawingState) {
            case "erase":
                console.log(e);
                break;
        }
    };

    openModalHandler = () => {
        this.setState({
            showModal: true
        });
    };

    closeModalHandler = () => {
        this.setState({
            showModal: false
        });
    };

    openParkingLotForm = coords => {
        this.openModalHandler();
    };

    //call back function for generate parking lot form
    callbackParkingLotForm = childData => {
        this.closeModalHandler();
        this.drawParkingSpots(childData);
    };

    drawParkingSpots = num => {
        let dimensions = {
            width: this.state.lotRect.width,
            height: this.state.lotRect.height
        };

        //TO-DO: boundary check or somethin lol
        let origx = this.state.lotRect.x;
        let origy = this.state.lotRect.y;

        //draw parking lines
        let parkingLines = [];
        for (let i = 0; i < num; i++) {
            parkingLines.push({
                x1: origx + (dimensions.width / num) * i,
                y1: origy,
                x2: origx + (dimensions.width / num) * i,
                y2: origy + dimensions.height
            });
        }
        //for end line
        parkingLines.push({
            x1: origx + dimensions.width,
            y1: origy,
            x2: origx + dimensions.width,
            y2: origy + dimensions.height
        });
        this.setState({
            parkingLines: this.state.parkingLines.concat(parkingLines)
        });

        //draw labels
        let labels = [];
        let inText = this.state.parkingCount; //change this
        for (let i = 0; i < num; i++) {
            labels.push({
                x: origx + (dimensions.width / num) * i,
                y: origy + dimensions.height,
                width: dimensions.width / num,
                height: dimensions.width / num / 2,
                text: ++inText
            });
        }
        this.setState({
            parkingLabel: this.state.parkingLabel.concat(labels),
            parkingCount: inText
        });

        //hide drawing box
        this.setState({
            lotRect: {
                x: this.state.lotRect.x,
                y: this.state.lotRect.y,
                width: 0,
                height: 0,
                visible: false
            }
        });
    };

    //---------------------------BUTTON TYPA TINGZ--------------------------------//
    resetOrigin = e => {
        this.setState({
            stage: {
                draggable: true,
                x: 0,
                y: 0
            },
            scale: 1
        });
    };
    toggleMoveStage = e => {
        this.changeDrawingState("pan");
    };
    toggleDrawingMode = e => {
        this.changeDrawingState("drawWall");
    };
    toggleDrawParkingSpots = e => {
        this.changeDrawingState("drawParkingSpots");
    };
    toggleErase = e => {
        this.changeDrawingState("erase");
    };

    //-----------------------------STATE CHANGE HANDLING----------------------------------------------//

    changeDrawingState = inState => {
        switch (inState) {
            case "pan":
                this.setState({
                    drawingState: inState
                });
                break;
            case "erase":
            case "drawParkingSpots":
            case "drawWall":
                this.isPaint = false;
                this.setState({
                    drawingState: inState
                });
                break;
            default:
                console.log(
                    "shit boi u not supposed to be in here lmfao didn't write state or something fucked up"
                );
                break;
        }
    };

    //-----------------------------REACT TYPE STYLING------------------------------------------------//
    buttonSelected = {
        background: "#b3e1ff"
    };

    modalStyle = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)"
        }
    };

    //-----------------------------RENDER---:-)-------------------------kill me-----------------------//
    render() {
        return (
            <div>
                <div className="devBox">
                    <p>dev console</p>
                    <p>
                        stage pos:
                        {this.state.stage.x}, {this.state.stage.y}
                    </p>
                    <p>
                        cursor pos:
                        {this.state.cursorLocation.x},
                        {this.state.cursorLocation.y}
                    </p>
                </div>

                <Modal style={this.modalStyle} isOpen={this.state.showModal}>
                    <GenerateParkingLotForm
                        parentCallback={this.callbackParkingLotForm}
                    />
                </Modal>

                <div className="controls">
                    <button onClick={this.resetOrigin}>reset</button>
                    <button
                        onClick={this.toggleMoveStage}
                        style={
                            this.state.drawingState === "pan"
                                ? this.buttonSelected
                                : null
                        }
                    >
                        move
                    </button>
                    <button
                        onClick={this.toggleDrawingMode}
                        style={
                            this.state.drawingState === "drawWall"
                                ? this.buttonSelected
                                : null
                        }
                    >
                        wall
                    </button>
                    <button
                        onClick={this.toggleDrawParkingSpots}
                        style={
                            this.state.drawingState === "drawParkingSpots"
                                ? this.buttonSelected
                                : null
                        }
                    >
                        parking
                    </button>
                    <button
                        onClick={this.toggleErase}
                        style={
                            this.state.drawingState === "erase"
                                ? this.buttonSelected
                                : null
                        }
                    >
                        erase
                    </button>
                </div>

                {/*--------------------------below is the shit for rendering-------------------------------------*/}

                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    draggable={this.state.drawingState === "pan"}
                    x={this.state.stage.x}
                    y={this.state.stage.y}
                    scaleX={this.state.scale}
                    scaleY={this.state.scale}
                    onMouseDown={this.startDrawing}
                    onMouseMove={this.sizeDrawing}
                    onDragEnd={this.handleStageDrag}
                    onWheel={this.stageZoom}
                >
                    <Layer id="grid">
                        {[...Array(200)].map((_, i) => (
                            <Line
                                points={[
                                    -5000,
                                    i * 50 - 5000,
                                    5000,
                                    i * 50 - 5000
                                ]}
                                strokeWidth={0.3}
                                closed
                                stroke={"black"}
                                opacity={0.5}
                                perfectDrawEnabled={false}
                                listening={false}
                            />
                        ))}
                        {[...Array(200)].map((_, i) => (
                            <Line
                                points={[
                                    i * 50 - 5000,
                                    -5000,
                                    i * 50 - 5000,
                                    5000
                                ]}
                                strokeWidth={0.3}
                                closed
                                stroke={"black"}
                                opacity={0.5}
                                perfectDrawEnabled={false}
                                listening={false}
                            />
                        ))}
                    </Layer>

                    <Layer id="parkingSpots">
                        {this.state.parkingLines.map((line, i) => {
                            return (
                                <Line
                                    points={[
                                        line.x1,
                                        line.y1,
                                        line.x2,
                                        line.y2
                                    ]}
                                    strokeWidth={5}
                                    stroke={"#3D4849"}
                                    perfectDrawEnabled={false}
                                    listening={false}
                                />
                            );
                        })}

                        {this.state.parkingLabel.map((lab, i) => {
                            return (
                                <Text
                                    x={lab.x}
                                    y={lab.y}
                                    width={lab.width}
                                    text={lab.text}
                                    align={"center"}
                                    fontStyle={"bold"}
                                    fontSize={20}
                                />
                            );
                        })}
                    </Layer>

                    <Layer id="walls">
                        {this.state.walls.map((wall, i) => {
                            return (
                                <Rect
                                    x={wall.x}
                                    y={wall.y}
                                    width={wall.width}
                                    height={wall.height}
                                    fill="black"
                                    onClick={this.objectClick}
                                />
                            );
                        })}
                        {this.selectionBox ? <Rect /> : null}
                    </Layer>

                    <Layer id="lotRect">
                        <Rect
                            x={this.state.lotRect.x}
                            y={this.state.lotRect.y}
                            width={this.state.lotRect.width}
                            height={this.state.lotRect.height}
                            stroke={"#fda766"}
                            strokeWidth={2}
                            visible={this.state.lotRect.visible}
                        />
                    </Layer>
                </Stage>
            </div>
        );
    }
}
