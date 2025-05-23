import React from "react";
import OrangeButton from "../buttons/orange-button";

const BookButton = () => {
    return (
        <div>
            <OrangeButton variant="route" href="/provider" className="w-full"> {/*href is a placeholder link, replace with booking link */}
                REQUEST TO BOOK
            </OrangeButton>
        </div>
    )
}

export default BookButton;