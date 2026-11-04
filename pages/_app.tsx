import React from 'react'
import { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { useLanguageDetection } from '../utils/useLanguageDetection'

import '../styles/gothic-a1.css'
import '../styles/global.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  // Auto-detect and set language based on browser preferences
  useLanguageDetection();

  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp)
