import './Contact.css'

function Contact() {
  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contact Us</h1>
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-item">
              <strong>Phone:</strong>
              <p>+63 123 456 7890</p>
            </div>
            <div className="info-item">
              <strong>Email:</strong>
              <p>info@pestcontrolpro.com</p>
            </div>
            <div className="info-item">
              <strong>Address:</strong>
              <p>123 Main Street, City, Philippines</p>
            </div>
            <div className="info-item">
              <strong>Business Hours:</strong>
              <p>Monday - Saturday: 8:00 AM - 6:00 PM</p>
              <p>Sunday: 9:00 AM - 4:00 PM</p>
            </div>
          </div>
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="tel" placeholder="Your Phone" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

