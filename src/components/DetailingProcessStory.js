import React from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Container, 
    Card, 
    CardContent 
} from '@mui/material';
import { motion } from 'framer-motion';

const detailingSteps = [
    {
        title: 'Initial Inspection',
        description: 'We begin with a comprehensive vehicle assessment, identifying specific needs and areas requiring special attention.',
        icon: '🔍',
        color: 'primary.main'
    },
    {
        title: 'Preparation',
        description: 'Thorough washing and decontamination to remove dirt, grime, and surface contaminants using premium cleaning agents.',
        icon: '🧼',
        color: 'secondary.main'
    },
    {
        title: 'Paint Correction',
        description: 'Precision polishing and correction to remove swirl marks, scratches, and restore the paint\'s original luster.',
        icon: '✨',
        color: 'warning.main'
    },
    {
        title: 'Protection',
        description: 'Application of high-grade ceramic coating or sealant to provide long-lasting protection against environmental damage.',
        icon: '🛡️',
        color: 'success.main'
    },
    {
        title: 'Interior Detailing',
        description: 'Deep cleaning of interior surfaces, including leather conditioning, fabric treatment, and thorough sanitization.',
        icon: '🚗',
        color: 'info.main'
    },
    {
        title: 'Final Inspection',
        description: 'Meticulous final review to ensure every detail meets our highest standards of quality and perfection.',
        icon: '🏆',
        color: 'primary.light'
    }
];

export default function DetailingProcessStory() {
    return (
        <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
            <Container>
                <Typography 
                    variant="h3" 
                    align="center" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 6,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                >
                    Our Precision Detailing Process
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {detailingSteps.map((step, index) => (
                        <Grid 
                            item 
                            xs={12} 
                            sm={6} 
                            md={4} 
                            key={index}
                            component={motion.div}
                            initial={{ opacity: 0, translateY: 50 }}
                            whileInView={{ 
                                opacity: 1, 
                                translateY: 0,
                                transition: { 
                                    duration: 0.5, 
                                    delay: index * 0.2 
                                }
                            }}
                            viewport={{ once: true }}
                        >
                            <Card 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                        boxShadow: '0 15px 30px rgba(255, 215, 0, 0.2)'
                                    }
                                }}
                            >
                                <CardContent sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    textAlign: 'center',
                                    flex: 1 
                                }}>
                                    <Box 
                                        sx={{ 
                                            fontSize: '4rem', 
                                            color: step.color,
                                            mb: 2 
                                        }}
                                    >
                                        {step.icon}
                                    </Box>
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            fontWeight: 'bold', 
                                            mb: 2,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        color="text.secondary"
                                    >
                                        {step.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
