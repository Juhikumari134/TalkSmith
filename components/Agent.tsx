
import React from 'react'
import { cn } from '@/lib/utils'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface AgentProps {
  userName: string
}

const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatus.FINISHED;
  const isSpeaking = true;
  const messages = [
    'What is your name?',
    'My name is Juhi Kumari, Nice to meet you!'
  ];
  const lastmessage = messages[messages.length-1];

  // Replace this with dynamic logic later
  const currentCallStatus: CallStatus = CallStatus.INACTIVE

  return (
    <>
      <div className='call-view'>
        <div className='card-interviewer'>
          <div className='avatar'>
            <img
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className='object-cover'
            />
            {isSpeaking && <span className='animate-speak' />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className='card-border'>
          <div className='card-content'>
            <img
              src="/juhi.png"
              alt="user avatar"
              width={540}
              height={540}
              className='rounded-full object-cover size-[120px]'
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
        {messages.length > 0 && (
          <div className='transcript-border'>
            <div className='transcript'>
              <p key={lastmessage} className={cn('transition-opacity duration-500 opacity-0, animate-fadeIn opacity-100')}>
                {lastmessage}
              </p>
            </div>
          </div>
        )}


      <div className='w-full flex justify-center mt-4'>
        {currentCallStatus !== CallStatus.ACTIVE ? (
          <button className='relative px-6 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition-all'>
            {/* Ping effect only when connecting */}
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping',
                currentCallStatus !== CallStatus.CONNECTING && 'hidden'
              )}
            />
            <span className='relative z-10'>
              {currentCallStatus === CallStatus.INACTIVE ||
              currentCallStatus === CallStatus.FINISHED
                ? 'Call'
                : '. . .'}
            </span>
          </button>
        ) : (
          <button className='btn-disconnect px-6 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all'>
            End
          </button>
        )}
      </div>
    </>
  )
}

export default Agent
