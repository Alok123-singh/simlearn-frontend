import React from "react";

function Button1({
    children,
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`dark:bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    );
}

export default Button1;