import axios from 'axios'

export const extractTextFromPDF = async (url) => {
  try {
    console.log('Downloading PDF from:', url)

    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    })

    const buffer = Buffer.from(response.data)
    console.log('PDF buffer size:', buffer.length, 'bytes')

    // dynamic import to avoid ESM issues
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default

    const data = await pdfParse(buffer)
    const text = data.text?.trim()

    console.log('Extracted text preview:', text?.slice(0, 100))

    if (!text) {
      console.log('❌ PDF text is empty')
      return null
    }

    return text

  } catch (error) {
    console.error('Error extracting text from PDF:', error.message)
    return null
  }
}