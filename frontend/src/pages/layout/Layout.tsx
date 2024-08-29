import { useContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Stack, PrimaryButton } from '@fluentui/react'
import { CosmosDBStatus } from '../../api'
import Leroy from '../../assets/Leroy.svg'
import { HistoryButton, ShareButton } from '../../components/common/Button'
import { AppStateContext } from '../../state/AppProvider'
import { ChatAdd24Regular  } from '@fluentui/react-icons'


import styles from './Layout.module.css'

const Layout = () => {
  const [shareLabel, setShareLabel] = useState<string | undefined>('Share')
  const [refreshLabel, setRefreshLabel] = useState<string | undefined>('Refresh')
  const [hideHistoryLabel, setHideHistoryLabel] = useState<string>('Hide chat history')
  const [showHistoryLabel, setShowHistoryLabel] = useState<string>('Show chat history')
  const [logo, setLogo] = useState('')
  const appStateContext = useContext(AppStateContext)
  const ui = appStateContext?.state.frontendSettings?.ui

  const handleHistoryClick = () => {
    appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
  }

  const handleInfoClick = () => {
    window.open('https://support.leroy.no/esc_leroy?id=sc_cat_item&sys_id=76e7b0238711f5101777cb76cebb3526', '_blank', 'noopener,noreferrer')
  }

  const handleRefreshClick = () => {
    window.location.reload()
  }

  useEffect(() => {
    if (!appStateContext?.state.isLoading) {
      setLogo(ui?.logo || Leroy)
    }
  }, [appStateContext?.state.isLoading])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setShareLabel(undefined)
        setRefreshLabel(undefined)
        setHideHistoryLabel('Hide history')
        setShowHistoryLabel('Show history')
      } else {
        setShareLabel('Gi tilbakemelding')
        setRefreshLabel('Ny samtale')
        setHideHistoryLabel('Hide chat history')
        setShowHistoryLabel('Show chat history')
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.layout}>
      <header className={styles.header} role={'banner'}>
        <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
          <Stack horizontal verticalAlign="center">
            <img src={logo} className={styles.headerIcon} aria-hidden="true" alt="" />
            <Link to="/" className={styles.headerTitleContainer}>
              <h1 className={styles.headerTitle}>{ui?.title}</h1>
            </Link>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 4 }} className={styles.shareButtonContainer}>
            {appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured && ui?.show_chat_history_button !== false && (
              <HistoryButton
                onClick={handleHistoryClick}
                text={appStateContext?.state?.isChatHistoryOpen ? hideHistoryLabel : showHistoryLabel}
              />
            )}
            <PrimaryButton
              text={refreshLabel}
              onClick={handleRefreshClick}
              iconProps={{ iconName: 'ChatAdd' }}
              onRenderIcon={() => <ChatAdd24Regular color="#FFFFFF" />}
              className={styles.customPrimaryButton}
            />
            <PrimaryButton
              text={shareLabel}
              onClick={handleInfoClick}
              iconProps={{ iconName: 'Feedback' }}
              className={styles.customPrimaryButton}
            />
          </Stack>
        </Stack>
      </header>
      <Outlet />
    </div>
  )
}

export default Layout