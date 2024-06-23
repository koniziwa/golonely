type commandType = {
  command: string
  description: string
}

const commands: commandType[] = [
  {
    command: 'get',
    description: 'Get {YOUTUBE_AUDIO_URL} from YouTube',
  },
]

export default commands
