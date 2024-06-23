import TelegramBot from 'node-telegram-bot-api'
import { existsSync, mkdirSync, createReadStream } from 'fs'

import Downloader from './api/Downloader'

import TELEGRAM_BOT_TOKEN from './private/TELEGRAM_BOT_TOKEN'

import commands from './constants/commands'
import allowedUsers from './config/allowedUsers'

if (!existsSync('./audio')) {
  mkdirSync('./audio')
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: true,
  filepath: false,
})

bot.setMyCommands(commands)

bot.on('polling_error', e => console.log(e))

bot.on('text', async msg => {
  if (!msg.from?.username) return
  if (!allowedUsers.includes(msg.from.username)) {
    bot.sendMessage(msg.chat.id, 'You have no rights to use this bot! 👎')
    return
  }
  if (!msg.text) return

  const commandsInMessage = msg.text.match(/^\/[a-zA-z]+/)
  if (!commandsInMessage) {
    bot.sendMessage(msg.chat.id, 'Please enter a COMMAND! 😩')
    return
  }

  const command = commandsInMessage[0]

  switch (command) {
    case '/start':
      bot.sendMessage(
        msg.chat.id,
        'Text me URL of a video which you want to download using /get {YOUR_VIDEO_URL} 😎'
      )

      break

    case '/get':
      if (!msg.text.substring(0, msg.text.indexOf(' '))) {
        bot.sendMessage(msg.chat.id, 'No URL was provided! 🤨')
        return
      }

      const url = msg.text.substring(msg.text.indexOf(' ') + 1).trim()

      Downloader.downloadAudio(url)
        .then(filename => {
          bot.sendAudio(
            msg.chat.id,
            createReadStream(`./audio/${filename}.mp3`)
          )
          bot.deleteMessage(msg.chat.id, msg.message_id)
        })
        .catch(() => bot.sendMessage(msg.chat.id, 'Invalid URL! 🥺'))

      break

    default:
      bot.sendMessage(msg.chat.id, 'Please enter a VALID command! 🙏')
  }
})
