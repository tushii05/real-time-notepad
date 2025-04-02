import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-auto">
            <Container>
                <Row>
                    <Col md={4} className="mb-3">
                        <h5 className="text-primary">Notepad Pro</h5>
                        <p className="small">Your secure notes management solution</p>
                    </Col>
                    <Col md={4} className="mb-3">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-white text-decoration-none">Home</a></li>
                            <li><a href="/features" className="text-white text-decoration-none">Features</a></li>
                            <li><a href="/pricing" className="text-white text-decoration-none">Pricing</a></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5>Contact</h5>
                        <ul className="list-unstyled small">
                            <li><i className="bi bi-envelope me-2"></i> support@notepadpro.com</li>
                            <li><i className="bi bi-telephone me-2"></i> +1 (555) 123-4567</li>
                        </ul>
                    </Col>
                </Row>
                <hr className="my-3 bg-secondary" />
                <Row>
                    <Col className="text-center small">
                        &copy; {new Date().getFullYear()} Notepad Pro. All rights reserved.
                        <div className="mt-2">
                            <a href="/privacy" className="text-white text-decoration-none me-3">Privacy Policy</a>
                            <a href="/terms" className="text-white text-decoration-none">Terms of Service</a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;