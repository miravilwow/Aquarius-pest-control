import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, X, CheckCircle2, Sparkles, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '../../components/ui/pagination'
import './Services.css'

// GSAP registered in useEffect

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef(null)
  const itemsPerView = 4 // Show 4 services at once
  const servicesPerPage = 1 // Move 1 service per page

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    // Ensure content is visible first
    const ensureVisibility = () => {
      if (carouselRef.current) {
        const children = carouselRef.current.children
        Array.from(children).forEach((child) => {
          child.style.opacity = '1'
          child.style.visibility = 'visible'
          child.style.transform = 'scale(1)'
        })
      }
    }
    
    ensureVisibility()
    
    // Load GSAP animations asynchronously
    import('gsap').then((gsapModule) => {
      import('gsap/ScrollTrigger').then((scrollTriggerModule) => {
        const gsap = gsapModule.gsap || gsapModule.default
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default
        
        if (!gsap || !ScrollTrigger) return
        gsap.registerPlugin(ScrollTrigger)
        
        setTimeout(() => {
          if (carouselRef.current?.children?.length > 0) {
            const children = Array.from(carouselRef.current.children)
            
            // Set initial visible state
            gsap.set(children, {
              opacity: 1,
              scale: 1,
              visibility: 'visible'
            })
            
            // Animate with fromTo to ensure proper initial state
            gsap.fromTo(children, 
              {
                opacity: 0,
                y: 30
              },
              {
                scrollTrigger: {
                  trigger: carouselRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                immediateRender: false
              }
            )
          }
        }, 300)
      }).catch(() => {})
    }).catch(() => {})
  }, [services])

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services')
      setServices(response.data.length > 0 ? response.data : getDefaultServices())
    } catch (error) {
      // Silently use default services if backend is not available
      setServices(getDefaultServices())
      // Only log if it's not a connection refused error
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
        console.error('Error fetching services:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const getDefaultServices = () => [
    { 
      id: 1, 
      name: 'Termite Control', 
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
      coverage: 'Infested and non-infested areas'
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
      coverage: 'All areas including kitchens, bathrooms, and storage areas'
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
      coverage: 'All entry points and infested areas'
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
      coverage: 'All affected areas including bedrooms, furniture, and fabrics'
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
      coverage: 'Kitchen areas, food storage, and entry points'
    }
  ]

  const nextSlide = () => {
    if (currentIndex < services.length - itemsPerView) {
      setCurrentIndex(Math.min(currentIndex + servicesPerPage, services.length - itemsPerView))
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - servicesPerPage))
    }
  }

  const handleViewMore = (service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleBookService = (service) => {
    // Navigate to booking page with service pre-selected
    window.location.href = `/booking?service=${service.id}`
  }

  const totalPages = Math.min(4, Math.max(1, services.length - itemsPerView + 1))
  const currentPage = currentIndex + 1

  const handlePageChange = (page) => {
    const newIndex = page - 1
    if (newIndex >= 0 && newIndex <= services.length - itemsPerView && newIndex !== currentIndex && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(newIndex)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 300)
      }, 100)
    }
  }

  const handleNextPage = () => {
    if (currentIndex < services.length - itemsPerView && currentPage < totalPages && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(Math.min(currentIndex + servicesPerPage, services.length - itemsPerView))
        setTimeout(() => {
          setIsTransitioning(false)
        }, 300)
      }, 100)
    }
  }

  const handlePrevPage = () => {
    if (currentIndex > 0 && currentPage > 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(Math.max(0, currentIndex - servicesPerPage))
        setTimeout(() => {
          setIsTransitioning(false)
        }, 300)
      }, 100)
    }
  }

  const isFirstPage = currentPage === 1 || currentIndex === 0
  const isLastPage = currentPage >= totalPages || currentIndex >= services.length - itemsPerView

  if (loading) {
    return (
      <div className="services-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const visibleServices = services.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <div className="services-page-modern">
      {/* Hero Section */}
      <div className="services-hero-modern">
        <div className="container">
          <div className="services-hero-content">
            <div className="services-hero-badge">
              <Sparkles size={18} />
              <span>Professional Services</span>
            </div>
            <h1 className="services-hero-title">Our Pest Control Services</h1>
            <p className="services-hero-subtitle">Professional, safe, and effective solutions for all your pest control needs</p>
            <Separator className="w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
        </div>
      </div>

      <div className="container services-main-container">
        {/* Carousel Section */}
        <div className="services-carousel-wrapper-modern">
          <div className="services-carousel-container-modern" ref={carouselRef}>
            <div 
              className={`services-grid ${isTransitioning ? 'transitioning' : ''}`}
              key={`grid-${currentIndex}`}
              style={{
                transform: 'translateX(0)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 1
              }}
            >
              {services.map((service, index) => {
                // Only render items that should be visible (4 per page)
                if (index < currentIndex || index >= currentIndex + itemsPerView) {
                  return null
                }
                return (
                <Card key={service.id} className="service-card-modern group">
                  <div className="service-image-modern">
                    <img 
                      src={service.image || '/image/general_pest.jpg'} 
                      alt={service.name}
                      loading="lazy"
                    />
                    <div className="service-image-overlay"></div>
                  </div>
                  <CardHeader className="service-card-header">
                    <h3 className="service-general-title">General Pest Management</h3>
                    <div className="service-header-modern">
                      <CardTitle className="service-title-modern">{service.name}</CardTitle>
                      <div className="service-price-modern">₱{service.price}</div>
                    </div>
                    <CardDescription className="service-description-modern">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="service-card-content">
                    <Button
                      variant="outline"
                      className="service-view-more-btn-modern"
                      onClick={() => handleViewMore(service)}
                    >
                      View More
                      <ChevronRight size={16} />
                    </Button>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="services-pagination">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault()
                      if (!isFirstPage) {
                        handlePrevPage()
                      }
                    }}
                    className={isFirstPage ? 'disabled' : ''}
                    aria-disabled={isFirstPage}
                    style={{
                      pointerEvents: isFirstPage ? 'none' : 'auto',
                      opacity: isFirstPage ? 0.5 : 1,
                      cursor: isFirstPage ? 'not-allowed' : 'pointer'
                    }}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(page)
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault()
                      if (!isLastPage) {
                        handleNextPage()
                      }
                    }}
                    className={isLastPage ? 'disabled' : ''}
                    aria-disabled={isLastPage}
                    style={{
                      pointerEvents: isLastPage ? 'none' : 'auto',
                      opacity: isLastPage ? 0.5 : 1,
                      cursor: isLastPage ? 'not-allowed' : 'pointer'
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Service Details Modal */}
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
                          <div className="modal-treatment-item">
                            <div className="modal-feature-icon-wrapper">
                              <CheckCircle2 className="feature-icon" />
                            </div>
                            <span className="modal-feature-text">1 Year Guarantee Treatment</span>
                          </div>
                          <div className="modal-treatment-item">
                            <div className="modal-feature-icon-wrapper">
                              <CheckCircle2 className="feature-icon" />
                            </div>
                            <span className="modal-feature-text">Infested and non-infested areas</span>
                          </div>
                          <div className="modal-treatment-item">
                            <div className="modal-feature-icon-wrapper">
                              <CheckCircle2 className="feature-icon" />
                            </div>
                            <span className="modal-feature-text">Termite dustings powder treatment</span>
                          </div>
                          <div className="modal-treatment-item">
                            <div className="modal-feature-icon-wrapper">
                              <CheckCircle2 className="feature-icon" />
                            </div>
                            <span className="modal-feature-text">Wood drenching treatment</span>
                          </div>
                          <div className="modal-treatment-item">
                            <div className="modal-feature-icon-wrapper">
                              <CheckCircle2 className="feature-icon" />
                            </div>
                            <span className="modal-feature-text">Injection treatment</span>
                          </div>
                          <div className="modal-treatment-item">
                            <div className="modal-feature-icon-wrapper">
                              <CheckCircle2 className="feature-icon" />
                            </div>
                            <span className="modal-feature-text">Mound demolition</span>
                          </div>
                          <div className="modal-treatment-item">
                            <div className="modal-feature-icon-wrapper">
                              <CheckCircle2 className="feature-icon" />
                            </div>
                            <span className="modal-feature-text">Slab drilling</span>
                          </div>
                          <div className="modal-treatment-item">
                            <div className="modal-feature-icon-wrapper">
                              <CheckCircle2 className="feature-icon" />
                            </div>
                            <span className="modal-feature-text">Soil treatment of surrounding areas</span>
                          </div>
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
    </div>
  )
}

export default Services
