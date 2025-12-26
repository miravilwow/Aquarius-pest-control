import nodemailer from 'nodemailer'

export class ContactController {
  constructor(pool) {
    this.pool = pool
  }

  sendMessage = async (req, res) => {
    try {
      const { name, email, phone, message } = req.body

      if (!name || !email || !phone || !message) {
        return res.status(400).json({ 
          success: false,
          message: 'All fields are required' 
        })
      }

      // Check if email is configured
      const gmailUser = process.env.GMAIL_USER || 'adrianmiravil05@gmail.com'
      const gmailPassword = process.env.GMAIL_APP_PASSWORD

      console.log('📧 Attempting to send email...')
      console.log('Gmail User:', gmailUser)
      console.log('Has Password:', !!gmailPassword)

      // If email not configured, log and return success
      if (!gmailPassword || gmailPassword.trim() === '' || gmailPassword === 'your-16-character-app-password-here') {
        console.log('⚠️ Email not configured. Message details logged:')
        console.log('Name:', name)
        console.log('Email:', email)
        console.log('Phone:', phone)
        console.log('Message:', message)
        
        return res.json({ 
          success: true,
          message: 'Message received! We will contact you soon. (Email sending not configured - check server logs)' 
        })
      }

      // Create transporter (using Gmail)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPassword.trim()
        }
      })

      // Verify connection
      await transporter.verify()
      console.log('✅ Email server connection verified')

      // Email content
      const mailOptions = {
        from: `"Aquarius Pest Control" <${gmailUser}>`,
        to: 'adrianmiravil05@gmail.com',
        replyTo: email,
        subject: `New Contact Form Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a8a;">New Contact Form Submission</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            </div>
            <div style="margin: 20px 0;">
              <p><strong>Message:</strong></p>
              <p style="background: white; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 4px;">
                ${message.replace(/\n/g, '<br>')}
              </p>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #64748b; font-size: 12px;">
              This message was sent from the Aquarius Pest Control website contact form.
            </p>
          </div>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
        `
      }

      const info = await transporter.sendMail(mailOptions)
      console.log('✅ Email sent successfully:', info.messageId)

      res.json({ 
        success: true,
        message: 'Message sent successfully! We will contact you soon.' 
      })
    } catch (error) {
      console.error('❌ Error sending email:', error)
      console.error('Error details:', {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      })
      
      // Return error details for debugging
      res.status(500).json({ 
        success: false,
        message: 'Failed to send email. Please try again or contact us directly.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
}
