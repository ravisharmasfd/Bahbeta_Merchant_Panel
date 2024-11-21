import React, { useContext, useState } from 'react';
import { Navbar, Nav, Dropdown, Button, Badge, Image } from 'react-bootstrap';
import { FaBell, FaPhoneAlt } from 'react-icons/fa';
import { MdAddCircle } from 'react-icons/md';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { UserContext } from '../store/context';

const Header = () => {
  const [notifications] = useState([
    { id: 1, message: 'New invoice created.', time: '2 mins ago' },
    { id: 2, message: 'Payment received.', time: '10 mins ago' },
    { id: 3, message: 'User registered.', time: '1 hour ago' }
  ]);
  const {user,setUser } = useContext(UserContext)

  return (
    <Navbar className="custom-navbar" expand="lg" fixed="top" bg="white">
      <Navbar.Brand as={Link} to="/" className="dashboard-title">
        Dashboard
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto d-flex align-items-center gap">
          <Link to="/create-invoice" className="text-decoration-none">
            <Button variant="primary" className="mr-3 d-flex align-items-center">
              <MdAddCircle size={20} className="mr-2" /> Create Invoice
            </Button>
          </Link>

          <Nav.Link href="#call" className="mr-3">
            <FaPhoneAlt size={20} />
          </Nav.Link>

          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-basic" className="notification-icon">
              <FaBell size={20} />
              <Badge variant="danger" className="notification-badge">
                {notifications.length}
              </Badge>
            </Dropdown.Toggle>

            <Dropdown.Menu className="notification-menu">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Dropdown.Item key={notification.id} className="notification-item">
                    <div className="d-flex justify-content-between">
                      <span>{notification.message}</span>
                      <small className="text-muted">{notification.time}</small>
                    </div>
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item>No notifications</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown align="end" className="ml-3">
            <Dropdown.Toggle variant="light" id="profile-dropdown">
              <Image
                src="https://via.placeholder.com/30" // Replace with profile image URL
                roundedCircle
                alt="Profile"
                className="mr-2"
              />
              <span className="user-name">{user?.businessName}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={()=>{
                setUser(null)
                localStorage.clear();
              }} as={Link} to="/login">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
