import React from 'react'

export const Contact = () => {
    return (
        <div className='flex flex-col items-center gap-8 mt-12 pb-24'>
            <div className='flex w-auto sm:w-1/2 mx-auto justify-around'>
                <a href='https://www.linkedin.com/in/jorgeignaciogaray/'><img src="https://github.com/Viozhu/Viozhu.github.io/blob/main/Iconos/linkedin.png?raw=true" alt="link" width="60" height="60" /></a>
                <a href='https://mail.google.com/a/?view=cm&fs=1&to=garayjorgeignacio@gmail.com'><img src="https://github.com/Viozhu/Viozhu.github.io/blob/main/Iconos/gmail.png?raw=true" alt="gmail" width="60" height="60" /></a>
                <a href='https://wa.me/821030409735?text=Hi!%20I%20saw%20your%20portafolio'><img src="https://github.com/Viozhu/Viozhu.github.io/blob/main/Iconos/whatsapp.png?raw=true" alt="whtsapp" width="60" height="60" /></a>
                <a href='https://github.com/Viozhu'><img className='icono' src="https://github.com/Viozhu/Viozhu.github.io/blob/main/Iconos/github%20(1).png?raw=true" alt="github" width="60" height="60" /></a>
            </div>
            <a
                href='/Jorge_Garay_CV.pdf'
                target='_blank'
                rel='noopener noreferrer'
                className='primary-button flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm min-w-[160px] justify-center'
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                View CV
            </a>
        </div>
    )
}
