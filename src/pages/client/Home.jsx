import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, Clock, CheckCircle2, Shield, Award, Users, Building2, Home as HomeIcon, UtensilsCrossed, Hotel, School, Briefcase, Building, Sparkles, ArrowRight } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import './Home.css'

function Home() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const servicesRef = useRef(null)
  const whyChooseRef = useRef(null)
  const serviceAreasRef = useRef(null)
  const certificationsRef = useRef(null)

  useEffect(() => {
    // CRITICAL: Ensure content is visible FIRST before any animations
    const ensureVisibility = () => {
      const elements = [
        heroRef.current,
        featuresRef.current,
        servicesRef.current,
        whyChooseRef.current,
        serviceAreasRef.current,
        certificationsRef.current
      ]
      
      elements.forEach(el => {
        if (el) {
          el.style.opacity = '1'
          el.style.visibility = 'visible'
          el.style.display = el === heroRef.current ? 'flex' : 'block'
          
          // Also set children visible
          if (el.children) {
            Array.from(el.children).forEach(child => {
              child.style.opacity = '1'
              child.style.visibility = 'visible'
            })
          }
        }
      })
      
      // Force all home content visible
      const homeElement = document.querySelector('.home')
      if (homeElement) {
        homeElement.style.opacity = '1'
        homeElement.style.visibility = 'visible'
        homeElement.style.display = 'block'
      }
    }
    
    // Set visibility immediately
    ensureVisibility()
    
    // Also set after a short delay to override any GSAP
    setTimeout(ensureVisibility, 100)
    setTimeout(ensureVisibility, 500)
    
    // Load GSAP animations asynchronously without blocking render
    const loadAnimations = async () => {
      try {
        const gsapModule = await import('gsap')
        const scrollTriggerModule = await import('gsap/ScrollTrigger')
        const gsap = gsapModule.gsap || gsapModule.default
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default
        
        if (!gsap || !ScrollTrigger) {
          console.warn('GSAP not available, content will show without animations')
          return
        }
        
        gsap.registerPlugin(ScrollTrigger)
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          try {
            // Hero animation - use fromTo to ensure visibility
            if (heroRef.current?.children?.length > 0) {
              const children = Array.from(heroRef.current.children)
              // Ensure visible first
              gsap.set(children, { opacity: 1, y: 0, visibility: 'visible' })
              // Animate from hidden to visible
              gsap.fromTo(children, 
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1,
                  stagger: 0.2,
                  ease: "power3.out",
                  immediateRender: false // Don't apply initial state immediately
                }
              )
            }

            // Features animation
            if (featuresRef.current?.children?.length > 0) {
              const children = Array.from(featuresRef.current.children)
              // Ensure visible first
              gsap.set(children, { opacity: 1, y: 0, visibility: 'visible' })
              // Animate with ScrollTrigger
              gsap.fromTo(children,
                { y: 50, opacity: 0 },
                {
                  scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                  },
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: "power2.out",
                  immediateRender: false
                }
              )
            }

            // Services animation
            if (servicesRef.current?.children?.length > 0) {
              const children = Array.from(servicesRef.current.children)
              // Ensure visible first
              gsap.set(children, { opacity: 1, scale: 1, visibility: 'visible' })
              // Animate with ScrollTrigger
              gsap.fromTo(children,
                { scale: 0.8, opacity: 0 },
                {
                  scrollTrigger: {
                    trigger: servicesRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                  },
                  scale: 1,
                  opacity: 1,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "back.out(1.7)",
                  immediateRender: false
                }
              )
            }

            // Why Choose Us animation
            if (whyChooseRef.current?.children?.length > 0) {
              const children = Array.from(whyChooseRef.current.children)
              // Ensure visible first
              gsap.set(children, { opacity: 1, x: 0, visibility: 'visible' })
              // Animate with ScrollTrigger
              gsap.fromTo(children,
                { x: -50, opacity: 0 },
                {
                  scrollTrigger: {
                    trigger: whyChooseRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                  },
                  x: 0,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.15,
                  ease: "power2.out",
                  immediateRender: false
                }
              )
            }

            // Service Areas animation
            if (serviceAreasRef.current?.children?.length > 0) {
              const children = Array.from(serviceAreasRef.current.children)
              // Ensure visible first
              gsap.set(children, { opacity: 1, y: 0, visibility: 'visible' })
              // Animate with ScrollTrigger
              gsap.fromTo(children,
                { y: 30, opacity: 0 },
                {
                  scrollTrigger: {
                    trigger: serviceAreasRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                  },
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  stagger: 0.05,
                  ease: "power2.out",
                  immediateRender: false
                }
              )
            }

            // Certifications animation
            if (certificationsRef.current?.children?.length > 0) {
              const children = Array.from(certificationsRef.current.children)
              // Ensure visible first
              gsap.set(children, { opacity: 1, scale: 1, visibility: 'visible' })
              // Animate with ScrollTrigger
              gsap.fromTo(children,
                { scale: 0, opacity: 0 },
                {
                  scrollTrigger: {
                    trigger: certificationsRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                  },
                  scale: 1,
                  opacity: 1,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "back.out(1.7)",
                  immediateRender: false
                }
              )
            }
          } catch (error) {
            console.error('GSAP animation error:', error)
          }
        }, 500) // Increased delay to ensure content renders first
      } catch (error) {
        console.warn('GSAP import failed, content will show without animations:', error)
      }
    }
    
    loadAnimations()
  }, [])

  const serviceTypes = [
    { icon: HomeIcon, label: 'Residential House' },
    { icon: Building2, label: 'Commercial Building' },
    { icon: Building, label: 'Industrial Building' },
    { icon: Building2, label: 'Warehouse' },
    { icon: UtensilsCrossed, label: 'Restaurant' },
    { icon: Hotel, label: 'Resort' },
    { icon: Building, label: 'Hospital' },
    { icon: School, label: 'School Building' },
    { icon: Briefcase, label: 'Office' },
    { icon: Building, label: 'Condominium' },
    { icon: Building, label: 'Spa' }
  ]

  const serviceAreas = [
    'Bulacan', 'Marilao Bulacan', 'MALOLOS BULACAN', 'Bocaue Bulacan', 'Meycauayan Bulacan',
    'Calumpit Bulacan', 'San Jose Del Monte Bulacan', 'Plaridel Bulacan', 'Baliuag Bulacan',
    'Hagonoy Bulacan', 'Paombong Bulacan', 'Sta Maria Bulacan', 'Balagtas Bulacan',
    'Guiguinto Bulacan', 'Sta Rita Bulacan', 'Obando Bulacan', 'Pandi Bulacan',
    'Tarlac', 'Cavite', 'Laguna', 'Pangasinan', 'Zambales', 'Pampanga',
    'Nueva Ecija', 'Bataan', 'Olongapo', 'Caloocan City', 'Quezon City',
    'Mandaluyong', 'Metro Manila'
  ]

  const pestServices = [
    {
      name: 'Termite control and extermination',
      image: '/image/termite.jpg'
    },
    {
      name: 'Pest control (Cockroach, Ticks and flea, Dry wood Termites, Bedbugs, Mosquitos, Bukbok, Ants)',
      image: '/image/tolits.jpg'
    },
    {
      name: 'Rodent control and extermination',
      image: '/image/general_pest.jpg'
    },
    {
      name: 'General pest management services',
      image: '/image/general_pest.jpg'
    },
    {
      name: 'Inspections and consultation',
      image: '/image/image2.jpg'
    }
  ]

  const treatmentCoverage = [
    'Infested and non-infested areas',
    'Termite dustings powder treatment',
    'Wood drenching treatment',
    'Injection treatment',
    'Mound demolition',
    'Slab drilling',
    'Soil treatment of surrounding areas'
  ]

  const whyChooseUs = [
    { 
      icon: CheckCircle2, 
      title: 'No Hidden Charges', 
      description: 'Transparent pricing with no surprise fees. What you see is what you pay.',
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      icon: Shield, 
      title: 'FDA Approved Chemicals', 
      description: 'Safe and approved pest control solutions for your family and pets.',
      color: '#3b82f6',
      gradient: 'from-blue-500 to-indigo-600'
    },
    { 
      icon: Users, 
      title: 'Expert Technicians', 
      description: '18 years of experience with trained and certified professionals.',
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-violet-600'
    },
    { 
      icon: Sparkles, 
      title: 'Eco-Friendly Solutions', 
      description: 'Environmentally conscious treatments that protect your surroundings.',
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-teal-600'
    },
    { 
      icon: Award, 
      title: 'Competitive Pricing', 
      description: 'Affordable rates without compromising on quality and effectiveness.',
      color: '#f59e0b',
      gradient: 'from-amber-500 to-orange-600'
    },
    { 
      icon: Clock, 
      title: 'Reliable Service', 
      description: 'Prompt response and timely service delivery guaranteed.',
      color: '#ef4444',
      gradient: 'from-red-500 to-rose-600'
    },
    { 
      icon: CheckCircle2, 
      title: '100% Satisfaction', 
      description: 'Complete satisfaction guarantee or we\'ll make it right.',
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-600'
    }
  ]

  // Debug: Log to console
  console.log('Home component rendering...')

  return (
    <div className="home" style={{ 
      display: 'block', 
      visibility: 'visible', 
      opacity: 1, 
      minHeight: '100vh', 
      background: '#ffffff', 
      width: '100%',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Hero Section */}
      <section className="hero" ref={heroRef} style={{ display: 'flex', visibility: 'visible', opacity: 1, position: 'relative', width: '100%' }}>
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              AQUARIUS PEST CONTROL SERVICES
            </h1>
            <p className="hero-subtitle">
              Trusted Pest Control for 18 Years | DTI Registered | With Business & Sanitary Permits
            </p>
            <div className="hero-cta">
              <Link to="/booking" className="btn-primary">
                <Sparkles className="btn-icon" />
                FREE INSPECTION!
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
            <div className="hero-contact">
              <a href="tel:09265557359" className="contact-link">
                <Phone className="contact-icon" />
                <span>09265557359</span>
              </a>
              <a href="mailto:rodolfomiravil65@gmail.com" className="contact-link">
                <Mail className="contact-icon" />
                <span>rodolfomiravil65@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Aquarius Section - Simplified Modern Design */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header" ref={whyChooseRef}>
            <h2 className="section-title">Why Aquarius Pest Control Services?</h2>
            <p className="section-subtitle">
              Professional, Legitimate, and Trusted Pest Control for 18 Years
            </p>
            <Separator className="mt-4 mb-8 w-24 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>
          <div className="why-choose-simplified-grid">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon
              return (
                <div 
                  key={index} 
                  className="why-choose-item-simplified"
                  style={{ 
                    '--accent-color': item.color,
                    '--accent-color-rgb': item.color === '#10b981' ? '16, 185, 129' :
                                         item.color === '#3b82f6' ? '59, 130, 246' :
                                         item.color === '#8b5cf6' ? '139, 92, 246' :
                                         item.color === '#06b6d4' ? '6, 182, 212' :
                                         item.color === '#f59e0b' ? '245, 158, 11' :
                                         item.color === '#ef4444' ? '239, 68, 68' : '59, 130, 246',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <div className="why-choose-item-icon-wrapper">
                    <div className="why-choose-item-icon-bg" style={{ backgroundColor: `${item.color}15` }}>
                      <Icon size={20} className="why-choose-item-icon" style={{ color: item.color }} />
                    </div>
                  </div>
                  <div className="why-choose-item-content">
                    <h3 className="why-choose-item-title">{item.title}</h3>
                    <p className="why-choose-item-description">{item.description}</p>
                  </div>
                  <div className="why-choose-item-indicator"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Certifications Section - Simplified */}
      <section className="certifications-section">
        <div className="container">
          <div className="section-header" ref={certificationsRef}>
            <h2 className="section-title">Our Certifications & Permits</h2>
            <p className="section-subtitle">Legitimate and fully compliant pest control services</p>
            <Separator className="mt-4 mb-8 w-24 mx-auto bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
          <div className="certifications-simplified-list">
            <div className="cert-item-simplified">
              <div className="cert-item-icon-wrapper">
                <Award className="cert-item-icon" />
              </div>
              <div className="cert-item-content">
                <h3 className="cert-item-title">DTI Registered</h3>
                <p className="cert-item-description">Department of Trade and Industry</p>
              </div>
            </div>
            <div className="cert-item-simplified">
              <div className="cert-item-icon-wrapper">
                <Shield className="cert-item-icon" />
              </div>
              <div className="cert-item-content">
                <h3 className="cert-item-title">Business Permit</h3>
                <p className="cert-item-description">Permit to Operate</p>
              </div>
            </div>
            <div className="cert-item-simplified">
              <div className="cert-item-icon-wrapper">
                <Shield className="cert-item-icon" />
              </div>
              <div className="cert-item-content">
                <h3 className="cert-item-title">Sanitary Permit</h3>
                <p className="cert-item-description">Permit to Operate</p>
              </div>
            </div>
            <div className="cert-item-simplified">
              <div className="cert-item-icon-wrapper">
                <Award className="cert-item-icon" />
              </div>
              <div className="cert-item-content">
                <h3 className="cert-item-title">BIR Registration</h3>
                <p className="cert-item-description">Bureau of Internal Revenue</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services We Offer Section */}
      <section className="services-offered-section-modern">
        <div className="container">
          <div className="services-offered-header">
            <h2 className="section-title">Services We Offer</h2>
            <p className="section-subtitle">Professional pest control services for various property types</p>
            <Separator className="mt-4 mb-8 w-24 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>
          <div className="service-types-horizontal-modern" ref={servicesRef}>
            {serviceTypes.map((service, index) => {
              const Icon = service.icon
              return (
                <Card 
                  key={index} 
                  className="service-type-card-modern group"
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="service-icon-modern-wrapper">
                      <div className="service-icon-modern">
                        <Icon className="service-icon-svg" size={28} />
                      </div>
                      <div className="service-icon-glow"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="service-label-modern">{service.label}</h3>
                      <div className="service-label-underline"></div>
                    </div>
                    <div className="service-arrow-modern">
                      <ArrowRight size={20} />
                    </div>
                  </CardContent>
                  <div className="service-card-shine"></div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Services Section - Carousel */}
      <section className="our-services-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-carousel-wrapper">
            <Carousel
              opts={{
                align: "center",
                loop: true,
                slidesToScroll: 1,
                skipSnaps: false,
                dragFree: false,
              }}
              className="services-carousel"
              setApi={(api) => {
                if (api) {
                  let isUpdating = false
                  
                  const updateScale = () => {
                    if (isUpdating) return
                    isUpdating = true
                    
                    // Use multiple animation frames to ensure DOM is fully updated
                    requestAnimationFrame(() => {
                      requestAnimationFrame(() => {
                        try {
                          const selectedIndex = api.selectedScrollSnap()
                          const slides = api.slideNodes()
                          const slideCount = api.slideNodes().length
                          
                          if (!slides || slides.length === 0) {
                            isUpdating = false
                            return
                          }
                          
                          // Get all carousel items (including duplicates for looping)
                          const allItems = document.querySelectorAll('.services-carousel [data-service-index]')
                          
                          // Ensure all slides are visible and properly indexed
                          slides.forEach((slide, slideIndex) => {
                            if (!slide) return
                            
                            // Find the actual service index from the slide
                            const slideElement = slide.querySelector('[data-service-index]')
                            const serviceIndex = slideElement ? parseInt(slideElement.getAttribute('data-service-index')) : slideIndex
                            
                            // Make sure slide is visible
                            slide.style.display = ''
                            slide.style.visibility = 'visible'
                            slide.style.opacity = ''
                            
                            // Reset all slides first
                            slide.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease'
                            slide.style.transformOrigin = 'center'
                            
                            // Check if this slide is the selected one
                            // Handle looping by checking the actual selected index
                            const actualSelectedIndex = selectedIndex % slideCount
                            const actualServiceIndex = serviceIndex % slideCount
                            
                            if (actualServiceIndex === actualSelectedIndex) {
                              slide.style.transform = 'scale(1.5)'
                              slide.style.opacity = '1'
                              slide.style.zIndex = '10'
                            } else {
                              slide.style.transform = 'scale(1.0)'
                              slide.style.opacity = '0.7'
                              slide.style.zIndex = '1'
                            }
                          })
                          
                          // Also update all carousel items directly
                          allItems.forEach((item, index) => {
                            const serviceIndex = parseInt(item.getAttribute('data-service-index'))
                            const actualSelectedIndex = selectedIndex % slideCount
                            const actualServiceIndex = serviceIndex % slideCount
                            
                            const card = item.querySelector('.service-carousel-card')
                            if (card) {
                              if (actualServiceIndex === actualSelectedIndex) {
                                card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease'
                                card.style.transform = 'scale(1.5)'
                                card.style.opacity = '1'
                                card.style.zIndex = '10'
                              } else {
                                card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease'
                                card.style.transform = 'scale(1.0)'
                                card.style.opacity = '0.7'
                                card.style.zIndex = '1'
                              }
                            }
                          })
                          
                          // Also update the carousel content container
                          const carouselContent = document.querySelector('.services-carousel .carousel-content')
                          if (carouselContent) {
                            carouselContent.style.display = ''
                            carouselContent.style.visibility = 'visible'
                            carouselContent.style.opacity = '1'
                          }
                        } catch (error) {
                          console.error('Error updating scale:', error)
                        } finally {
                          isUpdating = false
                        }
                      })
                    })
                  }
                  
                  // Update scale on selection change (most important)
                  api.on('select', () => {
                    setTimeout(() => {
                      updateScale()
                    }, 50)
                  })
                  
                  // Update scale on reinitialization
                  api.on('reInit', () => {
                    setTimeout(() => {
                      updateScale()
                    }, 100)
                  })
                  
                  // Update scale when slides change (for looping)
                  api.on('slidesChanged', () => {
                    setTimeout(() => {
                      updateScale()
                    }, 50)
                  })
                  
                  // Update scale on pointer up (after drag/click)
                  api.on('pointerUp', () => {
                    setTimeout(() => {
                      updateScale()
                    }, 100)
                  })
                  
                  // Update scale on settle (when carousel settles after scroll)
                  api.on('settle', () => {
                    setTimeout(() => {
                      updateScale()
                    }, 50)
                  })
                  
                  // Initial scale
                  setTimeout(() => {
                    updateScale()
                  }, 200)
                }
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {pestServices.map((service, index) => (
                  <CarouselItem 
                    key={`service-${index}`} 
                    className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/3"
                    data-service-index={index}
                  >
                    <div className="p-1">
                      <Card className="service-carousel-card">
                        <div className="service-carousel-image-wrapper">
                          <img 
                            src={service.image || '/image/general_pest.jpg'} 
                            alt={service.name}
                            className="service-carousel-image"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="flex flex-col p-4 min-h-[180px]">
                          <p className="service-carousel-text text-center font-medium mb-4 flex-grow">
                            {service.name}
                          </p>
                          <div className="service-carousel-buttons flex gap-2 mt-auto">
                            <Button
                              variant="outline"
                              className="service-carousel-view-more flex-1"
                              onClick={() => window.location.href = '/services'}
                            >
                              View More
                            </Button>
                            <Button
                              className="service-carousel-book flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() => window.location.href = '/booking'}
                            >
                              Book Service
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="carousel-nav-btn" />
              <CarouselNext className="carousel-nav-btn" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Comprehensive Treatment Section */}
      <section className="treatment-section">
        <div className="container">
          <h2 className="section-title">Our Comprehensive Pest Control Services</h2>
          <div className="treatment-highlight">
            <Sparkles className="highlight-icon" />
            <h3>1 Year Guarantee Treatment</h3>
          </div>
          <div className="treatment-content">
            <div className="treatment-column">
              <h3>Thorough Treatment Coverage:</h3>
              <ul className="treatment-list">
                {treatmentCoverage.map((item, index) => (
                  <li key={index}>
                    <CheckCircle2 className="list-icon" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="treatment-column">
              <h3>Effective Treatments for:</h3>
              <ul className="treatment-list">
                <li><CheckCircle2 className="list-icon" />Crawling insects (spray and misting treatment)</li>
                <li><CheckCircle2 className="list-icon" />Flying insects (misting treatment) 🐛🦗🦟🪰🪳🐜</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="service-areas-section">
        <div className="container">
          <h2 className="section-title">Service Areas</h2>
          <div className="service-areas-grid" ref={serviceAreasRef}>
            {serviceAreas.map((area, index) => (
              <div key={index} className="area-tag">
                #{area}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" ref={featuresRef}>
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Expert Technicians</h3>
              <p>Licensed and certified professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Safe & Effective</h3>
              <p>Eco-friendly solutions for your family</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>24/7 Service</h3>
              <p>Available when you need us most</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Affordable Prices</h3>
              <p>Competitive rates for quality service</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Get Started?</h2>
            <p>Book your FREE inspection today and enjoy a pest-free environment</p>
            <div className="cta-buttons">
              <Link to="/booking" className="btn-primary">
                Book Free Inspection
              </Link>
              <Link to="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
