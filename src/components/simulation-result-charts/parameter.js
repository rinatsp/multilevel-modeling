import React from "react";


export class Parameter extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <input
                type="number"
                onChange={(event) => {
                    this.props.updateInputValue(event.target.value)
                }}/>
        );
    }
}
