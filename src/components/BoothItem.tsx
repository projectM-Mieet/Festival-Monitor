import React, { useState, useEffect } from 'react'

import { Box, SlideFade } from '@chakra-ui/react'

import BoothInfo from './BoothInfo'

import { Booth } from '@/types/booth'

const BoothItem = ({ booth, delay }: { booth: Booth; delay?: number }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // delayが設定されていればその時間だけ遅延させる
    const timeoutId = setTimeout(() => setShow(true), delay || 0)
    return () => clearTimeout(timeoutId)
  }, [delay]) // delayが変更された時にエフェクトを再実行

  return (
    <Box mb={[20, 4]}>
      <SlideFade offsetY='20px' in={show}>
        <BoothInfo booth={booth} />
      </SlideFade>
    </Box>
  )
}

export default BoothItem
