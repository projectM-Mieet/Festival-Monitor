import React, { useState, useEffect } from 'react'

import { Box, SlideFade } from '@chakra-ui/react'

import EventInfo from './EventInfo'

import { Event } from '@/types/event'

const EventItem = ({ event, delay }: { event: Event; delay?: number }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timeoudId = setTimeout(() => setShow(true), delay || 0)
    return () => clearTimeout(timeoudId)
  }, [delay])

  return (
    <Box>
      <SlideFade offsetY={'20px'} in={show}>
        <EventInfo event={event} />
      </SlideFade>
    </Box>
  )
}

export default EventItem
