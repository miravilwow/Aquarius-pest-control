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
import { Check, Phone, FileText, Shield, Award, Users, Leaf, DollarSign, Clock, Heart, Building2, Receipt, BadgeCheck, Bug, Zap, CheckCircle2, ArrowRight } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import './Home.css'

function Home() {
  const [carouselApi, setCarouselApi] = useState(null)
  const [current, setCurrent] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const autoAdvanceIntervalRef = useRef(null)
  const resumeTimeoutRef = useRef(null)
  const isPausedRef = useRef(false)
  const pestAnimationRef = useRef(null)
  const gsapLoadedRef = useRef(false)
  const [testimonialsIndex, setTestimonialsIndex] = useState(0)
  const [currentPestIndex, setCurrentPestIndex] = useState(0)
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)
  const [isCarouselTransitioning, setIsCarouselTransitioning] = useState(false)
  const carouselRef = useRef(null)
  
  // Autoplay plugin ref
  const autoplayPlugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })
  )
  
  // Refs for GSAP animations
  const heroSectionRef = useRef(null)
  const heroBadgeRef = useRef(null)
  const heroTitleLinesRef = useRef([])
  const pestWordRef = useRef(null)
  const ctaButtonRef = useRef(null)
  const whyChooseUsSectionRef = useRef(null)
  const whyChooseUsImageRef = useRef(null)
  const whyChooseUsCardsRef = useRef([])
  const treatmentsSectionRef = useRef(null)
  const treatmentCardsRef = useRef([])
  const benefitsSectionRef = useRef(null)
  const benefitCardsRef = useRef([])
  const servicesSectionRef = useRef(null)
  const finalCtaSectionRef = useRef(null)

  // Pest list for rotating animation
  const pests = ['Rodents', 'Ants', 'Mosquitoes', 'Cockroaches', 'Termites', 'Bedbugs', 'Spiders', 'Flies']

  // Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Maria Santos',
    role: 'Homeowner',
    message: 'Excellent service! They eliminated our pest problem quickly and professionally.',
    rating: 5,
    image: '👩‍💼'
  },
  {
    id: 2,
    name: 'John Reyes',
    role: 'Restaurant Owner',
    message: 'Best pest control company in the area. Highly recommended for business owners!',
    rating: 5,
    image: '👨‍💼'
  },
  {
    id: 3,
    name: 'Ana Cruz',
    role: 'Office Manager',
    message: 'Professional, affordable, and they follow up regularly. Very satisfied!',
    rating: 5,
    image: '👩‍💼'
  },
  {
    id: 4,
    name: 'Carlos Dela Cruz',
    role: 'Homeowner',
    message: 'Fast response time and effective treatment. My family feels safe again.',
    rating: 5,
    image: '👨‍💼'
  }
]

  // GSAP Hero Section Animations
  useEffect(() => {
    let gsap
    
    // Dynamically import GSAP
    import('gsap').then((gsapModule) => {
      gsap = gsapModule.gsap || gsapModule.default
      
      if (!gsap || !heroSectionRef.current) {
        gsapLoadedRef.current = false
        return
      }
      
      gsapLoadedRef.current = true

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
      pestAnimationRef.current = setInterval(() => {
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
    }).catch((error) => {
      console.warn('GSAP not available, using fallback animations')
    })

    return () => {
      if (pestAnimationRef.current) {
        clearInterval(pestAnimationRef.current)
        pestAnimationRef.current = null
      }
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

  // GSAP Why Choose Us Section Animations
  useEffect(() => {
    let gsap, ScrollTrigger, cleanupFunctions = []
    
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger').catch(() => null)
    ]).then(([gsapModule, scrollTriggerModule]) => {
      gsap = gsapModule.gsap || gsapModule.default
      ScrollTrigger = scrollTriggerModule?.ScrollTrigger || scrollTriggerModule?.default
      
      if (!gsap || !whyChooseUsSectionRef.current) return

      // Register ScrollTrigger plugin if available
      if (ScrollTrigger && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger)
      }

      // Set initial states
      if (whyChooseUsImageRef.current) {
        gsap.set(whyChooseUsImageRef.current, {
          opacity: 0,
          x: -50,
          scale: 0.9
        })
      }

      whyChooseUsCardsRef.current.forEach((card) => {
        if (card) {
          gsap.set(card, {
            opacity: 0,
            y: 30
          })
        }
      })

      // Create scroll-triggered animation (with fallback if ScrollTrigger not available)
      const animationConfig = ScrollTrigger ? {
        scrollTrigger: {
          trigger: whyChooseUsSectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse'
        },
        defaults: { ease: 'power3.out' }
      } : {
        defaults: { ease: 'power3.out' }
      }

      const tl = gsap.timeline(animationConfig)

      // Animate image
      if (whyChooseUsImageRef.current) {
        tl.to(whyChooseUsImageRef.current, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8
        })
      }

      // Animate cards with stagger
      const validCards = whyChooseUsCardsRef.current.filter(card => card)
      if (validCards.length > 0) {
        tl.to(validCards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15
        }, '-=0.4')
      }

      // Add hover interactions to cards
      validCards.forEach((card) => {
        if (!card) return

        const handleMouseEnter = () => {
          gsap.to(card, {
            scale: 1.05,
            y: -8,
            duration: 0.3,
            ease: 'power2.out'
          })
          
          // Animate image on card hover
          if (whyChooseUsImageRef.current) {
            gsap.to(whyChooseUsImageRef.current, {
              scale: 1.02,
              duration: 0.3,
              ease: 'power2.out'
            })
          }
        }

        const handleMouseLeave = () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          })
          
          // Reset image
          if (whyChooseUsImageRef.current) {
            gsap.to(whyChooseUsImageRef.current, {
              scale: 1,
              duration: 0.3,
              ease: 'power2.out'
            })
          }
        }

        card.addEventListener('mouseenter', handleMouseEnter)
        card.addEventListener('mouseleave', handleMouseLeave)

        return () => {
          card.removeEventListener('mouseenter', handleMouseEnter)
          card.removeEventListener('mouseleave', handleMouseLeave)
        }
      })

      // Store cleanup functions
      cleanupFunctions.push(() => {
        if (ScrollTrigger && ScrollTrigger.getAll) {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
      })

      // Fallback: If ScrollTrigger not available, animate immediately
      if (!ScrollTrigger) {
        tl.play()
      }
    }).catch((error) => {
      console.warn('GSAP not available for Why Choose Us section:', error)
    })

      return () => {
        cleanupFunctions.forEach(cleanup => cleanup())
      }
    }, [])

  // GSAP Scroll Animations for All Sections
  useEffect(() => {
    let gsap, ScrollTrigger, cleanupFunctions = []
    
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger').catch(() => null)
    ]).then(([gsapModule, scrollTriggerModule]) => {
      gsap = gsapModule.gsap || gsapModule.default
      ScrollTrigger = scrollTriggerModule?.ScrollTrigger || scrollTriggerModule?.default
      
      if (!gsap) return

      // Register ScrollTrigger plugin if available
      if (ScrollTrigger && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger)
      }

      // Common animation config
      const createScrollAnimation = (element, options = {}) => {
        if (!element) return null

        const {
          x = 0,
          y = 50,
          opacity = 0,
          scale = 1,
          duration = 0.8,
          delay = 0,
          ease = 'power3.out',
          start = 'top 80%'
        } = options

        // Set initial state
        gsap.set(element, {
          opacity,
          x,
          y,
          scale
        })

        // Create animation config
        const animationConfig = {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease
        }

        // Add ScrollTrigger if available
        if (ScrollTrigger) {
          animationConfig.scrollTrigger = {
            trigger: element,
            start,
            toggleActions: 'play none none reverse'
          }
        }

        const animation = gsap.to(element, animationConfig)

        // Fallback: if ScrollTrigger not available, animate immediately
        if (!ScrollTrigger) {
          animation.play()
        }

        return animation
      }

      // Treatments Section Animation
      if (treatmentsSectionRef.current) {
        const section = treatmentsSectionRef.current
        const title = section.querySelector('.section-title')
        const subtitle = section.querySelector('.section-subtitle')
        const cards = section.querySelectorAll('.treatment-card')

        if (title) {
          createScrollAnimation(title, { y: 30, delay: 0.1 })
        }
        if (subtitle) {
          createScrollAnimation(subtitle, { y: 30, delay: 0.2 })
        }
        
        cards.forEach((card, index) => {
          if (card) {
            createScrollAnimation(card, {
              y: 50,
              x: index % 2 === 0 ? -30 : 30,
              delay: 0.3 + (index * 0.1),
              duration: 0.7
            })
          }
        })
      }

      // Benefits Section Animation
      if (benefitsSectionRef.current) {
        const section = benefitsSectionRef.current
        const title = section.querySelector('.section-title')
        const subtitle = section.querySelector('.section-subtitle')
        const cards = section.querySelectorAll('.benefit-card')

        if (title) {
          createScrollAnimation(title, { y: 30, delay: 0.1 })
        }
        if (subtitle) {
          createScrollAnimation(subtitle, { y: 30, delay: 0.2 })
        }
        
        cards.forEach((card, index) => {
          if (card) {
            createScrollAnimation(card, {
              y: 40,
              scale: 0.9,
              delay: 0.2 + (index * 0.08),
              duration: 0.6
            })
          }
        })
      }

      // Services Section Animation
      if (servicesSectionRef.current) {
        const section = servicesSectionRef.current
        const title = section.querySelector('.section-title')
        const carousel = section.querySelector('.services-carousel')

        if (title) {
          createScrollAnimation(title, { y: 30, delay: 0.1 })
        }
        if (carousel) {
          createScrollAnimation(carousel, {
            y: 50,
            opacity: 0.8,
            delay: 0.3,
            duration: 1
          })
        }
      }

      // Final CTA Section Animation
      if (finalCtaSectionRef.current) {
        const section = finalCtaSectionRef.current
        const title = section.querySelector('.final-cta-title')
        const subtitle = section.querySelector('.final-cta-subtitle')
        const buttons = section.querySelector('.final-cta-buttons')

        if (title) {
          createScrollAnimation(title, { y: 30, delay: 0.1 })
        }
        if (subtitle) {
          createScrollAnimation(subtitle, { y: 30, delay: 0.2 })
        }
        if (buttons) {
          createScrollAnimation(buttons, {
            y: 40,
            scale: 0.95,
            delay: 0.3,
            duration: 0.8
          })
        }
      }

      // Cleanup function
      cleanupFunctions.push(() => {
        if (ScrollTrigger && ScrollTrigger.getAll) {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
      })
    }).catch((error) => {
      console.warn('GSAP scroll animations not available:', error)
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [])

  // Fallback: Rotate pest text every 3 seconds (only if GSAP interval is not running)
  useEffect(() => {
    // Wait a bit to see if GSAP interval gets set up
    const checkGsapTimeout = setTimeout(() => {
      // Only set up fallback if GSAP interval wasn't created
      if (!pestAnimationRef.current) {
        pestAnimationRef.current = setInterval(() => {
          setCurrentPestIndex((prevIndex) => (prevIndex + 1) % pests.length)
        }, 3000)
      }
    }, 1500) // Give GSAP time to load and set up interval

    return () => {
      clearTimeout(checkGsapTimeout)
    }
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
    },
    {
      id: 6,
      name: 'General Pest Control',
      description: 'Comprehensive pest control services for all types of pests',
      price: 280,
      image: '/image/image-1.jpg',
      details: 'Complete pest control solution covering various types of pests with professional treatment methods.',
      features: [
        'Comprehensive inspection',
        'Multi-pest treatment',
        'Prevention strategies',
        'Regular monitoring',
        'Follow-up service',
        'Guaranteed results'
      ],
      coverage: 'All areas of your property',
      available: true
    }
  ]

  // Filter only available services
  const validServices = pestServices.filter(service => service.available)

  // Auto-advance carousel - Services page style (1 second interval)
  useEffect(() => {
    if (validServices.length <= 1 || isPausedRef.current) return
    
    const interval = setInterval(() => {
      if (!isPausedRef.current && carouselCurrentIndex < validServices.length - 1 && !isCarouselTransitioning) {
        handleCarouselNextPage()
      } else if (carouselCurrentIndex >= validServices.length - 1) {
        clearInterval(interval)
      }
    }, 1000) // 1 second
    
    return () => clearInterval(interval)
  }, [carouselCurrentIndex, validServices.length, isPausedRef, isCarouselTransitioning])

  const pauseAutoAdvance = useCallback(() => {
    isPausedRef.current = true
  }, [])

  const resumeAutoAdvance = useCallback(() => {
    isPausedRef.current = false
  }, [])


  // Handle pagination click
  const handlePageChange = (page) => {
    if (carouselApi) {
      pauseAutoAdvance()
      carouselApi.scrollTo(page - 1)
      resumeAutoAdvance()
    }
  }

  // Carousel handlers - Services page style with smooth transitions (optimized for responsiveness)
  // Auto-pause when user clicks pagination - stays paused until user interaction
  const handleCarouselPageChange = (index) => {
    if (index >= 0 && index < validServices.length && index !== carouselCurrentIndex && !isCarouselTransitioning) {
      setIsCarouselTransitioning(true)
      pauseAutoAdvance() // Pause auto-advance when user clicks pagination
      // Immediate transition start for snappy response
      requestAnimationFrame(() => {
        setCarouselCurrentIndex(index)
        setCurrent(index)
        // Complete transition faster
        setTimeout(() => {
          setIsCarouselTransitioning(false)
          // Don't resume auto-advance - keep it paused after user interaction
        }, 250) // Faster transition duration
      })
    }
  }

  const handleCarouselNextPage = () => {
    if (carouselCurrentIndex < validServices.length - 1 && !isCarouselTransitioning) {
      setIsCarouselTransitioning(true)
      pauseAutoAdvance() // Pause auto-advance when user clicks pagination
      // Immediate transition start for snappy response
      requestAnimationFrame(() => {
        const nextIndex = carouselCurrentIndex + 1
        setCarouselCurrentIndex(nextIndex)
        setCurrent(nextIndex)
        // Complete transition faster
        setTimeout(() => {
          setIsCarouselTransitioning(false)
          // Don't resume auto-advance - keep it paused after user interaction
        }, 250) // Faster transition duration
      })
    }
  }

  const handleCarouselPrevPage = () => {
    if (carouselCurrentIndex > 0 && !isCarouselTransitioning) {
      setIsCarouselTransitioning(true)
      pauseAutoAdvance() // Pause auto-advance when user clicks pagination
      // Immediate transition start for snappy response
      requestAnimationFrame(() => {
        const prevIndex = carouselCurrentIndex - 1
        setCarouselCurrentIndex(prevIndex)
        setCurrent(prevIndex)
        // Complete transition faster
        setTimeout(() => {
          setIsCarouselTransitioning(false)
          // Don't resume auto-advance - keep it paused after user interaction
        }, 250) // Faster transition duration
      })
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
      resumeAutoAdvance()
    }
  }

  // Initialize carousel current index
  useEffect(() => {
    setCarouselCurrentIndex(0)
    setCurrent(0)
  }, [validServices.length])

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

      {/* Our Services Section with Carousel - Using Services Page Style */}
      {validServices.length > 0 && (
        <section className="services-preview" ref={servicesSectionRef}>
          <div className="container">
            <h2 className="section-title">Our Services</h2>
            
            <div className="services-carousel-wrapper-modern">
              <div className="services-carousel-container-modern" ref={carouselRef}>
                <div 
                  className={`services-grid ${isCarouselTransitioning ? 'transitioning' : ''}`}
                  key={`grid-${carouselCurrentIndex}`}
                  style={{
                    transform: 'translateX(0)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 1
                  }}
                >
                  {validServices.map((service, index) => {
                    // Only render the current item (1 per slide)
                    if (index !== carouselCurrentIndex) {
                      return null
                    }
                    return (
                      <Card key={service.id} className="service-card-modern-home group">
                        <div className="service-image-modern-home">
                          <img 
                            src={service.image} 
                            alt={service.name}
                            loading="lazy"
                          />
                          <div className="service-image-overlay-home"></div>
                        </div>
                        <div className="service-overlay-home">
                          <Button
                            variant="secondary"
                            className="service-view-more-btn-home"
                            onClick={() => handleViewMore(service)}
                          >
                            View More
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Pagination - Using Services Page Style */}
            {validServices.length > 1 && (
              <div className="services-pagination">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (carouselCurrentIndex > 0) {
                            handleCarouselPrevPage()
                          }
                        }}
                        className={carouselCurrentIndex === 0 ? 'disabled' : ''}
                        aria-disabled={carouselCurrentIndex === 0}
                        style={{
                          pointerEvents: carouselCurrentIndex === 0 ? 'none' : 'auto',
                          opacity: carouselCurrentIndex === 0 ? 0.5 : 1,
                          cursor: carouselCurrentIndex === 0 ? 'not-allowed' : 'pointer'
                        }}
                      />
                    </PaginationItem>
                    
                    {validServices.map((_, index) => {
                      const page = index + 1
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              handleCarouselPageChange(index)
                            }}
                            isActive={carouselCurrentIndex === index}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (carouselCurrentIndex < validServices.length - 1) {
                            handleCarouselNextPage()
                          }
                        }}
                        className={carouselCurrentIndex >= validServices.length - 1 ? 'disabled' : ''}
                        aria-disabled={carouselCurrentIndex >= validServices.length - 1}
                        style={{
                          pointerEvents: carouselCurrentIndex >= validServices.length - 1 ? 'none' : 'auto',
                          opacity: carouselCurrentIndex >= validServices.length - 1 ? 0.5 : 1,
                          cursor: carouselCurrentIndex >= validServices.length - 1 ? 'not-allowed' : 'pointer'
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Licensed & Certified - Permits & Legitimacy */}
      <section className="permits-section" ref={whyChooseUsSectionRef}>
        <div className="container">
          <h2 className="section-title">Licensed & Certified</h2>
          <p className="section-subtitle">Fully Licensed & Legitimate Operations</p>
          <div className="why-choose-us-wrapper">
            {/* Left Side - Image */}
            <div className="why-choose-us-image-container">
              <div className="why-choose-us-image-wrapper" ref={whyChooseUsImageRef}>
                <img 
                  src="/image/why-choose-use.jpg" 
                  alt="Why Choose Us - Professional Pest Control Services" 
                  className="why-choose-us-image"
                />
                <div className="why-choose-us-image-overlay"></div>
              </div>
            </div>
            
            {/* Right Side - Cards */}
            <div className="permits-grid">
              <Card 
                className="permit-card"
                ref={(el) => { if (el) whyChooseUsCardsRef.current[0] = el }}
              >
                <CardContent className="permit-card-content">
                  <div className="permit-icon">
                    <BadgeCheck size={32} strokeWidth={2.5} />
                  </div>
                  <h3>With DTI Permit to Operate</h3>
                  <p>Legally registered with the Department of Trade and Industry</p>
                </CardContent>
              </Card>
              <Card 
                className="permit-card"
                ref={(el) => { if (el) whyChooseUsCardsRef.current[1] = el }}
              >
                <CardContent className="permit-card-content">
                  <div className="permit-icon">
                    <Building2 size={32} strokeWidth={2.5} />
                  </div>
                  <h3>With Business Permit</h3>
                  <p>Fully compliant with local business regulations</p>
                </CardContent>
              </Card>
              <Card 
                className="permit-card"
                ref={(el) => { if (el) whyChooseUsCardsRef.current[2] = el }}
              >
                <CardContent className="permit-card-content">
                  <div className="permit-icon">
                    <Shield size={32} strokeWidth={2.5} />
                  </div>
                  <h3>With Sanitary Permit</h3>
                  <p>Certified safe and sanitary operations</p>
                </CardContent>
              </Card>
              <Card 
                className="permit-card"
                ref={(el) => { if (el) whyChooseUsCardsRef.current[3] = el }}
              >
                <CardContent className="permit-card-content">
                  <div className="permit-icon">
                    <Receipt size={32} strokeWidth={2.5} />
                  </div>
                  <h3>With BIR Registration</h3>
                  <p>Registered with the Bureau of Internal Revenue</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Effective Treatments */}
      <section className="treatments-section" ref={treatmentsSectionRef}>
        <div className="container">
          <h2 className="section-title">Effective Treatments</h2>
          <p className="section-subtitle">Professional pest control solutions tailored to your needs</p>
          <div className="treatments-grid">
            <Card 
              className="treatment-card"
              ref={(el) => { if (el) treatmentCardsRef.current[0] = el }}
            >
              <CardContent className="treatment-card-content">
                <div className="treatment-icon">
                  <Bug size={40} strokeWidth={2.5} />
                </div>
                <h3>Crawling Insects</h3>
                <p className="treatment-method">Spray & Misting</p>
                <p className="treatment-description">
                  Comprehensive treatment for ants, cockroaches, and other crawling pests using advanced spray and misting techniques.
                </p>
              </CardContent>
            </Card>
            <Card 
              className="treatment-card"
              ref={(el) => { if (el) treatmentCardsRef.current[1] = el }}
            >
              <CardContent className="treatment-card-content">
                <div className="treatment-icon">
                  <Zap size={40} strokeWidth={2.5} />
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
      <section className="benefits-section" ref={benefitsSectionRef}>
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Your Trusted Partner in Pest Control</p>
          <div className="benefits-grid">
            <Card 
              className="benefit-card"
              ref={(el) => { if (el) benefitCardsRef.current[0] = el }}
            >
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <DollarSign size={28} />
                </div>
                <h3>No Hidden Charges</h3>
                <p>Transparent pricing with no surprise fees</p>
              </CardContent>
            </Card>
            <Card 
              className="benefit-card"
              ref={(el) => { if (el) benefitCardsRef.current[1] = el }}
            >
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <Award size={28} />
                </div>
                <h3>FDA-Approved Chemicals</h3>
                <p>Safe and approved treatment solutions</p>
              </CardContent>
            </Card>
            <Card 
              className="benefit-card"
              ref={(el) => { if (el) benefitCardsRef.current[2] = el }}
            >
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <Users size={28} />
                </div>
                <h3>Trained & Experienced Technicians</h3>
                <p>Professional team with years of expertise</p>
              </CardContent>
            </Card>
            <Card 
              className="benefit-card"
              ref={(el) => { if (el) benefitCardsRef.current[3] = el }}
            >
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <Leaf size={28} />
                </div>
                <h3>Environmentally Friendly</h3>
                <p>Eco-conscious pest control methods</p>
              </CardContent>
            </Card>
            <Card 
              className="benefit-card"
              ref={(el) => { if (el) benefitCardsRef.current[4] = el }}
            >
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <DollarSign size={28} />
                </div>
                <h3>Competitive Pricing</h3>
                <p>Affordable rates without compromising quality</p>
              </CardContent>
            </Card>
            <Card 
              className="benefit-card"
              ref={(el) => { if (el) benefitCardsRef.current[5] = el }}
            >
              <CardContent className="benefit-card-content">
                <div className="benefit-icon">
                  <Clock size={28} />
                </div>
                <h3>Prompt & Reliable Service</h3>
                <p>On-time service delivery guaranteed</p>
              </CardContent>
            </Card>
            <Card 
              className="benefit-card"
              ref={(el) => { if (el) benefitCardsRef.current[6] = el }}
            >
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

      {/* Final CTA Section */}
      <section className="final-cta-section" ref={finalCtaSectionRef}>
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
            {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-2 bg-blue-100 rounded-full">
              <Heart className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-600">What Our Customers Say</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Customer Testimonials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who trust us with their pest control needs
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="max-w-4xl mx-auto">
            <Carousel
              opts={{
                align: 'center',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="pt-8 pb-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                          {/* Avatar */}
                          <div className="text-5xl">{testimonial.image}</div>

                          {/* Stars Rating */}
                          <div className="flex gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-lg">★</span>
                            ))}
                          </div>

                          {/* Message */}
                          <p className="text-lg text-gray-700 italic max-w-2xl">
                            "{testimonial.message}"
                          </p>

                          {/* Customer Info */}
                          <div className="pt-4 border-t border-gray-200 w-full">
                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation */}
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>

            {/* Mobile Dots Navigation */}
            <div className="flex justify-center gap-2 mt-6 sm:hidden">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialsIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === testimonialsIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 w-2'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Details Modal - Services Page Style */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="service-modal">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="modal-title">{selectedService.name}</DialogTitle>
                <DialogDescription className="modal-price">
                  Starting at ₱{selectedService.price}
                </DialogDescription>
              </DialogHeader>
              <div className="modal-content">
                <div className="modal-image">
                  <img src={selectedService.image || '/image/general_pest.jpg'} alt={selectedService.name} />
                </div>
                <div className="modal-details">
                  <p className="modal-description">{selectedService.details}</p>
                  <div className="modal-section">
                    <h4>Coverage:</h4>
                    <p>{selectedService.coverage}</p>
                  </div>
                  <div className="modal-section">
                    <h4 className="modal-section-title">
                      <CheckCircle2 className="modal-section-icon" />
                      What's Included:
                    </h4>
                    <div className="modal-features-container">
                      <div className="modal-treatment-grid">
                        {selectedService.features.map((feature, index) => (
                          <div key={index} className="modal-treatment-item">
                            <div className="modal-feature-icon-wrapper">
                              <CheckCircle2 className="feature-icon" />
                            </div>
                            <span className="modal-feature-text">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <Link 
                  to={`/booking?service=${selectedService.id}`}
                  className="modal-book-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Book This Service
                  <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home
