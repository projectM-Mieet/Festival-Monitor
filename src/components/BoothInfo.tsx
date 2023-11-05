import { Box, Text } from '@chakra-ui/react'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')
import { Booth } from '@/types/booth'

const BoothInfo = ({ booth }: { booth: Booth }) => {
  const statusToString = (
    status: 'open' | 'closed' | 'break' | 'preparing'
  ) => {
    if (status === 'open') {
      return '開催中'
    } else if (status === 'closed') {
      return '終了'
    } else if (status === 'break') {
      return '中断中'
    } else if (status === 'preparing') {
      return '準備中'
    }
  }
  const waitingTimeToColor = (waitingTime: number) => {
    if (waitingTime >= 30) {
      // 鮮やかな赤からオレンジへのグラデーション
      return 'linear-gradient(135deg, #EA3323 0%, #F06D65 50%, #FF6347 100%)'
    } else if (waitingTime >= 20) {
      // 暖色のオレンジから黄色へのグラデーション
      return 'linear-gradient(135deg, #f7971e 0%, #FFB84D 50%, #FFD480 100%)'
    } else if (waitingTime >= 10) {
      // 鮮やかな緑からライトグリーンへのグラデーション
      return 'linear-gradient(135deg, #16a34a 0%, #4AE371 50%, #80FFA1 100%)'
    } else {
      // 鮮やかな青からライトブルーへのグラデーション
      return 'linear-gradient(135deg, #2952BD 0%, #537BC4 50%, #7FA6DB 100%)'
    }
  }
  return (
    <Box
      display='flex'
      flexDirection={['column', 'column', 'row']}
      gap={3}
      h={['8rem', '8rem', '6.4rem']}
      w={['100%', '100%', '100%']}
    >
      <Box
        flex={1}
        h={['auto', 'auto', '100%']}
        bg='#1B1B23'
        borderRadius='10px'
        display='flex'
        flexDirection={['column', 'column', 'row']}
        px={4}
        alignItems='center'
        gap={[3, 3, 8]}
      >
        <Box
          w={['100%', '100%', 64]}
          h={['auto', 'auto', '100%']}
          ml={2}
          bg='#393939'
          borderRadius='10px'
          display='flex'
          flexDirection={['row', 'row', 'column']}
          justifyContent='center'
          alignItems={'center'}
          gap={1.5}
        >
          {booth.area && (
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              gap={1.5}
            >
              <Text
                fontSize={['1.35rem', '1.5rem']}
                color='white'
                fontWeight='bold'
              >
                {booth.area}
              </Text>

              {booth.floor && (
                <Text
                  fontSize={['1.35rem', '1.5rem']}
                  color='white'
                  fontWeight='bold'
                >
                  {booth.floor}階
                </Text>
              )}
            </Box>
          )}

          <Box>
            <Text
              fontSize={['1.35rem', '1.5rem']}
              color='white'
              fontWeight='bold'
            >
              {booth.location}
            </Text>
          </Box>
        </Box>

        <Box
          display='flex'
          flexDirection='column'
          alignItems='start'
          gap={[1, 1.5]}
          flex={1}
          mb={[3, 3, 0]}
        >
          <Text
            fontSize={['1.3rem']}
            color='white'
            fontWeight='bold'
            lineHeight={'100%'}
          >
            {booth.name}
          </Text>
          <Text
            fontSize={['1rem', '1rem']}
            color='white'
            fontWeight='bold'
            lineHeight={'100%'}
          >
            {booth.organizer}{' '}
          </Text>
        </Box>
      </Box>
      <Box
        w={['100%', '100%', 72]}
        h={['auto', 'auto', '100%']}
        bg={
          booth.status === 'open'
            ? waitingTimeToColor(booth.waiting)
            : 'linear-gradient(135deg, #1B1B23 0%, #23232b 100%)'
        }
        borderRadius='10px'
        display='flex'
        flexDirection={'column'}
        justifyContent='center'
        alignItems='center'
        gap={1}
      >
        {booth.status === 'open' ? (
          <Text
            fontSize={['1.35rem', '1.5rem']}
            color='white'
            textAlign='center'
            fontWeight='bold'
            lineHeight={'100%'}
          >
            {booth.waiting}
            {booth.waiting >= 30 ? (
              <Text
                fontSize={['1.35rem', '1.5rem']}
                color='white'
                textAlign='center'
                fontWeight='bold'
                lineHeight={'100%'}
                as='span'
                ml={1}
              >
                分以上待ち
              </Text>
            ) : (
              <Text
                fontSize={['1.35rem', '1.5rem']}
                color='white'
                textAlign='center'
                fontWeight='bold'
                lineHeight={'100%'}
                as='span'
                ml={1}
              >
                分待ち
              </Text>
            )}
          </Text>
        ) : (
          <Text
            fontSize={['1.35rem', '1.5rem']}
            color='white'
            textAlign='center'
            fontWeight='bold'
            lineHeight={'100%'}
          >
            {statusToString(booth.status)}
          </Text>
        )}
        <Box>
          <Text fontSize={['1rem', '1.2rem']} color='white' fontWeight='bold'>
            {booth.memo ? '   【📢: ' + booth.memo + ' 】' : ''}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default BoothInfo
