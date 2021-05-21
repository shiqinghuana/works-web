import React from "react";
import {Image} from "antd";
import i from "../static/images/1621575534283490.png"
import BasicLayout from "../layout/BasicLayout";



export default class Welcome extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div style={{width:"100%",height:"95vh"}}>

                <Image
                    width={"100%"}
                    height={"30em"}
                    src={i}
                >
                </Image>
            </div>

        )
    }


}







