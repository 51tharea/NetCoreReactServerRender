import React, {Fragment} from 'react';
import style from "../styles/header.css";

const Main = () => {
    return (
        <Fragment>
            <div className={style.header}>
                Header
            </div>
            <div className="container">
                .Net Core 3.0 Server Render with Hot Module Loaded...
                <p> Razor Page </p>
            </div>

        </Fragment>

    )
};
export {Main};