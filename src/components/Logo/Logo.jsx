import React from 'react'
import { LogoImage } from '../../assets'

function Logo({width = '100px'}) {
    return (
        <img className='w-[4rem] h-[3rem] rounded-lg bg-cover' style={{backgroundImage: `url(${LogoImage})`}} />
    )
}

export default Logo
