import { useEffect, useRef } from 'react'
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import './Contact.css'

// GSAP registered in useEffect

function Contact() {
  const formRef = useRef(null)
  const infoRef = useRef(null)

  useEffect(() => {
    // Load GSAP animations asynchronously
    import('gsap').then((gsapModule) => {
      import('gsap/ScrollTrigger').then((scrollTriggerModule) => {
        const gsap = gsapModule.gsap || gsapModule.default
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default
        
        if (!gsap || !ScrollTrigger) return
        gsap.registerPlugin(ScrollTrigger)
        
        setTimeout(() => {
          // Form animation
          if (formRef.current?.children?.length > 0) {
            gsap.from(Array.from(formRef.current.children), {
              scrollTrigger: {
                trigger: formRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
              },
              x: 50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out"
            })
          }

          // Info animation
          if (infoRef.current?.children?.length > 0) {
            gsap.from(Array.from(infoRef.current.children), {
              scrollTrigger: {
                trigger: infoRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
              },
              x: -50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out"
            })
          }
        }, 100)
      }).catch(() => {})
    }).catch(() => {})
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    alert('Thank you for your message! We will contact you soon.')
    e.target.reset()
  }

  return (
    <div className="contact-page-modern">
      {/* Hero Section */}
      <div className="contact-hero-modern">
        <div className="container">
          <div className="contact-hero-content">
            <div className="contact-hero-badge">
              <MessageSquare size={18} />
              <span>Get in Touch</span>
            </div>
            <h1 className="contact-hero-title">Contact Us</h1>
            <p className="contact-hero-subtitle">Get in touch with Aquarius Pest Control Services</p>
            <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
        </div>
      </div>

      <div className="container contact-main-container">
        <div className="contact-content-modern">
          <Card className="contact-info-modern" ref={infoRef}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageSquare className="text-blue-600" size={24} />
                Get in Touch
              </CardTitle>
              <CardDescription>Multiple ways to reach us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="info-card-modern hover:border-blue-500 transition-all">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="info-icon-modern bg-blue-500">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <strong className="block mb-1">Phone</strong>
                    <a href="tel:09265557359" className="text-blue-600 hover:underline">09265557359</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="info-card-modern hover:border-green-500 transition-all">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="info-icon-modern bg-green-500">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <strong className="block mb-1">Messaging</strong>
                    <div className="space-y-1">
                      <a href="viber://chat?number=09265557359" className="block text-green-600 hover:underline">Viber: 09265557359</a>
                      <a href="https://wa.me/639265557359" className="block text-green-600 hover:underline">WhatsApp: 09265557359</a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="info-card-modern hover:border-red-500 transition-all">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="info-icon-modern bg-red-500">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <strong className="block mb-1">Email</strong>
                    <a href="mailto:rodolfomiravil65@gmail.com" className="text-red-600 hover:underline break-all">rodolfomiravil65@gmail.com</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="info-card-modern hover:border-purple-500 transition-all">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="info-icon-modern bg-purple-500">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <strong className="block mb-1">Branch</strong>
                    <p className="text-gray-600">🔴 Bulacan Branch</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="info-card-modern highlight-modern border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="info-icon-modern bg-blue-600">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <strong className="block mb-1 text-blue-900">FREE INSPECTION!</strong>
                    <p className="text-blue-700">Contact us today for a free inspection and consultation</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="certifications-card-modern mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">Our Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['DTI Registered', 'Business Permit to Operate', 'Sanitary Permit to Operate', 'BIR Registration', '18 Years of Trusted Service'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="contact-form-card-modern" ref={formRef}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Send className="text-blue-600" size={24} />
                Send us a Message
              </CardTitle>
              <CardDescription>Fill out the form and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="contact-form-modern" onSubmit={handleSubmit}>
                <div className="form-field-group-modern">
                  <Input 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    className="contact-input-modern"
                  />
                </div>
                <div className="form-field-group-modern">
                  <Input 
                    type="email" 
                    placeholder="Your Email" 
                    required 
                    className="contact-input-modern"
                  />
                </div>
                <div className="form-field-group-modern">
                  <Input 
                    type="tel" 
                    placeholder="Your Phone Number" 
                    required 
                    className="contact-input-modern"
                  />
                </div>
                <div className="form-field-group-modern">
                  <Select required>
                    <SelectTrigger className="contact-input-modern">
                      <SelectValue placeholder="Select Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="termite">Termite Control</SelectItem>
                      <SelectItem value="cockroach">Cockroach Control</SelectItem>
                      <SelectItem value="rodent">Rodent Control</SelectItem>
                      <SelectItem value="bedbug">Bedbug Control</SelectItem>
                      <SelectItem value="ant">Ant Control</SelectItem>
                      <SelectItem value="general">General Pest Control</SelectItem>
                      <SelectItem value="inspection">Free Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-field-group-modern">
                  <Textarea 
                    placeholder="Your Message" 
                    rows={5} 
                    required
                    className="contact-textarea-modern"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full contact-submit-btn-modern">
                  <Send size={18} />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Contact
