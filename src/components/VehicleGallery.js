import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Dialog, 
    DialogContent, 
    IconButton 
} from '@mui/material';
import { 
    Close as CloseIcon,
    ChevronLeft as PrevIcon,
    ChevronRight as NextIcon 
} from '@mui/icons-material';

const galleryImages = [
    {
        before: '/images/car-before-1.jpg',
        after: '/images/car-after-1.jpg',
        description: 'Luxury Sedan Ceramic Coating'
    },
    {
        before: '/images/suv-before-2.jpg',
        after: '/images/suv-after-2.jpg',
        description: 'SUV Interior Detailing'
    },
    {
        before: '/images/truck-before-3.jpg',
        after: '/images/truck-after-3.jpg',
        description: 'Truck Paint Correction'
    }
];

export default function VehicleGallery() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpenImage = (index) => {
        setSelectedImage(galleryImages[index]);
        setCurrentIndex(index);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    const handleNextImage = () => {
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        setSelectedImage(galleryImages[nextIndex]);
        setCurrentIndex(nextIndex);
    };

    const handlePrevImage = () => {
        const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        setSelectedImage(galleryImages[prevIndex]);
        setCurrentIndex(prevIndex);
    };

    return (
        <Box sx={{ py: 6 }}>
            <Typography 
                variant="h3" 
                align="center" 
                gutterBottom 
                sx={{ 
                    fontWeight: 'bold',
                    mb: 4,
                    color: 'primary.main' 
                }}
            >
                Our Transformations
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {galleryImages.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                '&:hover': { 
                                    transform: 'scale(1.05)' 
                                }
                            }}
                            onClick={() => handleOpenImage(index)}
                        >
                            <Box 
                                component="img"
                                src={image.before}
                                alt={`Before ${image.description}`}
                                sx={{ 
                                    width: '100%', 
                                    height: 250, 
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    mb: 2 
                                }}
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {image.description}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Dialog 
                open={!!selectedImage} 
                onClose={handleCloseImage}
                maxWidth="md"
                fullWidth
            >
                <DialogContent sx={{ position: 'relative', p: 0 }}>
                    <IconButton 
                        onClick={handleCloseImage} 
                        sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10, 
                            zIndex: 10 
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <IconButton 
                        onClick={handlePrevImage} 
                        sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: 10, 
                            zIndex: 10 
                        }}
                    >
                        <PrevIcon />
                    </IconButton>

                    <IconButton 
                        onClick={handleNextImage} 
                        sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            right: 10, 
                            zIndex: 10 
                        }}
                    >
                        <NextIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex' }}>
                        <Box 
                            component="img"
                            src={selectedImage?.before}
                            alt="Before"
                            sx={{ 
                                width: '50%', 
                                height: 500, 
                                objectFit: 'cover' 
                            }}
                        />
                        <Box 
                            component="img"
                            src={selectedImage?.after}
                            alt="After"
                            sx={{ 
                                width: '50%', 
                                height: 500, 
                                objectFit: 'cover' 
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
