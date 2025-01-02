'use client'

/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Grid, 
    Container, 
    Card, 
    CardContent, 
    CardMedia,
    Stack,
    Divider,
    useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
    LocalCarWashRounded as CarWashIcon, 
    LocalCarWash as LocalCarWashIcon, 
    Shield as ShieldIcon,
    Star as StarIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon
} from '@mui/icons-material/index';
import { useRouter } from 'next/navigation';

// Placeholder Images
const placeholderHeroImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" fill="%23000000">' +
    '<rect width="100%" height="100%" fill="%23FFD700"/>' +
    '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="50">Precision Detailing</text>' +
    '</svg>';

const placeholderServiceImages = [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23000000">' +
    '<rect width="100%" height="100%" fill="%23F0F0F0"/>' +
    '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="30">Exterior Detail</text>' +
    '</svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23000000">' +
    '<rect width="100%" height="100%" fill="%23E0E0E0"/>' +
    '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="30">Interior Detail</text>' +
    '</svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23000000">' +
    '<rect width="100%" height="100%" fill="%23D0D0D0"/>' +
    '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="30">Full Detail</text>' +
    '</svg>'
];

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '100vh',
    minHeight: '600px',
    overflow: 'hidden',
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(10, 2)
    }
}));

const ServiceCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)'
    },
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(2)
    }
}));

const LandingPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const videoRef = useRef(null);
    const [videoError, setVideoError] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const router = useRouter();

    const handleVideoError = () => {
        console.error('Video failed to load');
        setVideoError(true);
    };

    const handleBookNow = () => {
        router.push('/booking');
    };

    const services = [
        {
            title: 'Exterior Detail',
            description: 'Comprehensive exterior cleaning and protection',
            icon: <CarWashIcon fontSize="large" color="primary" />,
            image: placeholderServiceImages[0]
        },
        {
            title: 'Interior Detail',
            description: 'Deep cleaning and restoration of interior',
            icon: <LocalCarWashIcon fontSize="large" color="primary" />,
            image: placeholderServiceImages[1]
        },
        {
            title: 'Full Detail',
            description: 'Complete interior and exterior transformation',
            icon: <ShieldIcon fontSize="large" color="primary" />,
            image: placeholderServiceImages[2]
        }
    ];

    const features = [
        { 
            icon: <StarIcon />, 
            title: 'Premium Quality', 
            description: 'Top-tier detailing services' 
        },
        { 
            icon: <LocationIcon />, 
            title: 'Mobile Service', 
            description: 'We come to you in Santa Cruz' 
        },
        { 
            icon: <PhoneIcon />, 
            title: 'Easy Booking', 
            description: 'Quick and convenient scheduling' 
        }
    ];

    const testimonials = [
        {
            name: 'Michael Rodriguez',
            role: 'Local Business Owner',
            review: 'Precision Detailing transformed my company vehicles. The attention to detail is unmatched, and they always make my fleet look pristine. Highly recommended for professional car care!',
            rating: 5,
            avatar: '👨‍💼'
        },
        {
            name: 'Sarah Thompson',
            role: 'Tesla Model 3 Owner',
            review: 'As a car enthusiast, I\'m extremely picky about detailing. Precision Detailing exceeded all my expectations. The ceramic coating they applied looks incredible and provides amazing protection.',
            rating: 5,
            avatar: '👩‍💻'
        },
        {
            name: 'David Chen',
            role: 'Luxury Car Collector',
            review: 'I trust Precision Detailing with my high-end vehicles. Their mobile service is convenient, and the level of care they provide is exceptional. They treat each car like a work of art.',
            rating: 5,
            avatar: '👨‍🔧'
        }
    ];

    const featuredServices = [
        {
            title: 'Ceramic Coating',
            description: 'Ultimate protection for your vehicle\'s paint. Our premium ceramic coating provides long-lasting shine and defense against environmental damage.',
            icon: '🛡️',
            color: 'primary.main'
        },
        {
            title: 'Interior Detailing',
            description: 'Deep clean and restoration of your vehicle\'s interior. We meticulously clean every surface, leaving your car looking and smelling fresh.',
            icon: '✨',
            color: 'secondary.main'
        },
        {
            title: 'Mobile Detailing',
            description: 'Convenience meets quality. We bring professional detailing services directly to your location in Santa Cruz and surrounding areas.',
            icon: '🚚',
            color: 'warning.main'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <Box>
            {/* Hero Section */}
            <HeroSection>
                <Box
                    component="video"
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={handleVideoError}
                    onLoadedData={() => setVideoLoaded(true)}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        opacity: videoLoaded ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                        display: videoError ? 'none' : 'block'
                    }}
                >
                    <source 
                        src="/videos/hero-video.mp4" 
                        type="video/mp4" 
                    />
                    <source 
                        src="/videos/hero-video.webm" 
                        type="video/webm" 
                    />
                    Your browser does not support the video tag.
                </Box>
                
                {/* Fallback Image */}
                <Box 
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${placeholderHeroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 1,
                        opacity: (!videoLoaded || videoError) ? 1 : 0,
                        transition: 'opacity 0.5s ease'
                    }}
                />
                
                {/* Loading Overlay */}
                {!videoLoaded && !videoError && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                border: '4px solid rgba(255, 215, 0, 0.2)',
                                borderTopColor: '#FFD700',
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                }
                            }}
                        />
                    </Box>
                )}
                <Box 
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        zIndex: 2
                    }}
                />
                <Container 
                    maxWidth="md" 
                    sx={{
                        position: 'relative',
                        zIndex: 3,
                        textAlign: 'center'
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography 
                            variant="h1" 
                            component="h1" 
                            gutterBottom 
                            sx={{ 
                                color: '#FFD700', 
                                fontWeight: 'bold',
                                textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                lineHeight: 1.2,
                                mb: 3
                            }}
                        >
                            Precision Detailing
                        </Typography>

                        <Typography 
                            variant="h4" 
                            component="h2"
                            sx={{ 
                                color: 'white', 
                                mb: 4,
                                textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
                                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                maxWidth: '800px',
                                mx: 'auto'
                            }}
                        >
                            Mobile Detailing Services in Santa Cruz, CA
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            onClick={handleBookNow}
                            sx={{
                                padding: { xs: '12px 30px', sm: '15px 40px' },
                                fontSize: { xs: '1rem', sm: '1.2rem' },
                                fontWeight: '600',
                                background: '#FFD700',
                                color: '#000',
                                borderRadius: '30px',
                                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                                '&:hover': {
                                    background: '#000',
                                    color: '#FFD700',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)'
                                }
                            }}
                        >
                            Book Now
                        </Button>
                    </motion.div>
                </Container>
            </HeroSection>

            {/* Services Section */}
            <Box id="services" sx={{ py: 10, bgcolor: 'background.paper' }}>
                <Container>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Typography 
                            variant="h3" 
                            align="center" 
                            gutterBottom
                            sx={{ 
                                fontWeight: 'bold',
                                color: 'text.primary',
                                mb: 6,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            Our Premium Services
                        </Typography>
                        <Grid 
                            container 
                            spacing={{ xs: 3, md: 6 }} 
                            component={motion.div}
                            variants={containerVariants}
                        >
                            {services.map((service, index) => (
                                <Grid 
                                    item 
                                    xs={12} 
                                    md={4} 
                                    key={index}
                                    component={motion.div}
                                    variants={itemVariants}
                                >
                                    <ServiceCard
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)',
                                                '& .service-image': {
                                                    transform: 'scale(1.1)'
                                                }
                                            }
                                        }}
                                    >
                                        <Box sx={{ 
                                            overflow: 'hidden',
                                            position: 'relative',
                                            height: '240px'
                                        }}>
                                            <CardMedia
                                                component="img"
                                                height="240"
                                                image={service.image}
                                                alt={service.title}
                                                className="service-image"
                                                sx={{ 
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease',
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            />
                                        </Box>
                                        <CardContent 
                                            sx={{ 
                                                textAlign: 'center',
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                p: { xs: 2, sm: 3 }
                                            }}
                                        >
                                            <Box>
                                                <Box sx={{ 
                                                    color: 'primary.main',
                                                    fontSize: '3rem',
                                                    mb: 2
                                                }}>
                                                    {service.icon}
                                                </Box>
                                                <Typography 
                                                    variant="h5" 
                                                    component="div"
                                                    sx={{ 
                                                        fontWeight: 'bold',
                                                        mb: 2,
                                                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                                    }}
                                                >
                                                    {service.title}
                                                </Typography>
                                                <Typography 
                                                    variant="body1" 
                                                    color="text.secondary"
                                                    sx={{ 
                                                        mb: 3,
                                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                                    }}
                                                >
                                                    {service.description}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                onClick={handleBookNow}
                                                sx={{
                                                    width: '100%',
                                                    fontWeight: 'bold',
                                                    py: 1.5,
                                                    background: 'linear-gradient(45deg, #FFD700 30%, #e6c200 90%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #e6c200 30%, #FFD700 90%)',
                                                        transform: 'scale(1.05)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                Book Now
                                            </Button>
                                        </CardContent>
                                    </ServiceCard>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Featured Services Section */}
            <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
                <Container>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Typography 
                            variant="h3" 
                            align="center" 
                            gutterBottom
                            sx={{ 
                                fontWeight: 'bold',
                                color: 'text.primary',
                                mb: 6,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            Featured Services
                        </Typography>
                        <Grid 
                            container 
                            spacing={{ xs: 3, md: 6 }} 
                            justifyContent="center"
                            component={motion.div}
                            variants={containerVariants}
                        >
                            {featuredServices.map((service, index) => (
                                <Grid 
                                    item 
                                    xs={12} 
                                    md={4} 
                                    key={index}
                                    component={motion.div}
                                    variants={itemVariants}
                                >
                                    <Box 
                                        textAlign="center"
                                        sx={{
                                            p: 4,
                                            borderRadius: '16px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)',
                                                backgroundColor: 'rgba(255, 215, 0, 0.05)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'inline-flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                            mb: 3,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                                backgroundColor: 'rgba(255, 215, 0, 0.2)'
                                            }
                                        }}>
                                            <Box sx={{ 
                                                fontSize: '48px', 
                                                color: service.color 
                                            }}>
                                                {service.icon}
                                            </Box>
                                        </Box>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                mb: 2,
                                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                            }}
                                        >
                                            {service.title}
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            color="text.secondary"
                                            sx={{ 
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                maxWidth: '300px',
                                                mx: 'auto'
                                            }}
                                        >
                                            {service.description}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ bgcolor: 'background.paper', py: 10 }}>
                <Container>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Typography 
                            variant="h3" 
                            align="center" 
                            gutterBottom
                            sx={{ 
                                fontWeight: 'bold',
                                color: 'text.primary',
                                mb: 6,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            Why Choose Us
                        </Typography>
                        <Grid 
                            container 
                            spacing={{ xs: 3, md: 6 }} 
                            justifyContent="center"
                            component={motion.div}
                            variants={containerVariants}
                        >
                            {features.map((feature, index) => (
                                <Grid 
                                    item 
                                    xs={12} 
                                    md={4} 
                                    key={index}
                                    component={motion.div}
                                    variants={itemVariants}
                                >
                                    <Box 
                                        textAlign="center"
                                        sx={{
                                            p: 4,
                                            borderRadius: '16px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)',
                                                backgroundColor: 'rgba(255, 215, 0, 0.05)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'inline-flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                            mb: 3,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                                backgroundColor: 'rgba(255, 215, 0, 0.2)'
                                            }
                                        }}>
                                            {React.cloneElement(feature.icon, { 
                                                fontSize: 'large', 
                                                color: 'primary',
                                                sx: { fontSize: 48 } 
                                            })}
                                        </Box>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                mb: 2,
                                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            color="text.secondary"
                                            sx={{ 
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                maxWidth: '300px',
                                                mx: 'auto'
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box sx={{ py: 10, bgcolor: 'background.default' }}>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography 
                            variant="h3" 
                            align="center" 
                            gutterBottom
                            sx={{ 
                                fontWeight: 'bold',
                                color: 'text.primary',
                                mb: 6,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            What Our Customers Say
                        </Typography>
                        <Grid 
                            container 
                            spacing={{ xs: 3, md: 6 }} 
                            justifyContent="center"
                        >
                            {testimonials.map((testimonial, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Box
                                        sx={{
                                            p: 4,
                                            borderRadius: '16px',
                                            backgroundColor: 'background.paper',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <Box sx={{ 
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'primary.main',
                                                mr: 2
                                            }}>
                                                {testimonial.avatar}
                                            </Box>
                                            <Typography 
                                                variant="h6"
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    color: 'text.primary'
                                                }}
                                            >
                                                {testimonial.name}
                                            </Typography>
                                            <Box sx={{ 
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5
                                            }}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIcon 
                                                        key={star}
                                                        sx={{ 
                                                            color: star <= testimonial.rating ? 'primary.main' : 'action.disabled',
                                                            fontSize: '1.2rem'
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                        <Typography 
                                            variant="body1" 
                                            color="text.secondary"
                                            sx={{ 
                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                fontStyle: 'italic'
                                            }}
                                        >
                                            "{testimonial.review}"
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Contact Section */}
            <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography 
                            variant="h3" 
                            align="center" 
                            gutterBottom
                            sx={{ 
                                fontWeight: 'bold',
                                color: 'text.primary',
                                mb: 6,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            Get In Touch
                        </Typography>
                        <Grid 
                            container 
                            spacing={{ xs: 3, md: 6 }} 
                            alignItems="center"
                        >
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        p: 4,
                                        borderRadius: '16px',
                                        backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)'
                                        }
                                    }}
                                >
                                    <Stack spacing={3}>
                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}>
                                            <Box sx={{ 
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'primary.main',
                                                mr: 2
                                            }}>
                                                📞
                                            </Box>
                                            <Typography 
                                                variant="h6"
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    color: 'text.primary'
                                                }}
                                            >
                                                408-634-9181
                                            </Typography>
                                        </Box>
                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}>
                                            <Box sx={{ 
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'primary.main',
                                                mr: 2
                                            }}>
                                                📍
                                            </Box>
                                            <Typography 
                                                variant="h6"
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    color: 'text.primary'
                                                }}
                                            >
                                                Serving Santa Cruz County
                                            </Typography>
                                        </Box>
                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}>
                                            <Box sx={{ 
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'primary.main',
                                                mr: 2
                                            }}>
                                                ✉️
                                            </Box>
                                            <Typography 
                                                variant="h6"
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    color: 'text.primary'
                                                }}
                                            >
                                                info@precisiondetailing.com
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        height: '400px',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)'
                                        }
                                    }}
                                >
                                    <Box 
                                        component="iframe"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.4780829725!2d-122.03091!3d36.9741524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808e41a7d9cb5555%3A0x40f82d5b9c40920!2sSanta%20Cruz%2C%20CA!5e0!3m2!1sen!2sus!4v1608680425746!5m2!1sen!2sus"
                                        width="100%"
                                        height="400"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
