import shell from 'shelljs'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'

class Downloader {
  ffmpegPath = shell.which('ffmpeg')?.stdout
  filenameRegexp = /[\\\/:*?"<>|]/gi

  async downloadAudio(url: string) {
    return new Promise(async (resolve, reject) => {
      if (!this.ffmpegPath) {
        reject('There is no ffmpeg on server! 😡')
        return
      }

      try {
        const { videoDetails } = await ytdl.getBasicInfo(url)
        const filename = videoDetails.title.replace(this.filenameRegexp, '')
        const stream = ytdl(url, {
          quality: 'highestaudio',
          filter: 'audioonly',
        })

        ffmpeg(stream)
          .setFfmpegPath(this.ffmpegPath)
          .audioBitrate(128)
          .saveToFile(`./audio/${filename}.mp3`)
          .on('end', () => {
            resolve(filename)
          })
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default new Downloader()
