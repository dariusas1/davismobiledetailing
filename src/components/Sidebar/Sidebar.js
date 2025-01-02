import React from 'react';
import { 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Divider 
} from '@mui/material';
import { 
    Dashboard as DashboardIcon, 
    Book as BookIcon, 
    ContactPage as ContactIcon, 
    Home as HomeIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();

    const menuItems = [
        { 
            text: 'Home', 
            icon: <HomeIcon />, 
            path: '/' 
        },
        { 
            text: 'Dashboard', 
            icon: <DashboardIcon />, 
            path: '/dashboard' 
        },
        { 
            text: 'Booking', 
            icon: <BookIcon />, 
            path: '/booking' 
        },
        { 
            text: 'Contact', 
            icon: <ContactIcon />, 
            path: '/contact' 
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        onClose && onClose();
    };

    return (
        <Drawer 
            anchor="left" 
            open={open} 
            onClose={onClose}
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                }
            }}
        >
            <List>
                {menuItems.map((item, index) => (
                    <ListItem 
                        button 
                        key={item.text} 
                        onClick={() => handleNavigation(item.path)}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Drawer>
    );
};

export default Sidebar;