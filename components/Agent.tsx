'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { vapi } from '@/lib/vapi.sdk';


enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  type?: string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setcallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setcallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setcallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error('Vapi Error:', error);

    (vapi as any).on('call-start', onCallStart);
    ( vapi as any).on('call-end', onCallEnd);
    ( vapi as any).on('message', onMessage);
    ( vapi as any).on('speech-start', onSpeechStart);
    ( vapi as any).on('speech-end', onSpeechEnd);
    ( vapi as any).on('error', onError);

    return () => {
      ( vapi as any).off('call-start', onCallStart);
      ( vapi as any).off('call-end', onCallEnd);
      ( vapi as any).off('message', onMessage);
      ( vapi as any).off('speech-start', onSpeechStart);
      ( vapi as any).off('speech-end', onSpeechEnd);
      ( vapi as any).off('error', onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      router.push('/');
    }
  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    setcallStatus(CallStatus.CONNECTING);

    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    if (!workflowId) {
      console.error('Missing VAPI Workflow ID');
      return;
    }

    console.log('Starting Vapi call with workflow ID:', workflowId);

    try {
      await vapi.start(workflowId, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } catch (err) {
      console.error('Failed to start Vapi call:', err);
      setcallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = async () => {
    setcallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage =
    messages.length > 0 ? messages[messages.length - 1].content : '';
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <img
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <img
              src="/juhi.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                'transition-opacity duration-500 opacity-0, animate-fadeIn opacity-100'
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col items-center mt-4">
        {callStatus === CallStatus.CONNECTING && (
          <p className="text-yellow-500 mb-2">Connecting to interviewer...</p>
        )}

        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className="relative px-6 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition-all"
            onClick={handleCall}
          >
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping',
                callStatus !== 'CONNECTING' && 'hidden'
              )}
            />
            <span className="relative z-10">
              {isCallInactiveOrFinished ? 'Call' : '. . .'}
            </span>
          </button>
        ) : (
          <button
            className="btn-disconnect px-6 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
            onClick={handleDisconnect}
          >
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
