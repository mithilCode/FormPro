import React, { useState } from 'react';
import { Box, Drawer, Typography, ListItemIcon, Grid } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Slide from '@mui/material/Slide';
import { menuItem } from './data';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Link from '@themes/overrides/Link';
import { css } from '@mui/system';
// import { Button } from '@mui/base';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './sidebar.css';
const Sidebar = ({ open1 }) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};
	const handleCancel = () => {
		setIsDrawerOpen(false);
	};
	return (
		<>
			<MuiDrawer variant="permanent" open>
				<List>
					{['Inbox', 'Starred'].map((text, index) => (
						<ListItem key={text} disablePadding sx={{ display: 'block' }}>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: 'center',
									px: 2.5
								}}>
								<ListItemIcon
									sx={{
										minWidth: 400,
										mr: 'auto',
										justifyContent: 'center',
										cursor: 'pointer' // Add cursor pointer for click
									}}
									onClick={toggleDrawer} // Toggle the drawer when the icon is clicked
								>
									{/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
									{index % 2 === 0 && <InboxIcon />}
								</ListItemIcon>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</MuiDrawer>
			<Slide
				direction="right"
				in={isDrawerOpen}
				mountOnEnter
				unmountOnExit
				style={{
					zIndex: 2,
					width: open1 ? '85%' : '92%',
					position: 'fixed',
					left: open1 ? '282px' : '90px', // Adjust the left position
					backgroundColor: '#f5f5f5',
					display: isDrawerOpen ? 'flex' : 'none',
					border: 'solid #b4b4bd',
					borderWidth: '1.5px 0 0 1.5px',
					padding: '20px',
					flexDirection: 'column',
					boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
					top: '80px',
					alignContent: 'flex-start',
					background: '#ffffff'
				}}>
				<Grid
					container
					spacing={2}
					sx={{
						width: '100%',
						height: '80%',
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: '250px',
							boxSizing: 'border-box'
						}
					}}
					variant="persistent"
					anchor="left"
					open={isDrawerOpen}>
					{menuItem?.map(item => (
						<Grid item key={item?.Caption} sx={{ width: 'fit-content' }}>
							<Typography
								id="basic-list-demo"
								level="body-xs"
								textTransform="uppercase"
								fontWeight="600"
								color="#000000"
								sx={{
									display: 'flex',
									alignItems: 'center',
									position: 'relative'
								}}>
								<ArrowRightIcon />
								{item?.Caption}
							</Typography>
							<Grid>
								{item?.SubMenu?.map(item => (
									<Grid
										item
										key={item?.Caption}
										sx={{
											padding: 0,
											...css({
												'& a:hover': {
													position: 'relative'
												}
											})
										}}>
										<a
											href={item?.Url}
											target="_blank"
											onClick={handleCancel}
											rel="noopener noreferrer"
											style={{ textDecoration: 'none' }}>
											<Typography className="link-text">
												{item?.Caption}
											</Typography>
										</a>
										<div
											style={{
												position: 'absolute',
												top: '20px',
												right: '20px'
											}}>
											<IconButton color="primary">
												<HighlightOffIcon onClick={handleCancel} />
											</IconButton>
										</div>
									</Grid>
								))}
							</Grid>
						</Grid>
					))}
				</Grid>
			</Slide>
		</>
	);
};

export default Sidebar;
