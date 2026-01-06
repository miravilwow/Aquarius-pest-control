import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Check, Phone, FileText, Shield, Award, Users, Leaf, DollarSign, Clock, Heart } from 'lucide-react'
import './Home.css'

function Home() {
  const [carouselApi, setCarouselApi] = useState(null)
  const [current, setCurrent] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const autoAdvanceIntervalRef = useRef(null)
  const isPausedRef = useRef(false)
  const [currentPestIndex, setCurrentPestIndex] = useState(0)
  
  // Refs for GSAP animations
  const heroSectionRef = useRef(null)
  const heroBadgeRef = useRef(null)
  const heroTitleLinesRef = useRef([])
  const pestWordRef = useRef(null)
  const ctaButtonRef = useRef(null)

  // Pest list for rotating animation
  const pests = ['Rodents', 'Ants', 'Mosquitoes', 'Cockroaches', 'Termites', 'Bedbugs', 'Spiders', 'Flies']

  // GSAP Hero Section Animations
  useEffect(() => {
    let gsap, pestAnimation
    
    // Dynamically import GSAP
    import('gsap').then((gsapModule) => {
      gsap = gsapModule.gsap || gsapModule.default
      
      if (!gsap || !heroSectionRef.current) return

      // Set initial states
      gsap.set([heroBadgeRef.current, ...heroTitleLinesRef.current, pestWordRef.current, ctaButtonRef.current], {
        opacity: 0,
        y: 30
      })

      // Create master timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Animate hero badge
      if (heroBadgeRef.current) {
        tl.to(heroBadgeRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8
        })
      }

      // Animate hero title lines with stagger
      if (heroTitleLinesRef.current.length > 0) {
        tl.to(heroTitleLinesRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2
        }, '-=0.4')
      }

      // Animate pest word
      if (pestWordRef.current) {
        tl.to(pestWordRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6
        }, '-=0.2')
      }

      // Animate CTA button
      if (ctaButtonRef.current) {
        tl.to(ctaButtonRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6
        }, '-=0.2')
      }

      // Animate pest word rotation with GSAP
      pestAnimation = setInterval(() => {
        if (pestWordRef.current) {
          gsap.to(pestWordRef.current, {
            opacity: 0,
            y: -20,
            scale: 0.8,
            duration: 0.6,
            onComplete: () => {
              // Update state - React will update the text
              setCurrentPestIndex((prevIndex) => (prevIndex + 1) % pests.length)
            }
          })
        }
      }, 3000) // Change every 3 seconds

      return () => {
        if (pestAnimation) clearInterval(pestAnimation)
      }
    }).catch((error) => {
      console.warn('GSAP not available, using fallback animations')
    })

    return () => {
      if (pestAnimation) clearInterval(pestAnimation)
    }
  }, [pests.length])

  // Animate pest word when it changes (React state update)
  useEffect(() => {
    let gsap
    import('gsap').then((gsapModule) => {
      gsap = gsapModule.gsap || gsapModule.default
      
      if (!gsap || !pestWordRef.current) return

      // Animate new word in
      gsap.fromTo(pestWordRef.current, 
        { opacity: 0, y: 20, scale: 0.8 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8,
          ease: 'back.out(1.7)'
        }
      )
    }).catch(() => {})
  }, [currentPestIndex])

  // Add GSAP hover effect to CTA button
  useEffect(() => {
    let gsap
    const button = ctaButtonRef.current?.querySelector('a') || ctaButtonRef.current
    
    if (!button) return

    import('gsap').then((gsapModule) => {
      gsap = gsapModule.gsap || gsapModule.default
      if (!gsap) return

      const handleMouseEnter = () => {
        gsap.to(button, {
          scale: 1.05,
          y: -3,
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      const handleMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      button.addEventListener('mouseenter', handleMouseEnter)
      button.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter)
        button.removeEventListener('mouseleave', handleMouseLeave)
      }
    }).catch(() => {})
  }, [])

  // Fallback: Rotate pest text every 3 seconds (if GSAP fails)
  useEffect(() => {
    const pestInterval = setInterval(() => {
      setCurrentPestIndex((prevIndex) => (prevIndex + 1) % pests.length)
    }, 3000)

    return () => clearInterval(pestInterval)
  }, [pests.length])

  // Services data
  const pestServices = [
    {
      id: 1,
      name: 'Termite Control and Extermination',
      description: 'Professional termite control and extermination with 1-year guarantee',
      price: 300,
      image: '/image/termite.jpg',
      details: 'Comprehensive termite inspection and treatment to protect your property from costly termite damage. Includes thorough treatment coverage of infested and non-infested areas.',
      features: [
        'Termite dustings powder treatment',
        'Wood drenching treatment',
        'Injection treatment',
        'Mound demolition',
        'Slab drilling',
        'Soil treatment of surrounding areas',
        '1 Year Guarantee'
      ],
      coverage: 'Infested and non-infested areas',
      available: true
    },
    {
      id: 2,
      name: 'Cockroach Control',
      description: 'Complete cockroach removal and prevention services',
      price: 200,
      image: '/image/tolits.jpg',
      details: 'Advanced cockroach elimination using FDA-approved safe and effective methods. Includes spray and misting treatment for crawling insects.',
      features: [
        'Deep cleaning',
        'Chemical treatment',
        'Bait stations',
        'Spray treatment',
        'Misting treatment',
        'Guaranteed results'
      ],
      coverage: 'All areas including kitchens, bathrooms, and storage areas',
      available: true
    },
    {
      id: 3,
      name: 'Rodent Control',
      description: 'Safe rodent removal and prevention',
      price: 250,
      image: '/image/general_pest.jpg',
      details: 'Humane and effective rodent control services to protect your property from mice, rats, and other rodents.',
      features: [
        'Humane removal',
        'Entry point sealing',
        'Prevention measures',
        'Regular monitoring',
        'Trap installation',
        'Follow-up service'
      ],
      coverage: 'All entry points and infested areas',
      available: true
    },
    {
      id: 4,
      name: 'Bedbug Control',
      description: 'Professional bedbug treatment and elimination',
      price: 350,
      image: '/image/image2.jpg',
      details: 'Comprehensive bedbug treatment using heat treatment and chemical solutions. Complete elimination guaranteed.',
      features: [
        'Heat treatment',
        'Chemical treatment',
        'Mattress treatment',
        'Furniture treatment',
        'Follow-up inspection',
        'Guaranteed elimination'
      ],
      coverage: 'All affected areas including bedrooms, furniture, and fabrics',
      available: false
    },
    {
      id: 5,
      name: 'Ant Control',
      description: 'Effective ant elimination and prevention',
      price: 150,
      image: '/image/ant.jpg',
      details: 'Our comprehensive ant control service includes inspection, treatment, and prevention strategies to keep your property ant-free.',
      features: [
        'Professional inspection',
        'Targeted treatment',
        'Bait stations',
        'Prevention tips',
        'Follow-up service',
        'Entry point sealing'
      ],
      coverage: 'Kitchen areas, food storage, and entry points',
      available: false
    }
  ]

  // Filter only available services
  const validServices = pestServices.filter(service => service.available)

  // Setup carousel API
  useEffect(() => {
    if (!carouselApi) {
      return
    }

    setCurrent(carouselApi.selectedScrollSnap())

    carouselApi.on('select', () => {
      setCurrent(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

  // Auto-advance carousel
  const startAutoAdvance = useCallback(() => {
    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current)
    }

    if (!carouselApi || validServices.length <= 1 || isPausedRef.current) {
      return
    }

    autoAdvanceIntervalRef.current = setInterval(() => {
      if (!isPausedRef.current && carouselApi) {
        carouselApi.scrollNext()
      }
    }, 6000) // 6 seconds
  }, [carouselApi, validServices.length])

  const pauseAutoAdvance = useCallback(() => {
    isPausedRef.current = true
    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current)
      autoAdvanceIntervalRef.current = null
    }
  }, [])

  const resumeAutoAdvance = useCallback(() => {
    isPausedRef.current = false
    // Resume after 3 seconds of idle
    setTimeout(() => {
      if (!isPausedRef.current) {
        startAutoAdvance()
      }
    }, 3000)
  }, [startAutoAdvance])

  useEffect(() => {
    startAutoAdvance()
    return () => {
      if (autoAdvanceIntervalRef.current) {
        clearInterval(autoAdvanceIntervalRef.current)
      }
    }
  }, [startAutoAdvance])

  // Handle next button (for pagination)
  const handleNext = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (carouselApi) {
      pauseAutoAdvance()
      carouselApi.scrollNext()
      resumeAutoAdvance()
    }
  }

  // Handle previous button (for pagination)
  const handlePrevious = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (carouselApi) {
      pauseAutoAdvance()
      carouselApi.scrollPrev()
      resumeAutoAdvance()
    }
  }

  // Handle pagination click
  const handlePageChange = (page) => {
    if (carouselApi) {
      pauseAutoAdvance()
      carouselApi.scrollTo(page - 1)
      resumeAutoAdvance()
    }
  }

  // Handle view more
  const handleViewMore = (service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  // Handle carousel hover
  const handleCarouselHover = (isHovered) => {
    if (isHovered) {
      pauseAutoAdvance()
    } else {
      resumeAutoAdvance
    }
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-modern" ref={heroSectionRef}>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge" ref={heroBadgeRef}>
              <span>FREE INSPECTION</span>
            </div>
            <h1 className="scroll-m-20 text-center text-7xl font-extrabold tracking-tight text-balance hero-title-custom">
              <span 
                className="hero-title-line" 
                ref={(el) => { if (el) heroTitleLinesRef.current[0] = el }}
              >
                YOUR TRUSTED
              </span>
              <span 
                className="hero-title-line" 
                ref={(el) => { if (el) heroTitleLinesRef.current[1] = el }}
              >
                PEST ELIMINATION
              </span>
              <span 
                className="hero-title-line" 
                ref={(el) => { if (el) heroTitleLinesRef.current[2] = el }}
              >
                CONTROLLING
              </span>
            </h1>
            <div className="hero-pest-animation">
              <span 
                className="pest-word" 
                ref={pestWordRef}
                key={currentPestIndex}
              >
                {pests[currentPestIndex]}
              </span>
            </div>
            <div className="hero-cta-buttons" ref={ctaButtonRef}>
              <Button asChild size="lg" className="btn-primary-hero">
                <Link to="/booking">Book Free Inspection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Permits & Legitimacy */}
      <section className="permits-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Fully Licensed & Legitimate Operations</p>
          <div className="permits-grid">
            <Card className="permit-card">
              <CardContent className="permit-card-content">
                <div className="permit-icon">
                  <FileText size={32} />
                </div>
                <h3>With DTI Permit to Operate</h3>
                <p>Legally registered with the Department of Trade and Industry</p>
              </CardContent>
            </Card>
            <Card className="permit-card">
              <CardContent className="permit-card-content">
                <div className="permit-icon">
                  <FileText size={32} />
                </div>
                <h3>With Business Permit</h3>
                <p>Fully compliant with local business regulations</p>
              </CardContent>
            </Card>
            <Card className="permit-card">
              <CardContent className="permit-card-content">
                <div className="permit-icon">
                  <Shield size={32} />
                </div>
                <h3>With Sanitary Permit</h3>
                <p>Certified safe and sanitary operations</p>
              </CardContent>
            </Card>
            <Card className="permit-card">
              <CardContent className="permit-card-content">
                <div className="permit-icon">
                  <FileText size={32} />
                </div>
                <h3>With BIR Registration</h3>
                <p>Registered with the Bureau of Internal Revenue</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Effective Treatments */}
      <section className="treatments-section">
        <div className="container">
          <h2 className="section-title">Effective Treatments</h2>
          <p className="section-subtitle">Professional pest control solutions tailored to your needs</p>
          <div className="treatments-grid">
            <Card className="treatment-card">
              <CardContent className="treatment-card-content">
                <div className="treatment-icon">
                  <Shield size={40} />
                </div>
                <h3>Crawling Insects</h3>
                <p className="treatment-method">Spray & Misting</p>
                <p className="treatment-description">
                  Comprehensive treatment for ants, cockroaches, and other crawling pests using advanced spray and misting techniques.
                </p>
              </CardContent>
            </Card>
            <Card className="treatment-card">
              <CardContent className="treatment-card-content">
                <div className="treatment-icon">
                  <Shield size={40} />
                </div>
                <h3>Flying Insects</h3>
                <p className="treatment-method">Misting Treatment</p>
                <p className="treatment-description">
                  Effective misting treatment for mosquitoes, flies, and other flying insects to keep your space pest-free.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Service Benefits */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Your Trusted Partner in Pest Control</p>
          <div className="benefits-grid">
            <Card className="benefit-card">
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <DollarSign size={28} />
                </div>
                <h3>No Hidden Charges</h3>
                <p>Transparent pricing with no surprise fees</p>
              </CardContent>
            </Card>
            <Card className="benefit-card">
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <Award size={28} />
                </div>
                <h3>FDA-Approved Chemicals</h3>
                <p>Safe and approved treatment solutions</p>
              </CardContent>
            </Card>
            <Card className="benefit-card">
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <Users size={28} />
                </div>
                <h3>Trained & Experienced Technicians</h3>
                <p>Professional team with years of expertise</p>
              </CardContent>
            </Card>
            <Card className="benefit-card">
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <Leaf size={28} />
                </div>
                <h3>Environmentally Friendly</h3>
                <p>Eco-conscious pest control methods</p>
              </CardContent>
            </Card>
            <Card className="benefit-card">
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <DollarSign size={28} />
                </div>
                <h3>Competitive Pricing</h3>
                <p>Affordable rates without compromising quality</p>
              </CardContent>
            </Card>
            <Card className="benefit-card">
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <Clock size={28} />
                </div>
                <h3>Prompt & Reliable Service</h3>
                <p>On-time service delivery guaranteed</p>
              </CardContent>
            </Card>
            <Card className="benefit-card">
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <Heart size={28} />
                </div>
                <h3>100% Satisfaction Guarantee</h3>
                <p>We stand behind our work with full guarantee</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Services Section with Carousel */}
      {validServices.length > 0 && (
        <section className="services-preview">
          <div className="container">
            <h2 className="section-title">Our Services</h2>
            
            <div 
              className="services-carousel"
              onMouseEnter={() => handleCarouselHover(true)}
              onMouseLeave={() => handleCarouselHover(false)}
            >
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {validServices.map((service) => (
                    <CarouselItem key={service.id}>
                      <div className="p-1">
                        <Card className="service-card-carousel">
                          <div className="service-image-container">
                            <img
                              src={service.image}
                              alt={service.name}
                              className="service-image"
                              onClick={() => handleViewMore(service)}
                            />
                            <div className="service-overlay">
                              <Button
                                variant="secondary"
                                className="view-more-btn"
                                onClick={() => handleViewMore(service)}
                              >
                                View More
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-blue-600">
                                ₱{service.price}
                              </span>
                              <Button
                                onClick={() => {
                                  pauseAutoAdvance()
                                  window.location.href = '/booking'
                                }}
                                onMouseEnter={() => handleCarouselHover(true)}
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
                <CarouselPrevious 
                  className="carousel-nav-btn"
                />
                <CarouselNext 
                  className="carousel-nav-btn"
                />
              </Carousel>
            </div>

            {/* Pagination */}
            {validServices.length > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={handlePrevious}
                      className="cursor-pointer pagination-icon-only"
                    >
                      <span className="sr-only">Previous</span>
                    </PaginationPrevious>
                  </PaginationItem>
                  
                  {validServices.map((_, index) => {
                    const page = index + 1
                    const isActive = current === index
                    
                    return (
                      <PaginationItem key={`page-${page}`}>
                        <PaginationLink
                          href="#"
                          isActive={isActive}
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(page)
                          }}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={handleNext}
                      className="cursor-pointer pagination-icon-only"
                    >
                      <span className="sr-only">Next</span>
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <div className="final-cta-content">
            <h2 className="final-cta-title">Protect Your Home & Business Today</h2>
            <p className="final-cta-subtitle">
              Get professional pest control services you can trust. Contact us now for a free inspection!
            </p>
            <div className="final-cta-buttons">
              <a href="tel:09265557359" className="btn-cta-primary-link">
                <Phone size={20} />
                Call Now
              </a>
              <Button asChild size="lg" className="btn-cta-secondary">
                <Link to="/booking">Request Free Inspection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for View More */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedService.name}</DialogTitle>
                <DialogDescription>{selectedService.description}</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="w-full h-auto rounded-lg mb-4"
                />
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <p className="text-gray-600">{selectedService.details}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Coverage</h4>
                    <p className="text-gray-600">{selectedService.coverage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Features</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {selectedService.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-2xl font-bold text-blue-600">
                      ₱{selectedService.price}
                    </span>
                    <Button
                      onClick={() => {
                        setIsModalOpen(false)
                        window.location.href = '/booking'
                      }}
                    >
                      Book Service
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home
