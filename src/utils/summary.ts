class ProgressBar {
  total: number
  width: number
  current: number
  curNumRetries: number
  maxNumRetries: number

  constructor(total: number, maxNumRetries: number, width: number = 50) {
    this.total = total
    this.width = width
    this.current = 0
    this.curNumRetries = 0
    this.maxNumRetries = maxNumRetries
  }

  update(current: number) {
    this.current = current
    this.curNumRetries++
    this.render()
  }

  private render() {
    const progress = this.current / this.total
    const filledBarLength = Math.round(this.width * progress)
    const emptyBarLength = this.width - filledBarLength

    const filledBar = '█'.repeat(filledBarLength)
    const emptyBar = '░'.repeat(emptyBarLength)

    console.log(`Maximum Retries: [${filledBar}${emptyBar}] ${this.curNumRetries} of ${this.maxNumRetries}`)
  }
}

export default ProgressBar
