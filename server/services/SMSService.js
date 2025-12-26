import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()

/**
 * SMS Service
 * Handles SMS sending via Twilio
 */
export class SMSService {
  constructor() {
    // Initialize Twilio client if credentials are provided
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
      this.phoneNumber = process.env.TWILIO_PHONE_NUMBER
      this.enabled = true
      console.log('✅ Twilio SMS Service initialized')
    } else {
      this.enabled = false
      console.log('⚠️  Twilio credentials not found. SMS will be logged to console.')
    }
  }

  /**
   * Send OTP via SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} otpCode - OTP code to send
   * @returns {Promise<Object>} Send result
   */
  async sendOTP(phoneNumber, otpCode) {
    const message = `Your Aquarius Pest Control OTP code is: ${otpCode}. Valid for 60 seconds. Do not share this code.`

    // Format phone number for display
    const displayPhone = phoneNumber.startsWith('63') ? `+${phoneNumber}` : phoneNumber

    if (!this.enabled) {
      // Log to console if Twilio is not configured
      console.log(`📱 SMS (Mock): To ${displayPhone}`)
      console.log(`   Message: ${message}`)
      console.log(`   OTP Code: ${otpCode}`)
      return {
        success: true,
        message: 'OTP sent (logged to console)',
        sid: 'mock-sid'
      }
    }

    try {
      // Format phone number (ensure it starts with +)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`

      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: formattedPhone
      })

      return {
        success: true,
        message: 'OTP sent successfully',
        sid: result.sid
      }
    } catch (error) {
      console.error('❌ Twilio SMS Error:', error.message)
      
      // Fallback to console log
      console.log(`📱 SMS (Fallback): To ${phoneNumber}`)
      console.log(`   Message: ${message}`)
      
      return {
        success: true,
        message: 'OTP sent (fallback to console)',
        error: error.message
      }
    }
  }
}

export default new SMSService()

