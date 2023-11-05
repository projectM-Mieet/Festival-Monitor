import { useState, useEffect } from 'react'

import { Box, Text, Flex } from '@chakra-ui/react'

import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

// Extensions and configurations
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

// Your internal project modules
import BoothItem from '@/components/BoothItem'
import EventItem from '@/components/EventItem'
import Loading from '@/components/Loading'
import { monitorSettings } from '@/libs/constants'
import { db } from '@/libs/firebaseAdmin'
import { Booth } from '@/types/booth'
import { Event } from '@/types/event'

export default function Home({ events }: { events: Event[] }) {
  const [loading, setLoading] = useState<boolean>(true)
  const [index, setIndex] = useState<number>(0)
  const [notices, setNotices] = useState<string[] | null>([])
  const [booths, setBooths] = useState<Booth[] | null>(null)

  //今後行われるイベントのみを抽出
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])

  const getUpcomingEvents = async () => {
    const now = dayjs()
    const upcomingEvents = events.filter((event) => {
      return dayjs(event.startAt).isAfter(now)
    })
    setUpcomingEvents(upcomingEvents)
  }

  const getNotices = async () => {
    console.log('notice invoke')
    await axios
      .get('/api/notices')
      .then((res) => {
        const notices = res.data.notices.map((notice: any) => notice.text)
        setNotices(notices)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getBooths = async () => {
    console.log('booth invoke')
    await axios
      .get('/api/booths/list')
      .then((res) => {
        const booths = res.data.booths
        booths.sort((a: any, b: any) => {
          if (a.organizer < b.organizer) {
            return -1
          } else {
            return 1
          }
        })
        setBooths(booths)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getNotices()
    getBooths()
    getUpcomingEvents()
    setLoading(false)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      getNotices()
      getBooths()
      getUpcomingEvents()
    }, 1000 * 60 * monitorSettings.refreshInterval)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => {
        if (loading || !booths) {
          return 0
        }
        if (index == Math.ceil(booths.length / 14)) {
          return 0
        }
        return index + 1
      })
    }, 1000 * monitorSettings.duration)
    return () => clearInterval(interval)
  }, [booths])

  if (loading || !booths) {
    return <Loading />
  }

  return (
    <>
      <main>
        <Box w='100%' h='100%' minHeight={'100vh'}>
          <Box
            w='100%'
            h={['100%', '100%', '94vh']}
            bg='#f5f5f5'
            px={2}
            py={2}
            mb={[32, 32, 0]}
            display='flex'
            flexDirection='column'
            justifyContent='start'
            gap={3}
          >
            {index == Math.ceil(booths.length / 14) && (
              <>
                {upcomingEvents.length == 0 ? (
                  <Text
                    fontSize='2xl'
                    color='black'
                    textAlign='center'
                    fontWeight='bold'
                  >
                    今後開始されるイベントはありません
                  </Text>
                ) : (
                  <>
                    {upcomingEvents.slice(0, 7).map((event: any, i: any) => (
                      <EventItem
                        key={`${index}-${i}`}
                        event={event}
                        delay={i * 80}
                      />
                    ))}
                  </>
                )}
              </>
            )}
            {index != Math.ceil(booths.length / 14) && (
              <>
                <Box h='32'>
                  <Flex justifyContent={'center'} mb={4} height={32}>
                    <img src='/header_mieet.png' alt='kita' />
                  </Flex>
                </Box>
                <Flex
                  direction={['column', 'column', 'row']}
                  justify='space-between'
                  mt={[8, 0]}
                >
                  <Box flex={['0', '1', '1']} pr={[0, 2, 2]}>
                    {booths
                      .slice(index * 14, index * 14 + 7)
                      .map((booth: Booth, i: number) => (
                        <BoothItem
                          key={`${index}-${i}`}
                          booth={booth}
                          delay={i * 80}
                        />
                      ))}
                  </Box>
                  <Box flex={['0', '1', '1']} pl={[0, 2, 2]}>
                    {booths
                      .slice(index * 14 + 7, index * 14 + 14)
                      .map((booth: Booth, i: number) => (
                        <BoothItem
                          key={`${index}-${i}`}
                          booth={booth}
                          delay={i * 80}
                        />
                      ))}
                  </Box>
                </Flex>
              </>
            )}
          </Box>
          <Box
            h='7vh'
            bg='#1B1B23'
            display='flex'
            justifyContent='start'
            alignItems='center'
            width='100%'
            mt={-2}
          >
            <Box width='100%' overflow='hidden' position='relative'>
              <Text
                display='inline-block'
                fontSize='1.75rem'
                color='white'
                fontWeight='bold'
                animation={`flowText ${
                  (notices?.join(
                    '　　　　　　　　　　　　　　　　　　　　　　　'
                  ).length || 5) *
                    0.3 +
                    5 || 10
                }s linear infinite`}
                pl='100%'
                whiteSpace={'nowrap'}
                sx={{
                  '@keyframes flowText': {
                    '0%': {
                      transform: 'translateX(0)',
                    },
                    '100%': {
                      transform: 'translateX(-100%)',
                    },
                  },
                }}
              >
                {notices?.join(
                  '　　　　　　　　　　　　　　　　　　　　　　　'
                )}
              </Text>
            </Box>
          </Box>
        </Box>
      </main>
    </>
  )
}

export async function getStaticProps() {
  const snapshot = await db.collection('events').get()
  let events = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      location: data.location,
      startAt: dayjs(data.startAt.toDate())
        .tz('Asia/Tokyo')
        .format('YYYY/MM/DD HH:mm'),
      endAt: dayjs(data.endAt.toDate())
        .tz('Asia/Tokyo')
        .format('YYYY/MM/DD HH:mm'),
    }
  })
  events = events.sort((a: any, b: any) => {
    if (a.startAt > b.startAt) {
      return 1
    } else {
      return -1
    }
  })

  return {
    props: {
      events,
    },
  }
}
